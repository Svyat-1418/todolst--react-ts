import {instance} from "../../../common/api/common.api";
import {TaskPriorities, TaskStatuses} from "../../../common/enums/common.enums";
import {CommonResponseType} from "../../../common/types/common.types";

export const taskAPI = {
  getTasks(todolistId: string) {
    return instance.get<GetTaskResponseType>(`todo-lists/${todolistId}/tasks`)
  },
  createTask(todolistId: string, title: string) {
    return instance.post<CommonResponseType<{
      item: TaskType
    }>>(`todo-lists/${todolistId}/tasks`, {title})
  },
  deleteTask(id: string, todolistId: string) {
    return instance.delete<CommonResponseType>(`todo-lists/${todolistId}/tasks/${id}`)
  },
  updateTask(id: string, todolistId: string, model: UpdateTaskModelType) {
    return instance.put<CommonResponseType<{
      item: TaskType
    }>>(`todo-lists/${todolistId}/tasks/${id}`, model)
  }
}

export type TaskType = {
  addedDate: string
  deadline: null | string
  description: null | string
  id: string
  order: number
  priority: number
  startDate: null | string
  status: number
  title: string
  todoListId: string
}
export type GetTaskResponseType = {
  error: string | null
  totalCount: number
  items: Array<TaskType>
}
export type UpdateTaskModelType = {
  title: string
  description: string | null
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string | null
  deadline: string | null
}