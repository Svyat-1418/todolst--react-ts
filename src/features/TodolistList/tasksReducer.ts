import {addTodolist, fetchTodolists, removeTodolist} from "./todolistsReducer";
import {ResultCode, TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolistAPI";
import {AppRootStateType, AppThunk} from "../../App/store";
import {clearData, RequestStatusType, setAppStatus} from "../../App/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";

export const fetchTasks = createAsyncThunk<
  { todolistId: string, tasks: TaskType[] },
  { todolistId: string }>("tasks/fetchTasks",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    try {
      const res = await todolistAPI.getTasks(payload.todolistId)
      console.log(res.data.items)

      thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
      return {todolistId: payload.todolistId, tasks: res.data.items}
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

export const addTask = createAsyncThunk<
  { task: TaskType },
  { todolistId: string, title: string }>("tasks/addTask",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    try {
      const res = await todolistAPI.createTask(payload.todolistId, payload.title)
      if (res.data.resultCode === ResultCode.success) {
        thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
        return {task: res.data.data.item}
      } else {
        return handleServerAppError(res.data, thunkAPI)
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

export const removeTask = createAsyncThunk<
  { id: string, todolistId: string },
  { id: string, todolistId: string }>("tasks/removeTask",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    thunkAPI.dispatch(changeTaskEntityStatus({id: payload.id, todolistId: payload.todolistId, entityStatus: "loading"}))
    try {
      const res = await todolistAPI.deleteTask(payload.id, payload.todolistId)
      if (res.data.resultCode === ResultCode.success) {
        thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
        return {id: payload.id, todolistId: payload.todolistId}
      } else {
        return handleServerAppError(res.data, thunkAPI)
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

export const updateTask = createAsyncThunk<
  { id: string, todolistId: string, domainModel: UpdateDomainTaskModelType },
  { id: string, todolistId: string, domainModel: UpdateDomainTaskModelType },
  {state: AppRootStateType}>("tasks/updateTask",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    thunkAPI.dispatch(changeTaskEntityStatus({id: payload.id, todolistId: payload.todolistId, entityStatus: "loading"}))
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
        thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
        thunkAPI.dispatch(changeTaskEntityStatus({
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
      .addCase(clearData, () => {
      })
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach(tl => {
          state[tl.id] = []
        })
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  }
})

export const {changeTaskEntityStatus} = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

//Thunks
/*

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
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
      if (res.data.resultCode === ResultCode.success) {
        dispatch(addTask({task: res.data.data.item}))
      } else if (res.data.resultCode === ResultCode.error && res.data.messages.length) {
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
      if (res.data.resultCode === ResultCode.success) {
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
*/

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
