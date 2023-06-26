import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { AddItemForm } from 'common/components/AddItemForm/AddItemForm'
import { useActions } from 'common/hooks/useActions'
import { selectIsLoggedIn } from 'features/auth/auth.selectors'
import { FC, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { Todolist } from './Todolist/Todolist'
import { todolistThunks } from './Todolist/todolist.slice'
import { selectTodolists } from './Todolist/todolists.selectors'

export const TodolistList: FC<{ demo: boolean }> = ({ demo = false }) => {
	const todolists = useSelector(selectTodolists)
	const isLoggedIn = useSelector(selectIsLoggedIn)

	const { addTodolist, fetchTodolists } = useActions(todolistThunks)

	useEffect(() => {
		if (demo || !isLoggedIn) {
			return
		}
		fetchTodolists({})
	}, [demo, isLoggedIn])

	const addTodolistCallback = useCallback((title: string) => {
		addTodolist({ title })
	}, [])

	if (!isLoggedIn) {
		return <Navigate to={'/login'} />
	}

	return (
		<>
			<Grid container style={{ padding: '20px' }}>
				<AddItemForm addItem={addTodolistCallback} />
			</Grid>
			<Grid container spacing={3}>
				{todolists.map((tl) => {
					return (
						<Grid key={tl.id} item>
							<Paper variant={'outlined'} style={{ padding: '10px' }}>
								<Todolist todolist={tl} />
							</Paper>
						</Grid>
					)
				})}
			</Grid>
		</>
	)
}
