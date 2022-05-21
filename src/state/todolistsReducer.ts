import { v1 } from "uuid";
import {FilterValuesType, TodolistType} from "../AppWithRedux";

export type RemoveTodolistActionType = {
    type: 'REMOVE_TODOLIST'
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD_TODOLIST'
    id: string
    title: string
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
export type ActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType

const initialState: Array<TodolistType> = []

export const todolistsReducer = (state: Array<TodolistType> = initialState, action: ActionsType): Array<TodolistType> => {
    switch (action.type) {
        case 'REMOVE_TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD_TODOLIST': {
            return [...state, {
                id: action.id,
                title: action.title,
                filter: "all"
            }
            ]
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

export const removeTodolistAC = (id: string): RemoveTodolistActionType => {
    return { type: 'REMOVE_TODOLIST', id}
}
export const addTodolistAC = (title: string): AddTodolistActionType => {
    return { type: 'ADD_TODOLIST', id: v1(), title}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return { type: 'CHANGE_TODOLIST_TITLE', id, title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return { type: "CHANGE_TODOLIST_FILTER", id, filter}
}