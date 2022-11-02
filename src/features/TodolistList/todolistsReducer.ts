import {ResultCode, todolistAPI, TodolistType} from "../../api/todolistAPI";
import {AppThunk} from "../../App/store";
import {clearData, RequestStatusType, setAppStatus} from "../../App/appReducer";
import {handleServerAppError, handleServerNetworkError, ThunkError} from "../../utils/errorUtils";
import {AxiosError} from "axios";
import {fetchTasks} from "./tasksReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const fetchTodolists = createAsyncThunk<{ todolists: TodolistType[] }>("todolists/fetchTodolists",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    try {
      const res = await todolistAPI.getTodolists()
      const todolists = res.data
      todolists.forEach(tl => thunkAPI.dispatch(fetchTasks({todolistId: tl.id})))
      thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
      return {todolists}
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

export const addTodolist = createAsyncThunk<
  { todolist: TodolistType }, string, ThunkError>('todolists/addTodolist',
  async (title, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: 'loading'}))
  try {
    const res = await todolistAPI.createTodolist(title)
    if (res.data.resultCode === ResultCode.success) {
      thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
      return {todolist: res.data.data.item}
    } else {
      return handleServerAppError(res.data, thunkAPI, false)
    }
  } catch (error) {
    return handleServerNetworkError(error as AxiosError, thunkAPI, false)
  }
})

export const removeTodolist = createAsyncThunk<{ id: string }, { id: string }>("todolists/removeTodolist",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    thunkAPI.dispatch(changeTodolistEntityStatus({id: payload.id, entityStatus: "loading"}))
    try {
      await todolistAPI.deleteTodolist(payload.id)
      thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
      return {id: payload.id}
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

export const changeTodolistTitle = createAsyncThunk<
  {id: string, title: string}, {id: string, title: string}>("todolists/changeTodolistTitle",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    thunkAPI.dispatch(changeTodolistEntityStatus({id: payload.id, entityStatus: "loading"}))
  try {
      const res = await todolistAPI.updateTodolist(payload.id, payload.title)
    if (res.data.resultCode === ResultCode.success) {
      thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
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
      .addCase(clearData, () => {
        return []
      })
  }
})

export const {changeTodolistFilter, changeTodolistEntityStatus} = todosSlice.actions
export const todolistsReducer = todosSlice.reducer


export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType &
  { filter: FilterValuesType, entityStatus: RequestStatusType }


/*
import {ResultCode, todolistAPI, TodolistType} from "../../api/todolistAPI"
import {RequestStatusType} from "../../App/appReducer"
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {handleAsyncServerAppError, handleAsyncServerNetworkError,} from '../../utils/errorUtils'
import {ThunkError} from "../../utils/errorUtils"
import {setAppStatus} from "../../App/appReducer"
import {AxiosError} from "axios";

const fetchTodolistsTC = createAsyncThunk<{ todolists: TodolistType[] }, void, ThunkError>('todolists/fetchTodolists',
  async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: 'loading'}))
  try {
    const res = await todolistAPI.getTodolists()
    thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
    return {todolists: res.data}
  } catch (error) {
    return handleAsyncServerNetworkError(error as AxiosError, thunkAPI)
  }
})
const removeTodolistTC = createAsyncThunk<{ id: string }, string, ThunkError>('todolists/removeTodolist',
  async (todolistId, {dispatch, rejectWithValue}) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatus({status: 'loading'}))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
    await todolistAPI.deleteTodolist(todolistId)
    //скажем глобально приложению, что асинхронная операция завершена
    dispatch(setAppStatus({status: 'succeeded'}))
    return {id: todolistId}
  })
const addTodolistTC = createAsyncThunk<{ todolist: TodolistType }, string, ThunkError>
('todolists/addTodolist', async (title, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: 'loading'}))
  try {
    const res = await todolistAPI.createTodolist(title)
    if (res.data.resultCode === ResultCode.success) {
      thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
      return {todolist: res.data.data.item}
    } else {
      return handleAsyncServerAppError(res.data, thunkAPI, false)
    }
  } catch (error) {
    return handleAsyncServerNetworkError(error, thunkAPI, false)
  }
})
const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle', async (param: { id: string, title: string }, thunkAPI) => {
  try {
    const res = await todolistsAPI.updateTodolist(param.id, param.title)
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
      return {id: param.id, title: param.title}
    } else {
      return handleAsyncServerAppError(res.data, thunkAPI)
    }
  } catch (error) {
    return handleAsyncServerNetworkError(error, thunkAPI, false)
  }
})

export const asyncActions = {
  fetchTodolistsTC,
  removeTodolistTC,
  addTodolistTC,
  changeTodolistTitleTC
}

export const slice = createSlice({
  name: 'todolists',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].entityStatus = action.payload.status
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({...tl, filter: 'all', entityStatus: 'idle'}))
      })
      .addCase(removeTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id)
        if (index > -1) {
          state.splice(index, 1)
        }
      })
      .addCase(addTodolistTC.fulfilled, (state, action) => {
        state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id)
        state[index].title = action.payload.title
      })
  }
})

export const {changeTodolistFilter, changeTodolistEntityStatus} = slice.actions

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
*/
