import {TasksStateType, TaskType} from "../AppWithRedux";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolistsReducer";

export type RemoveTaskActionType = {
    type: 'REMOVE_TASK'
    id: string
    todolistId: string
}
export type AddTaskActionType = {
    type: 'ADD_TASK'
    title: string
    todolistId: string
}
type ChangeTaskStatusActionType = {
    type: 'CHANGE_TASK_STATUS'
    id: string
    isDone: boolean
    todolistId: string
}
type ChangeTaskTitleActionType = {
    type: 'CHANGE_TASK_TITLE'
    id: string
    title: string
    todolistId: string
}
export type ActionsType =
    RemoveTaskActionType |
    AddTaskActionType |
    ChangeTaskStatusActionType |
    ChangeTaskTitleActionType |
    AddTodolistActionType |
    RemoveTodolistActionType

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE_TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId]
            stateCopy[action.todolistId] = tasks.filter(t => t.id !== action.id)
            return stateCopy
        }
        case 'ADD_TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId]
            const newTask: TaskType = {id: v1(), title: action.title, isDone: false}
            stateCopy[action.todolistId] = [newTask, ...tasks]
            return stateCopy
        }
        case "CHANGE_TASK_STATUS": {
            return {...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.id
                    ? {...t, isDone: action.isDone} : t) }
        }
        case "CHANGE_TASK_TITLE": {
            return {...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.id
                    ? {...t, title: action.title} : t) }
        }
        case "ADD_TODOLIST": {
            const stateCopy = {...state}
            stateCopy[action.id] = []
            return stateCopy
        }
        case "REMOVE_TODOLIST": {
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }
        default:
             return state
    }
}

export const removeTaskAC = (id: string, todolistId: string): RemoveTaskActionType => {
    return { type: 'REMOVE_TASK', id, todolistId}
}
export const addTaskAC = (todolistId: string, title: string): AddTaskActionType => {
    return { type: 'ADD_TASK', todolistId, title}
}
export const changeTaskStatusAC = (id: string, todolistId: string, isDone: boolean): ChangeTaskStatusActionType => {
    return {type: "CHANGE_TASK_STATUS", id, todolistId, isDone}
}
export const changeTaskTitleAC = (id: string, todolistId: string, title: string): ChangeTaskTitleActionType => {
    return {type: "CHANGE_TASK_TITLE", id, todolistId, title}
}





