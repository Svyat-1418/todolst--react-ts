import { AddItemForm } from 'common/components/AddItemForm/AddItemForm'
import { useActions } from 'common/hooks/useActions'
import { FC, memo, useCallback } from 'react'

import { taskThunks } from '../Task/task.slice'

import { TaskFilterButtons } from './components/TaskFilterButtons'
import { TaskList } from './components/TaskList'
import { TodolistTitle } from './components/TodolistTitle'
import { TodolistDomainType } from './todolist.slice'

type PropsType = {
	todolist: TodolistDomainType
}

export const Todolist: FC<PropsType> = memo(({ todolist }) => {
	const { addTask } = useActions(taskThunks)

	const addTaskCallback = useCallback(
		(title: string) => {
			return addTask({ todolistId: todolist.id, title }).unwrap()
		},
		[todolist.id]
	)

	return (
		<div>
			<TodolistTitle
				todolistId={todolist.id}
				title={todolist.title}
				entityStatus={todolist.entityStatus}
			/>
			<AddItemForm disabled={todolist.entityStatus === 'loading'} addItem={addTaskCallback} />
			<TaskList todolistId={todolist.id} todolistFilter={todolist.filter} />
			<TaskFilterButtons todolistId={todolist.id} todolistFilter={todolist.filter} />
		</div>
	)
})
