import {addTodolist, removeTodolist, setTodolists} from "./todolistsReducer";
import {ResultCodes, TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolistAPI";
import {AppRootStateType, AppThunk} from "../../App/store";
import {clearData, RequestStatusType, setAppStatus} from "../../App/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {AxiosError} from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<{ todolistId: string, tasks: Array<TaskType> }>) => {
      state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: "idle"}))
    },
    removeTask: (state, action: PayloadAction<{ id: string, todolistId: string }>) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.id)
      if (index > -1) {
        state[action.payload.todolistId].splice(index, 1)
      }
    },
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: "idle"})
    },
    updateTask: (state, action: PayloadAction<{ id: string, todolistId: string, model: UpdateDomainTaskModelType }>) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.id)
      if (index > -1) {
        tasks[index] = {...tasks[index], ...action.payload.model}
      }
    },
    changeTaskEntityStatus:
      (state, action: PayloadAction<{ id: string, todolistId: string, entityStatus: RequestStatusType }>) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex(t => t.id === action.payload.id)
        if (index > -1) {
          tasks[index].entityStatus = action.payload.entityStatus
        }
      }
  },
  extraReducers: builder => {
    builder
      .addCase(clearData,  () => {})
      .addCase(setTodolists, (state, action) => {
        action.payload.todolists.forEach(tl => {state[tl.id] = [] })
      })
      .addCase(addTodolist, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(removeTodolist, (state, action) => {
        delete state[action.payload.id]
      })
  }
})

export const {setTasks, removeTask, addTask, updateTask, changeTaskEntityStatus} = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

/*
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
    case "CLEAR_DATA":
      return state = {}
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
*/

//Thunks
export const fetchTasksTC = (todolistId: string): AppThunk => (dispatch) => {
  dispatch(setAppStatus({status: "loading"}))
  todolistAPI.getTasks(todolistId)
    .then((res) => {
      dispatch(setTasks({todolistId, tasks: res.data.items}))
      dispatch(setAppStatus({status: "succeeded"}))
    })
}
export const addTaskTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
  dispatch(setAppStatus({status: "loading"}))
  todolistAPI.createTask(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === ResultCodes.success) {
        dispatch(addTask({task: res.data.data.item}))
      } else if (res.data.resultCode === ResultCodes.error && res.data.messages.length) {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error, dispatch)
    })
}
export const removeTaskTC = (id: string, todolistId: string): AppThunk => (dispatch) => {
  dispatch(setAppStatus({status: "loading"}))
  dispatch(changeTaskEntityStatus({id, todolistId, entityStatus: "loading"}))
  todolistAPI.deleteTask(id, todolistId)
    .then((res) => {
      dispatch(removeTask({id, todolistId}))
      dispatch(setAppStatus({status: "succeeded"}))
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error, dispatch)
    })
}
export const updateTaskTC = (id: string, todolistId: string, domainModel: UpdateDomainTaskModelType): AppThunk => (dispatch, getState: () => AppRootStateType) => {
  dispatch(setAppStatus({status: "loading"}))
  dispatch(changeTaskEntityStatus({id, todolistId, entityStatus: "loading"}))

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
        dispatch(updateTask({id, todolistId, model: apiModel}))
        dispatch(changeTaskEntityStatus({id, todolistId, entityStatus: "idle"}))
        dispatch(setAppStatus({status: "succeeded"}))
      } else {
        handleServerAppError(res.data, dispatch)
      }
      dispatch(changeTaskEntityStatus({id, todolistId, entityStatus: "idle"}))
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error, dispatch)
    })
}

//Types
export type TaskDomainType = TaskType & { entityStatus: RequestStatusType }
export type TasksStateType =
  { [key: string]: Array<TaskDomainType> }
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string | null
  status?: number
  priority?: number
  startDate?: string | null
  deadline?: string | null
}
