import React, {ChangeEvent, useCallback} from "react";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {TaskStatuses} from "../../../../api/todolistAPI";
import {TaskDomainType, UpdateDomainTaskModelType} from "../../tasksReducer";

type PropsType = {
    task: TaskDomainType
    removeTask: (id: string, todolistId: string) => void
    updateTask: (id: string, todolistId: string, model: UpdateDomainTaskModelType) => void
}
export const Task = React.memo(({
                                    task,
                                    removeTask, updateTask
                                }: PropsType) => {
    console.log("Task")

    const onClickHandler = useCallback(() => {
        removeTask(task.id, task.todoListId)
    }, [removeTask, task.id, task.todoListId])
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked
            ? TaskStatuses.Completed
            : TaskStatuses.New
        updateTask(task.id, task.todoListId, {status})
    }, [updateTask, task.id, task.todoListId])
    const changeTaskTitleHandler = useCallback((title: string) => {
        updateTask(task.id, task.todoListId, {title})
    }, [updateTask, task.id, task.todoListId])

    return (
        <div>
            <Checkbox disabled={task.entityStatus === "loading"}
                      onChange={onChangeHandler}
                      checked={task.status === TaskStatuses.Completed}
            />
            <EditableSpan disabled={task.entityStatus === "loading"}
                          title={task.title}
                          changeTitle={changeTaskTitleHandler}
            />
            <IconButton disabled={task.entityStatus === "loading"} onClick={onClickHandler}>
                <Delete color={"error"}/>
            </IconButton>
        </div>
    )
})