import { FC } from 'react'
import { useSelector } from 'react-redux'

import { TaskStatuses } from '../../../../common/enums/common.enums'
import { Task } from '../../Task/Task'
import { selectTasks } from '../../Task/tasks.selectors'
import { FilterValuesType } from '../todolist.slice'

type PropsType = {
	todolistId: string
	todolistFilter: FilterValuesType
}

export const TaskList: FC<PropsType> = ({ todolistId, todolistFilter }) => {
	const tasks = useSelector(selectTasks)

	let filteredTasks = tasks[todolistId]
	if (todolistFilter === 'active') {
		filteredTasks = tasks[todolistId].filter((t) => t.status === TaskStatuses.New)
	}
	if (todolistFilter === 'completed') {
		filteredTasks = tasks[todolistId].filter((t) => t.status === TaskStatuses.Completed)
	}

	return (
		<ul>
			{filteredTasks.map((t) => (
				<Task key={t.id} task={t} />
			))}
		</ul>
	)
}
