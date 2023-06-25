import {ChangeEvent, FC, memo, useCallback} from "react";
import Checkbox from "@mui/material/Checkbox";
import {TaskStatuses} from "../../../common/enums/common.enums";
import {useActions} from "../../../common/hooks/useActions";
import {EditableSpan} from "../../../common/components/EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {TaskDomainType, tasksThunks} from "./task.slice";

type PropsType = {
  task: TaskDomainType
}
export const Task: FC<PropsType> = memo(({task}) => {
  const {removeTask, updateTask} = useActions(tasksThunks)

    const handleRemoveTask = useCallback(() => {
      removeTask({id: task.id, todolistId: task.todoListId})
    }, [removeTask, task.id, task.todoListId])
  
    const handleUpdateTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked
            ? TaskStatuses.Completed
            : TaskStatuses.New
        updateTask({ id: task.id, todolistId: task.todoListId, domainModel: {status} })
    }, [updateTask, task.id, task.todoListId])
  
    const handleUpdateTaskTitle = useCallback((title: string) => {
      updateTask({id: task.id, todolistId: task.todoListId, domainModel: {title}})
    }, [updateTask, task.id, task.todoListId])

    return (
        <li>
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
        </li>
    )
})