import {createAppAsyncThunk} from "../../common/utils/createAppAsyncThunk";
import {handleServerAppError} from "../../common/utils/handleServerAppError";
import {thunkTryCatch} from "../../common/utils/thunkTryCatch";
import {todolistsThunks} from "./todolistsReducer";
import {ResultCode, TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolistAPI";
import {appActions, RequestStatusType} from "../../App/appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const fetchTasks = createAppAsyncThunk<{ todolistId: string, tasks: TaskType[] },
  { todolistId: string }>("tasks/fetchTasks",
  async (payload, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.getTasks(payload.todolistId)
      return {todolistId: payload.todolistId, tasks: res.data.items}
    })
  })

const addTask = createAppAsyncThunk<
  { task: TaskType },
  { todolistId: string, title: string }>("tasks/addTask",
  async (payload, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.createTask(payload.todolistId, payload.title)
      if (res.data.resultCode === ResultCode.success) {
        return {task: res.data.data.item}
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  })

const removeTask = createAppAsyncThunk<
  { id: string, todolistId: string },
  { id: string, todolistId: string }>("tasks/removeTask",
  async (payload, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(tasksActions.changeTaskEntityStatus(
      {id: payload.id, todolistId: payload.todolistId, entityStatus: "loading"}))
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.deleteTask(payload.id, payload.todolistId)
      if (res.data.resultCode === ResultCode.success) {
        return {id: payload.id, todolistId: payload.todolistId}
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  })

const updateTask = createAppAsyncThunk<
  { id: string, todolistId: string, domainModel: UpdateDomainTaskModelType },
  { id: string, todolistId: string, domainModel: UpdateDomainTaskModelType }
  >("tasks/updateTask",
  async (payload, thunkAPI) => {
    const {dispatch, getState, rejectWithValue} = thunkAPI
    thunkAPI.dispatch(tasksActions.changeTaskEntityStatus({
      id: payload.id,
      todolistId: payload.todolistId,
      entityStatus: "loading"
    }))
    return thunkTryCatch(thunkAPI, async () => {
      const correctTask = getState().tasks[payload.todolistId].find(t => t.id === payload.id)
      if (!correctTask) {
        dispatch(appActions.setAppError({error: 'Task not found in the state'}))
        return rejectWithValue(null)
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
        dispatch(tasksActions.changeTaskEntityStatus({
          id: payload.id,
          todolistId: payload.todolistId,
          entityStatus: "succeeded"
        }))
        return {id: payload.id, todolistId: payload.todolistId, domainModel: payload.domainModel}
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
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