import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RequestStatusType, appActions } from 'app/app.slice'
import { ResultCode } from 'common/enums/common.enums'
import { createAppAsyncThunk } from 'common/utils/createAppAsyncThunk'

import { todolistThunks } from '../Todolist/todolist.slice'

import {
	CreateTaskArgType,
	DeleteTaskArgType,
	GetTasksArgType,
	TaskType,
	UpdateTaskModelType,
	taskAPI,
} from './task.api'

const fetchTasks = createAppAsyncThunk<
	{ todolistId: string; tasks: TaskType[] },
	GetTasksArgType
>('tasks/fetchTasks', async (arg) => {
	const res = await taskAPI.getTasks(arg)
	return { todolistId: arg.todolistId, tasks: res.data.items }
})

const addTask = createAppAsyncThunk<{ task: TaskType }, CreateTaskArgType>(
	'tasks/addTask',
	async (arg, { rejectWithValue }) => {
		const res = await taskAPI.createTask(arg)
		if (res.data.resultCode === ResultCode.success) {
			return { task: res.data.data.item }
		} else {
			return rejectWithValue({ data: res.data, showGlobalError: false })
		}
	}
)

const removeTask = createAppAsyncThunk<DeleteTaskArgType, DeleteTaskArgType>(
	'tasks/removeTask',
	async (arg, { dispatch, rejectWithValue }) => {
		dispatch(
			tasksActions.changeTaskEntityStatus({
				id: arg.id,
				todolistId: arg.todolistId,
				entityStatus: 'loading',
			})
		)
		const res = await taskAPI.deleteTask(arg)
		if (res.data.resultCode === ResultCode.success) {
			return arg
		} else {
			return rejectWithValue({ data: res.data, showGlobalError: true })
		}
	}
)

const updateTask = createAppAsyncThunk<UpdateTaskDomainArgType, UpdateTaskDomainArgType>(
	'tasks/updateTask',
	async (arg, { dispatch, getState, rejectWithValue }) => {
		dispatch(
			tasksActions.changeTaskEntityStatus({
				id: arg.id,
				todolistId: arg.todolistId,
				entityStatus: 'loading',
			})
		)
		const correctTask = getState().tasks[arg.todolistId].find((t) => t.id === arg.id)
		if (!correctTask) {
			dispatch(appActions.setAppError({ error: 'Task not found in the state' }))
			return rejectWithValue(null)
		}

		const apiModel: UpdateTaskModelType = {
			description: correctTask.description,
			startDate: correctTask.startDate,
			deadline: correctTask.deadline,
			priority: correctTask.priority,
			title: correctTask.title,
			status: correctTask.status,
			...arg.domainModel,
		}

		const apiArg = { id: arg.id, todolistId: arg.todolistId, apiModel }
		const res = await taskAPI.updateTask(apiArg)
		if (res.data.resultCode === ResultCode.success) {
			dispatch(
				tasksActions.changeTaskEntityStatus({
					id: arg.id,
					todolistId: arg.todolistId,
					entityStatus: 'succeeded',
				})
			)
			return arg
		} else {
			return rejectWithValue({ data: res.data, showGlobalError: true })
		}
	}
)

const slice = createSlice({
	name: 'tasks',
	initialState: {} as TaskStateType,
	reducers: {
		changeTaskEntityStatus: (
			state,
			action: PayloadAction<{
				id: string
				todolistId: string
				entityStatus: RequestStatusType
			}>
		) => {
			const tasks = state[action.payload.todolistId]
			const index = tasks.findIndex((t) => t.id === action.payload.id)
			if (index > -1) {
				tasks[index].entityStatus = action.payload.entityStatus
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTasks.fulfilled, (state, action) => {
				state[action.payload.todolistId] = action.payload.tasks.map((t) => ({
					...t,
					entityStatus: 'idle',
				}))
			})
			.addCase(addTask.fulfilled, (state, action) => {
				state[action.payload.task.todoListId].unshift({
					...action.payload.task,
					entityStatus: 'idle',
				})
			})
			.addCase(removeTask.fulfilled, (state, action) => {
				const tasks = state[action.payload.todolistId]
				const index = tasks.findIndex((t) => t.id === action.payload.id)
				if (index > -1) {
					state[action.payload.todolistId].splice(index, 1)
				}
			})
			.addCase(updateTask.fulfilled, (state, action) => {
				const tasks = state[action.payload.todolistId]
				const index = tasks.findIndex((t) => t.id === action.payload.id)
				if (index > -1) {
					tasks[index] = { ...tasks[index], ...action.payload.domainModel }
				}
			})
			.addCase(appActions.clearData, () => {})
			.addCase(todolistThunks.fetchTodolists.fulfilled, (state, action) => {
				action.payload.todolists.forEach((tl) => {
					state[tl.id] = []
				})
			})
			.addCase(todolistThunks.addTodolist.fulfilled, (state, action) => {
				state[action.payload.todolist.id] = []
			})
			.addCase(todolistThunks.removeTodolist.fulfilled, (state, action) => {
				delete state[action.payload.id]
			})
	},
})

export const { reducer: tasksReducer, actions: tasksActions } = slice
export const taskThunks = { addTask, fetchTasks, removeTask, updateTask }

export type TaskDomainType = TaskType & { entityStatus: RequestStatusType }
export type TaskStateType = { [key: string]: Array<TaskDomainType> }
export type UpdateTaskDomainModelType = Partial<UpdateTaskModelType>
type UpdateTaskDomainArgType = {
	id: string
	todolistId: string
	domainModel: UpdateTaskDomainModelType
}
