import { AppRootStateType } from "../../App/store";
import {TasksStateType} from "./tasksReducer";

export const selectTasks = (state: AppRootStateType): TasksStateType => state.tasks
