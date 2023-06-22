import {todolistsThunks} from "./todolistsReducer";
import {ResultCode, TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolistAPI";
import {AppRootStateType} from "../../App/store";
import {appActions, RequestStatusType} from "../../App/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const fetchTasks = createAsyncThunk<
  { todolistId: string, tasks: TaskType[] },
  { todolistId: string }>("tasks/fetchTasks",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: "loading"}))
    try {
      const res = await todolistAPI.getTasks(payload.todolistId)
      thunkAPI.dispatch(appActions.setAppStatus({status: "succeeded"}))
      return {todolistId: payload.todolistId, tasks: res.data.items}
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

const addTask = createAsyncThunk<
  { task: TaskType },
  { todolistId: string, title: string }>("tasks/addTask",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: "loading"}))
    try {
      const res = await todolistAPI.createTask(payload.todolistId, payload.title)
      if (res.data.resultCode === ResultCode.success) {
        thunkAPI.dispatch(appActions.setAppStatus({status: "succeeded"}))
        return {task: res.data.data.item}
      } else {
        return handleServerAppError(res.data, thunkAPI)
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

const removeTask = createAsyncThunk<
  { id: string, todolistId: string },
  { id: string, todolistId: string }>("tasks/removeTask",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: "loading"}))
    thunkAPI.dispatch(tasksActions.changeTaskEntityStatus({id: payload.id, todolistId: payload.todolistId, entityStatus: "loading"}))
    try {
      const res = await todolistAPI.deleteTask(payload.id, payload.todolistId)
      if (res.data.resultCode === ResultCode.success) {
        thunkAPI.dispatch(appActions.setAppStatus({status: "succeeded"}))
        return {id: payload.id, todolistId: payload.todolistId}
      } else {
        return handleServerAppError(res.data, thunkAPI)
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

const updateTask = createAsyncThunk<
  { id: string, todolistId: string, domainModel: UpdateDomainTaskModelType },
  { id: string, todolistId: string, domainModel: UpdateDomainTaskModelType },
  {state: AppRootStateType}>("tasks/updateTask",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: "loading"}))
    thunkAPI.dispatch(tasksActions.changeTaskEntityStatus({id: payload.id, todolistId: payload.todolistId, entityStatus: "loading"}))
    try {
      const correctTask = thunkAPI.getState().tasks[payload.todolistId].find(t => t.id === payload.id)
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
        ...payload.domainModel
      }

      const res = await todolistAPI.updateTask(payload.id, payload.todolistId, apiModel)
      if (res.data.resultCode === ResultCode.success) {
        thunkAPI.dispatch(appActions.setAppStatus({status: "succeeded"}))
        thunkAPI.dispatch(tasksActions.changeTaskEntityStatus({
          id: payload.id,
          todolistId: payload.todolistId,
          entityStatus: "succeeded"
        }))
        return {id: payload.id, todolistId: payload.todolistId, domainModel: payload.domainModel}
      } else {
        return handleServerAppError(res.data, thunkAPI)
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
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
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: "idle"}))
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: "idle"})
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex(t => t.id === action.payload.id)
        if (index > -1) {
          state[action.payload.todolistId].splice(index, 1)
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex(t => t.id === action.payload.id)
        if (index > -1) {
          tasks[index] = {...tasks[index], ...action.payload.domainModel}
        }
      })
      .addCase(appActions.clearData, () => {
      })
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach(tl => {
          state[tl.id] = []
        })
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  }
})

export const { reducer: tasksReducer, actions:  tasksActions} = tasksSlice
export const tasksThunks = {addTask, fetchTasks, removeTask, updateTask}

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