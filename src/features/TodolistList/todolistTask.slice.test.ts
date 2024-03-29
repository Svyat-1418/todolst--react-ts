import { TaskStateType, tasksReducer } from './Task/task.slice'
import { TodolistType } from './Todolist/todolist.api'
import {
	TodolistDomainType,
	todolistThunks,
	todolistsReducer,
} from './Todolist/todolist.slice'

test('ids should be equals', () => {
	const startTasksState: TaskStateType = {}
	const startTodolistsState: Array<TodolistDomainType> = []

	const newTodolist: TodolistType = {
		id: 'todolistId3',
		title: 'WEB',
		order: 0,
		addedDate: '',
	}
	const action = todolistThunks.addTodolist.fulfilled({ todolist: newTodolist }, 'requestId', {
		title: newTodolist.title,
	})

	const endTasksState = tasksReducer(startTasksState, action)
	const endTodolistsState = todolistsReducer(startTodolistsState, action)

	const keys = Object.keys(endTasksState)
	const idFromTasks = keys[0]
	const idFromTodolists = endTodolistsState[0].id

	expect(idFromTasks).toBe(action.payload.todolist.id)
	expect(idFromTodolists).toBe(action.payload.todolist.id)
})
