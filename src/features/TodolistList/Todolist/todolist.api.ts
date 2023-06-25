import {instance} from "../../../common/api/common.api";
import {CommonResponseType} from "../../../common/types/common.types";

export const todolistAPI = {
  getTodolists() {
    return instance.get<Array<TodolistType>>(`todo-lists`)
  },
  createTodolist(title: string) {
    return instance.post<CommonResponseType<{ item: TodolistType }>>(`todo-lists/`, {title})
  },
  deleteTodolist(id: string) {
    return instance.delete<CommonResponseType>(`todo-lists/${id}`)
  },
  updateTodolist(id: string, title: string) {
    return instance.put<CommonResponseType>(`todo-lists/${id}`, {title})
  },
}
export type TodolistType = {
  id: string
  addedDate: string
  order: number
  title: string
}