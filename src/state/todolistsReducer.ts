import {todolistAPI, TodolistType} from "../api/todolistAPI";
import {AppThunk} from "./store";

export type SetTodolistsActionType = {
    type: "SET_TODOLISTS"
    todolists: Array<TodolistType>
}
export type RemoveTodolistActionType = {
    type: 'REMOVE_TODOLIST'
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD_TODOLIST'
    todolist: TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE_TODOLIST_TITLE'
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE_TODOLIST_FILTER'
    id: string
    filter: FilterValuesType
}
export type TodolistsActionsType = SetTodolistsActionType
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer =
    (state: Array<TodolistDomainType> = initialState, action: TodolistsActionsType): Array<TodolistDomainType> => {
        switch (action.type) {
            case 'SET_TODOLISTS': {
                return action.todolists.map(tl => ({...tl, filter: 'all'}))
            }
            case 'REMOVE_TODOLIST': {
                return state.filter(tl => tl.id !== action.id)
            }
            case 'ADD_TODOLIST': {
                return [...state, {...action.todolist, filter: "all"} ]
            }
            case 'CHANGE_TODOLIST_TITLE': {
                let todolist = state.find(tl => tl.id === action.id)
                if (todolist) {
                    todolist.title = action.title
                }
                return [...state]
            }
            case 'CHANGE_TODOLIST_FILTER': {
                let todolist = state.find(tl => tl.id === action.id)
                if (todolist) {
                    todolist.filter = action.filter
                }
                return [...state]
            }
            default:
                return state
        }
    }

//Actions
export const setTodolistsAC = (todolists: Array<TodolistType>): SetTodolistsActionType => {
    return {type: 'SET_TODOLISTS', todolists}
}
export const removeTodolistAC = (id: string): RemoveTodolistActionType => {
    return {type: 'REMOVE_TODOLIST', id}
}
export const addTodolistAC = (todolist: TodolistType): AddTodolistActionType => {
    return {type: 'ADD_TODOLIST', todolist}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE_TODOLIST_TITLE', id, title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: "CHANGE_TODOLIST_FILTER", id, filter}
}

//Thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        todolistAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
            })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        todolistAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC(res.data.data.item))
            })
    }
}
export const removeTodolistTC = (id: string): AppThunk => {
    return (dispatch) => {
        todolistAPI.deleteTodolist(id)
            .then((res) => {
                dispatch(removeTodolistAC(id))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(id, title))
            })
    }
}