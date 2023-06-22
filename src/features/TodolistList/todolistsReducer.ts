import {ResultCode, todolistAPI, TodolistType} from "../../api/todolistAPI";
import {appActions, RequestStatusType} from "../../App/appReducer";
import {handleServerAppError, handleServerNetworkError, ThunkError} from "../../utils/errorUtils";
import {AxiosError} from "axios";
import {tasksThunks} from "./tasksReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const fetchTodolists = createAsyncThunk<{ todolists: TodolistType[] }>("todolists/fetchTodolists",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: "loading"}))
    try {
      const res = await todolistAPI.getTodolists()
      const todolists = res.data
      todolists.forEach(tl => thunkAPI.dispatch(tasksThunks.fetchTasks({todolistId: tl.id})))
      thunkAPI.dispatch(appActions.setAppStatus({status: "succeeded"}))
      return {todolists}
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

const addTodolist = createAsyncThunk<
  { todolist: TodolistType }, string, ThunkError>('todolists/addTodolist',
  async (title, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
  try {
    const res = await todolistAPI.createTodolist(title)
    if (res.data.resultCode === ResultCode.success) {
      thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
      return {todolist: res.data.data.item}
    } else {
      return handleServerAppError(res.data, thunkAPI, false)
    }
  } catch (error) {
    return handleServerNetworkError(error as AxiosError, thunkAPI, false)
  }
})

const removeTodolist = createAsyncThunk<{ id: string }, { id: string }>("todolists/removeTodolist",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: "loading"}))
    thunkAPI.dispatch(todolistsActions.changeTodolistEntityStatus({id: payload.id, entityStatus: "loading"}))
    try {
      await todolistAPI.deleteTodolist(payload.id)
      thunkAPI.dispatch(appActions.setAppStatus({status: "succeeded"}))
      return {id: payload.id}
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

const changeTodolistTitle = createAsyncThunk<
  {id: string, title: string}, {id: string, title: string}>("todolists/changeTodolistTitle",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: "loading"}))
    thunkAPI.dispatch(todolistsActions.changeTodolistEntityStatus({id: payload.id, entityStatus: "loading"}))
  try {
      const res = await todolistAPI.updateTodolist(payload.id, payload.title)
    if (res.data.resultCode === ResultCode.success) {
      thunkAPI.dispatch(appActions.setAppStatus({status: "succeeded"}))
      return {id: payload.id, title: payload.title}
    } else {
      return handleServerAppError(res.data, thunkAPI)
    }
  } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
  }
  })

const todosSlice = createSlice({
  name: "todos",
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].entityStatus = action.payload.entityStatus
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id)
        if (index > -1) {
          state.splice(index, 1)
        }
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id)
        state[index].title = action.payload.title
      })
      .addCase(appActions.clearData, () => {
        return []
      })
  }
})

export const {reducer: todolistsReducer, actions: todolistsActions} = todosSlice
export const todolistsThunks = { addTodolist, changeTodolistTitle, fetchTodolists, removeTodolist }

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType &
  { filter: FilterValuesType, entityStatus: RequestStatusType }


