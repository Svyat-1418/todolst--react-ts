import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '8b2c8540-f6dc-42fb-9c8f-b949feae7300'
    }
})

export const todolistAPI = {
    getTodolists() {
        return instance.get<Array<TodolistType>>(`todo-lists`)
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistType}>>(`todo-lists/`, {title})
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`)
    },
    updateTodolist(id: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${id}`, {title})
    },
    getTasks(todolistId: string) {
        return instance.get<GetTaskResponseType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTask(id: string, todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${id}`)
    },
    updateTask(id: string, todolistId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<{item: TaskType }>>(`todo-lists/${todolistId}/tasks/${id}`, model)
    }
}

type ResponseType<T = {}> = {
    resultCode: number
    fieldsErrors: Array<string>
    messages: Array<string>
    data: T
}
type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}
type TaskType = {
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
type GetTaskResponseType = {
    error: string | null
    totalCount: number
    items: Array<TaskType>
}
type UpdateTaskModelType = {
    title: string
    description: string | null
    status: number
    priority: number
    startDate: string | null
    deadline: string | null
}