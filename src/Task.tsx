import React, {ChangeEvent, useCallback} from "react";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {TaskStatuses, TaskType} from "./api/todolistAPI";

type PropsType = {
    task: TaskType
    removeTask: (id: string, todolistId: string) => void
    changeTaskStatus: (id: string, todolistId: string, status: TaskStatuses) => void
    changeTaskTitle: (id: string, todolistId: string, title: string) => void
}
export const Task = React.memo(({
                                    task,
                                    removeTask, changeTaskStatus,
                                    changeTaskTitle
                                }: PropsType) => {
    console.log("Task")

    const onClickHandler = useCallback(() => {
        removeTask(task.id, task.todoListId)
    }, [removeTask, task.id, task.todoListId])
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked
            ? TaskStatuses.Completed
            : TaskStatuses.New
        changeTaskStatus(task.id, task.todoListId, status)
    }, [changeTaskStatus, task.id, task.todoListId])
    const changeTaskTitleHandler = useCallback((title: string) => {
        changeTaskTitle(task.id, task.todoListId, title)
    }, [changeTaskTitle, task.id, task.todoListId])

    return (
        <div>
            <Checkbox onChange={onChangeHandler} checked={task.status === TaskStatuses.Completed}/>
            <EditableSpan title={task.title} changeTitle={changeTaskTitleHandler}/>
            <IconButton onClick={onClickHandler}>
                <Delete color={"error"}/>
            </IconButton>
        </div>
    )
})