import {todolistAPI, TodolistType} from "../../api/todolistAPI";
import {AppThunk} from "../../App/store";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET_TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: "all"}))
        case 'REMOVE_TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD_TODOLIST':
            return [{...action.todolist, filter: "all"}, ...state]
        case 'CHANGE_TODOLIST_TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE_TODOLIST_FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
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

//Thunks
export const fetchTodolistsTC = (): AppThunk => (dispatch) => {
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
        })
}
export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    todolistAPI.createTodolist(title)
        .then((res) => {
            dispatch(addTodolistAC(res.data.data.item))
        })
}
export const removeTodolistTC = (id: string): AppThunk => (dispatch) => {
    todolistAPI.deleteTodolist(id)
        .then((res) => {
            dispatch(removeTodolistAC(id))
        })
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => (dispatch) => {
    todolistAPI.updateTodolist(id, title)
        .then((res) => {
            dispatch(changeTodolistTitleAC(id, title))
        })
}

//Types
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & { filter: FilterValuesType }
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type TodolistsActionsType =
    SetTodolistsActionType
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>