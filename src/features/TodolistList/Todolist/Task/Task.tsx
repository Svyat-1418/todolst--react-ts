import {ChangeEvent, FC, memo, useCallback} from "react";
import Checkbox from "@mui/material/Checkbox";
import {useAppDispatch} from "../../../../App/store";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {TaskStatuses} from "../../../../api/todolistAPI";
import {
  removeTask,
  TaskDomainType,
  updateTask
} from "../../tasksReducer";

type PropsType = {
  task: TaskDomainType
}
export const Task: FC<PropsType> = memo(({task}) => {
  const dispatch = useAppDispatch()

    const handleRemoveTask = useCallback(() => {
      dispatch(removeTask({id: task.id, todolistId: task.todoListId}))
    }, [removeTask, task.id, task.todoListId])
  
    const handleUpdateTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked
            ? TaskStatuses.Completed
            : TaskStatuses.New
        dispatch(updateTask({ id: task.id, todolistId: task.todoListId, domainModel: {status} }))
    }, [updateTask, task.id, task.todoListId])
  
    const handleUpdateTaskTitle = useCallback((title: string) => {
      dispatch(updateTask({id: task.id, todolistId: task.todoListId, domainModel: {title}}))
    }, [updateTask, task.id, task.todoListId])

    return (
        <div>
            <Checkbox disabled={task.entityStatus === "loading"}
                      onChange={handleUpdateTaskStatus}
                      checked={task.status === TaskStatuses.Completed}
            />
            <EditableSpan disabled={task.entityStatus === "loading"}
                          title={task.title}
                          changeTitle={handleUpdateTaskTitle}
            />
            <IconButton disabled={task.entityStatus === "loading"} onClick={handleRemoveTask}>
                <Delete color={"error"}/>
            </IconButton>
        </div>
    )
})