import { AppRootStateType } from 'app/store'

import { TasksStateType } from './task.slice'

export const selectTasks = (state: AppRootStateType): TasksStateType => state.tasks
