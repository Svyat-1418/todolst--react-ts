import {ResultCodes, todolistAPI, TodolistType} from "../../api/todolistAPI";
import {AppThunk} from "../../App/store";
import {clearData, RequestStatusType, setAppStatus} from "../../App/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {AxiosError} from "axios";
import {fetchTasksTC} from "./tasksReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodolists: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
      return action.payload.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
    },
    removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      if (index > -1) {
        state.splice(index, 1)
      }
    },
    addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
    },
    changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].title = action.payload.title
    },
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
      .addCase(clearData, () => { return [] })
  }
})

export const {
  setTodolists, removeTodolist, addTodolist,
  changeTodolistTitle, changeTodolistFilter, changeTodolistEntityStatus
} = todosSlice.actions
export const todolistsReducer = todosSlice.reducer

/*

export const todolistsReducer =
  (state: Array<TodolistDomainType> = initialState, action: TodolistsActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
      case "SET_TODOLISTS":
        return action.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
      case 'REMOVE_TODOLIST':
        return state.filter(tl => tl.id !== action.id)
      case 'ADD_TODOLIST':
        return [{...action.todolist, filter: "all", entityStatus: "idle"}, ...state]
      case 'CHANGE_TODOLIST_TITLE':
        return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
      case 'CHANGE_TODOLIST_FILTER':
        return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
      case 'CHANGE_TODOLIST_ENTITY_STATUS':
        return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
      case "CLEAR_DATA":
        return state = []
      default:
        return state
    }
  }

//Actions
export const setTodolistsAC = (todolists: Array<TodolistType>) =>
  ({type: 'SET_TODOLISTS', todolists} as const)
export const removeTodolistAC = (id: string) =>
  ({type: 'REMOVE_TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) =>
  ({type: 'ADD_TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
  ({type: 'CHANGE_TODOLIST_TITLE', id, title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
  ({type: "CHANGE_TODOLIST_FILTER", id, filter} as const)
export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) =>
  ({type: "CHANGE_TODOLIST_ENTITY_STATUS", id, entityStatus} as const)
export const clearDataAC = () => ({type: "CLEAR_DATA"} as const)
*/

//Thunks
export const fetchTodolistsTC = (): AppThunk => (dispatch) => {
  dispatch(setAppStatus({status: "loading"}))
  todolistAPI.getTodolists()
    .then((res) => {
      dispatch(setTodolists({todolists: res.data}))
      dispatch(setAppStatus({status: "succeeded"}))
      return res.data
    })
    .then(todos => {
      todos.forEach(tl => dispatch(fetchTasksTC(tl.id)))
    })
}
export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
  dispatch(setAppStatus({status: "loading"}))
  todolistAPI.createTodolist(title)
    .then((res) => {
      if (res.data.resultCode === ResultCodes.success) {
        dispatch(addTodolist({todolist: res.data.data.item}))
      } else if (res.data.resultCode === ResultCodes.error && res.data.messages.length) {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error, dispatch)
    })
}
export const removeTodolistTC = (id: string): AppThunk => (dispatch) => {
  dispatch(setAppStatus({status: "loading"}))
  dispatch(changeTodolistEntityStatus({id, entityStatus: "loading"}))
  todolistAPI.deleteTodolist(id)
    .then((res) => {
      dispatch(removeTodolist({id}))
      dispatch(setAppStatus({status: "succeeded"}))
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error, dispatch)
    })
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => (dispatch) => {
  dispatch(setAppStatus({status: "loading"}))
  dispatch(changeTodolistEntityStatus({id, entityStatus: "loading"}))
  todolistAPI.updateTodolist(id, title)
    .then((res) => {
      if (res.data.resultCode === ResultCodes.success) {
        dispatch(changeTodolistTitle({id, title}))
        dispatch(changeTodolistEntityStatus({id, entityStatus: "idle"}))
      } else if (res.data.resultCode === ResultCodes.error && res.data.messages.length) {
        handleServerAppError(res.data, dispatch)
      }
      dispatch(changeTodolistEntityStatus({id, entityStatus: "idle"}))
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error, dispatch)
    })
}

//Types
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType &
  { filter: FilterValuesType, entityStatus: RequestStatusType }
