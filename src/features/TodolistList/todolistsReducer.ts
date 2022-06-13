import {ResultCodes, todolistAPI, TodolistType} from "../../api/todolistAPI";
import {AppThunk} from "../../App/store";
import {RequestStatusType, setAppStatusAC} from "../../App/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {AxiosError} from "axios";

const initialState: Array<TodolistDomainType> = []

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

//Thunks
export const fetchTodolistsTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setAppStatusAC("succeeded"))
        })
}
export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistAPI.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === ResultCodes.success) {
                dispatch(addTodolistAC(res.data.data.item))
            } else if (res.data.resultCode === ResultCodes.error && res.data.messages.length) {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const removeTodolistTC = (id: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC("loading"))
    dispatch(changeTodolistEntityStatusAC(id, "loading"))
    todolistAPI.deleteTodolist(id)
        .then((res) => {
            dispatch(removeTodolistAC(id))
            dispatch(setAppStatusAC("succeeded"))
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC("loading"))
    dispatch(changeTodolistEntityStatusAC(id, "loading"))
    todolistAPI.updateTodolist(id, title)
        .then((res) => {
            if (res.data.resultCode === ResultCodes.success) {
                dispatch(changeTodolistTitleAC(id, title))
                dispatch(changeTodolistEntityStatusAC(id, "idle"))
            } else if (res.data.resultCode === ResultCodes.error && res.data.messages.length) {
                handleServerAppError(res.data, dispatch)
            }
            dispatch(changeTodolistEntityStatusAC(id, "idle"))
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(error, dispatch)
        })
}

//Types
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType &
    { filter: FilterValuesType, entityStatus: RequestStatusType }
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type TodolistsActionsType =
    SetTodolistsActionType
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>