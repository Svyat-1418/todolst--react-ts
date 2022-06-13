import {
    SetTodolistsActionType,
    AddTodolistActionType,
    RemoveTodolistActionType
} from "./todolistsReducer";
import {ResultCodes, TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolistAPI";
import {AppRootStateType, AppThunk} from "../../App/store";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../../App/appReducer";

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case "SET_TASKS":
            return {
                ...state, [action.todolistId]: action.tasks
                    .map(t => ({...t, entityStatus: "idle"}))
            }
        case 'REMOVE_TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.id)}
        case 'ADD_TASK':
            return {
                ...state, [action.task.todoListId]:
                    [{...action.task, entityStatus: "idle"}, ...state[action.task.todoListId]]
            }
        case "UPDATE_tASK":
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.id ? {...t, ...action.model} : t)
            }
        case "CHANGE_TASK_ENTITY_STATUS":
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.id ? {...t, entityStatus: action.entityStatus} : t)
            }
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
export const changeTaskEntityStatusAC = (id: string, todolistId: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE_TASK_ENTITY_STATUS', id, todolistId, entityStatus} as const)

//Thunks
export const fetchTasksTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(todolistId, res.data.items))
            dispatch(setAppStatusAC("succeeded"))
        })
}
export const addTaskTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistAPI.createTask(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === ResultCodes.success) {
                dispatch(addTaskAC(res.data.data.item))
            } else if (res.data.resultCode === ResultCodes.error && res.data.messages.length) {
                dispatch(setAppErrorAC(res.data.messages[0]))
            } else {
                dispatch(setAppErrorAC("Some error has occurred. Contact the site administrator"))
            }
        })
}
export const removeTaskTC = (id: string, todolistId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC("loading"))
    dispatch(changeTaskEntityStatusAC(id, todolistId, "loading"))
    todolistAPI.deleteTask(id, todolistId)
        .then((res) => {
            dispatch(removeTaskAC(id, todolistId))
            dispatch(setAppStatusAC("succeeded"))
        })
}
export const updateTaskTC = (id: string, todolistId: string, domainModel: UpdateDomainTaskModelType): AppThunk => (dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC("loading"))
    dispatch(changeTaskEntityStatusAC(id, todolistId, "loading"))

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
            if (res.data.resultCode === ResultCodes.success) {
                dispatch(updateTaskAC(id, todolistId, apiModel))
                dispatch(changeTaskEntityStatusAC(id, todolistId, "idle"))
            } else if (res.data.resultCode === ResultCodes.error && res.data.messages.length) {
                dispatch(setAppErrorAC(res.data.messages[0]))
                dispatch(changeTaskEntityStatusAC(id, todolistId, "idle"))
            } else {
                dispatch(setAppErrorAC("Some error has occurred. Contact the site administrator"))
                dispatch(changeTaskEntityStatusAC(id, todolistId, "idle"))
            }
            dispatch(setAppStatusAC("idle"))
        })
}

//Types
export type TaskDomainType = TaskType & { entityStatus: RequestStatusType }
export type TasksStateType =
    { [key: string]: Array<TaskDomainType> }
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
    | ReturnType<typeof changeTaskEntityStatusAC>
    | SetTodolistsActionType
    | AddTodolistActionType
    | RemoveTodolistActionType