import {ResultCode, todolistAPI, TodolistType} from "../../api/todolistAPI";
import {appActions, RequestStatusType} from "../../App/appReducer";
import {createAppAsyncThunk} from "../../common/utils/createAppAsyncThunk";
import {handleServerAppError} from "../../common/utils/handleServerAppError";
import {thunkTryCatch} from "../../common/utils/thunkTryCatch";
import {tasksThunks} from "./tasksReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }>(
  "todolists/fetchTodolists",
  async (_, thunkAPI) => {
    const {dispatch} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.getTodolists()
      const todolists = res.data
      todolists.forEach(tl => dispatch(tasksThunks.fetchTasks({todolistId: tl.id})))
      return {todolists}
    })
  })

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  'todolists/addTodolist',
  async (title, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.createTodolist(title)
      if (res.data.resultCode === ResultCode.success) {
        return {todolist: res.data.data.item}
      } else {
        handleServerAppError(res.data, dispatch, false)
        return rejectWithValue(null)
      }
    })
})

const removeTodolist = createAppAsyncThunk<{ id: string }, { id: string }>(
  "todolists/removeTodolist",
  async (payload, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    thunkAPI.dispatch(todolistsActions.changeTodolistEntityStatus({
      id: payload.id,
      entityStatus: "loading"
    }))
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.deleteTodolist(payload.id)
      if (res.data.resultCode === ResultCode.success) {
        return {id: payload.id}
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  })

const changeTodolistTitle = createAppAsyncThunk<
  { id: string, title: string },
  { id: string, title: string }
>("todolists/changeTodolistTitle",
  async (payload, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(todolistsActions.changeTodolistEntityStatus({
      id: payload.id,
      entityStatus: "loading"
    }))
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.updateTodolist(payload.id, payload.title)
      if (res.data.resultCode === ResultCode.success) {
        return {id: payload.id, title: payload.title}
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
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


