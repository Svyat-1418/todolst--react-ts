import {
    SetTodolistsActionType,
    AddTodolistActionType,
    RemoveTodolistActionType
} from "./todolistsReducer";
import {TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolistAPI";
import {AppRootStateType, AppThunk} from "../../App/store";

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case "SET_TASKS":
            return {...state, [action.todolistId]: action.tasks}
        case 'REMOVE_TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.id)}
        case 'ADD_TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case "UPDATE_tASK":
            return {...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.id ? {...t, ...action.model} : t)}
        case "SET_TODOLISTS": {
            const stateCopy = {...state}
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case "ADD_TODOLIST":
            return {...state, [action.todolist.id]: []}
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
export const setTasksAC = (todolistId: string, tasks: Array<TaskType>) =>
    ({type: 'SET_TASKS', todolistId, tasks} as const)
export const removeTaskAC = (id: string, todolistId: string) =>
    ({type: 'REMOVE_TASK', id, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD_TASK', task} as const)
export const updateTaskAC = (id: string, todolistId: string, model: UpdateDomainTaskModelType) =>
    ({type: 'UPDATE_tASK', id, todolistId, model} as const)

//Thunks
export const fetchTasksTC = (todolistId: string): AppThunk => (dispatch) => {
    todolistAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(todolistId, res.data.items))
        })
}
export const addTaskTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    todolistAPI.createTask(todolistId, title)
        .then((res) => {
            dispatch(addTaskAC(res.data.data.item))
        })
}
export const removeTaskTC = (id: string, todolistId: string): AppThunk => (dispatch) => {
    todolistAPI.deleteTask(id, todolistId)
        .then((res) => {
            dispatch(removeTaskAC(id, todolistId))
        })
}
export const updateTaskTC = (id: string, todolistId: string, domainModel: UpdateDomainTaskModelType): AppThunk => (dispatch, getState: () => AppRootStateType) => {
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

//Types
export type TasksStateType = { [key: string]: Array<TaskType> }
const initialState: TasksStateType = {}
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string | null
    status?: number
    priority?: number
    startDate?: string | null
    deadline?: string | null
}
export type TasksActionsType =
    ReturnType<typeof setTasksAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | SetTodolistsActionType
    | AddTodolistActionType
    | RemoveTodolistActionType