import { AppRootStateType } from 'app/store'

import { TaskStateType } from './task.slice'

export const selectTasks = (state: AppRootStateType): TaskStateType => state.tasks
