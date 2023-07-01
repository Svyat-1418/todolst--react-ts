import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RequestStatusType, appActions } from 'app/app.slice'
import { ResultCode } from 'common/enums/common.enums'
import { createAppAsyncThunk } from 'common/utils/createAppAsyncThunk'

import { taskThunks } from '../Task/task.slice'

import {
	CreateTodolistArgType,
	DeleteTodolistArgType,
	TodolistType,
	UpdateTodolistArgType,
	todolistAPI,
} from './todolist.api'

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }>(
	'todolists/fetchTodolists',
	async (_, { dispatch }) => {
		const res = await todolistAPI.getTodolists()
		const todolists = res.data
		todolists.forEach((tl) => dispatch(taskThunks.fetchTasks({ todolistId: tl.id })))
		return { todolists }
	}
)

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, CreateTodolistArgType>(
	'todolists/addTodolist',
	async (arg, { rejectWithValue }) => {
		const res = await todolistAPI.createTodolist(arg)
		if (res.data.resultCode === ResultCode.success) {
			return { todolist: res.data.data.item }
		} else {
			return rejectWithValue({ data: res.data, showGlobalError: false })
		}
	}
)

const removeTodolist = createAppAsyncThunk<DeleteTodolistArgType, DeleteTodolistArgType>(
	'todolists/removeTodolist',
	async (arg, { dispatch, rejectWithValue }) => {
		dispatch(
			todolistsActions.changeTodolistEntityStatus({
				id: arg.id,
				entityStatus: 'loading',
			})
		)
		const res = await todolistAPI.deleteTodolist(arg)
		if (res.data.resultCode === ResultCode.success) {
			return arg
		} else {
			return rejectWithValue({ data: res.data, showGlobalError: true })
		}
	}
)

const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistArgType, UpdateTodolistArgType>(
	'todolists/changeTodolistTitle',
	async (arg, { dispatch, rejectWithValue }) => {
		dispatch(
			todolistsActions.changeTodolistEntityStatus({
				id: arg.id,
				entityStatus: 'loading',
			})
		)
		const res = await todolistAPI.updateTodolist(arg)
		if (res.data.resultCode === ResultCode.success) {
			dispatch(
				todolistsActions.changeTodolistEntityStatus({
					id: arg.id,
					entityStatus: 'loading',
				})
			)
			return arg
		} else {
			return rejectWithValue({ data: res.data, showGlobalError: true })
		}
	}
)

const slice = createSlice({
	name: 'todos',
	initialState: [] as Array<TodolistDomainType>,
	reducers: {
		changeTodolistFilter: (
			state,
			action: PayloadAction<{ id: string; filter: FilterValuesType }>
		) => {
			const index = state.findIndex((tl) => tl.id === action.payload.id)
			state[index].filter = action.payload.filter
		},
		changeTodolistEntityStatus: (
			state,
			action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>
		) => {
			const index = state.findIndex((tl) => tl.id === action.payload.id)
			state[index].entityStatus = action.payload.entityStatus
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTodolists.fulfilled, (state, action) => {
				return action.payload.todolists.map((tl) => ({
					...tl,
					filter: 'all',
					entityStatus: 'idle',
				}))
			})
			.addCase(addTodolist.fulfilled, (state, action) => {
				state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
			})
			.addCase(removeTodolist.fulfilled, (state, action) => {
				const index = state.findIndex((tl) => tl.id === action.payload.id)
				if (index > -1) {
					state.splice(index, 1)
				}
			})
			.addCase(changeTodolistTitle.fulfilled, (state, action) => {
				const index = state.findIndex((tl) => tl.id === action.payload.id)
				state[index].title = action.payload.title
			})
			.addCase(appActions.clearData, () => {
				return []
			})
	},
})

export const { reducer: todolistsReducer, actions: todolistsActions } = slice
export const todolistThunks = {
	addTodolist,
	changeTodolistTitle,
	fetchTodolists,
	removeTodolist,
}

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
	filter: FilterValuesType
	entityStatus: RequestStatusType
}
