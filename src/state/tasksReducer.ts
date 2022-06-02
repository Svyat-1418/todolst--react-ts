import {TaskType, todolistAPI, UpdateTaskModelType} from "../api/todolistAPI";
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from "./todolistsReducer";
import {AppRootStateType, AppThunk} from "./store";

export type SetTasksActionType = {
    type: "SET_TASKS"
    todolistId: string
    tasks: Array<TaskType>
}
export type RemoveTaskActionType = {
    type: 'REMOVE_TASK'
    id: string
    todolistId: string
}
export type AddTaskActionType = {
    type: 'ADD_TASK'
    task: TaskType
}
type UpdateTaskActionType = {
    type: 'UPDATE_tASK'
    id: string
    todolistId: string
    model: UpdateDomainTaskModelType
}
export type TasksActionsType =
    SetTasksActionType |
    RemoveTaskActionType |
    AddTaskActionType |
    UpdateTaskActionType |
    SetTodolistsActionType |
    AddTodolistActionType |
    RemoveTodolistActionType
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case "SET_TASKS": {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }
        case 'REMOVE_TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId]
            stateCopy[action.todolistId] = tasks.filter(t => t.id !== action.id)
            return stateCopy
        }
        case 'ADD_TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.task.todoListId]
            stateCopy[action.task.todoListId] = [action.task, ...tasks]
            return stateCopy
        }
        case "UPDATE_tASK": {
            state[action.todolistId] = state[action.todolistId]
                .map(t => t.id === action.id ? {...t, ...action.model} : t)
            return {...state}
        }
        case "SET_TODOLISTS": {
            const stateCopy = {...state}
            action.todolists.forEach(tl => {stateCopy[tl.id] = []})
            return stateCopy
        }
        case "ADD_TODOLIST": {
            const stateCopy = {...state}
            stateCopy[action.todolist.id] = []
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

//Actions
export const setTasksAC = (todolistId: string, tasks: Array<TaskType>): SetTasksActionType => {
    return { type: 'SET_TASKS', todolistId, tasks}
}
export const removeTaskAC = (id: string, todolistId: string): RemoveTaskActionType => {
    return { type: 'REMOVE_TASK', id, todolistId}
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return { type: 'ADD_TASK', task}
}
export const updateTaskAC = (id: string, todolistId: string, model: UpdateDomainTaskModelType): UpdateTaskActionType => {
    return { type: 'UPDATE_tASK', id, todolistId, model}
}

//Thunks
export const fetchTasksTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        todolistAPI.getTasks(todolistId)
            .then((res) => {
                dispatch(setTasksAC(todolistId, res.data.items))
            })
    }
}
export const addTaskTC = (todolistId: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistAPI.createTask(todolistId, title)
            .then((res) => {
                dispatch(addTaskAC(res.data.data.item))
            })
    }
}
export const removeTaskTC = (id: string, todolistId: string): AppThunk => {
    return (dispatch) => {
        todolistAPI.deleteTask(id, todolistId)

            .then((res) => {
                dispatch(removeTaskAC(id, todolistId))
            })
    }
}
export const updateTaskTC = (id: string, todolistId: string, domainModel: UpdateDomainTaskModelType): AppThunk => {
    return (dispatch, getState: () => AppRootStateType) => {

        const correctTask = getState().tasks[todolistId].find(t => t.id === id)
        if (!correctTask) {
            console.warn(`task don't find`)
            return;
        }
        const apiModel: UpdateTaskModelType = {
            description: correctTask.description,
            startDate: correctTask.startDate,
            deadline: correctTask.deadline,
            priority: correctTask.priority,
            title: correctTask.title,
            status: correctTask.status,
            ...domainModel
        }
        todolistAPI.updateTask(id, todolistId, apiModel)
            .then((res) => {
                dispatch(updateTaskAC(id, todolistId, apiModel))
            })
    }
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string | null
    status?: number
    priority?: number
    startDate?: string | null
    deadline?: string | null
}
