import { instance } from '../../../common/api/common.api'
import { CommonResponseType } from '../../../common/types/common.types'

export const todolistAPI = {
	getTodolists() {
		return instance.get<Array<TodolistType>>(`todo-lists`)
	},
	createTodolist(arg: CreateTodolistArgType) {
		return instance.post<CommonResponseType<{ item: TodolistType }>>(`todo-lists/`, {
			title: arg.title,
		})
	},
	deleteTodolist(arg: DeleteTodolistArgType) {
		return instance.delete<CommonResponseType>(`todo-lists/${arg.id}`)
	},
	updateTodolist(arg: UpdateTodolistArgType) {
		return instance.put<CommonResponseType>(`todo-lists/${arg.id}`, { title: arg.title })
	},
}
export type TodolistType = {
	id: string
	addedDate: string
	order: number
	title: string
}

export type CreateTodolistArgType = { title: string }
export type DeleteTodolistArgType = { id: string }
export type UpdateTodolistArgType = { id: string; title: string }
