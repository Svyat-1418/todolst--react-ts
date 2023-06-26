import { instance } from 'common/api/common.api'
import { TaskPriorities, TaskStatuses } from 'common/enums/common.enums'
import { CommonResponseType } from 'common/types/common.types'

export const taskAPI = {
	getTasks(arg: GetTasksArgType) {
		return instance.get<GetTaskResponseType>(`todo-lists/${arg.todolistId}/tasks`)
	},
	createTask(arg: CreateTaskArgType) {
		return instance.post<
			CommonResponseType<{
				item: TaskType
			}>
		>(`todo-lists/${arg.todolistId}/tasks`, { title: arg.title })
	},
	deleteTask(arg: DeleteTaskArgType) {
		return instance.delete<CommonResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.id}`)
	},
	updateTask(arg: UpdateTaskArgType) {
		return instance.put<
			CommonResponseType<{
				item: TaskType
			}>
		>(`todo-lists/${arg.todolistId}/tasks/${arg.id}`, arg.apiModel)
	},
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

export type GetTasksArgType = { todolistId: string }
export type CreateTaskArgType = { todolistId: string; title: string }
export type DeleteTaskArgType = { id: string; todolistId: string }
export type UpdateTaskArgType = {
	id: string
	todolistId: string
	apiModel: UpdateTaskModelType
}
