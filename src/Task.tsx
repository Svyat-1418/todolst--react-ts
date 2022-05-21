import {TaskType} from "./AppWithRedux";
import React, {ChangeEvent, useCallback} from "react";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";

type PropsType = {
    todolistId: string
    task: TaskType
    removeTask: (id: string, todolistId: string) => void
    changeTaskStatus: (id: string, todolistId: string, isDone: boolean) => void
    changeTaskTitle: (id: string, todolistId: string, title: string) => void
}
export const Task = React.memo((props: PropsType) => {
    console.log("Task")

    const onClickHandler = useCallback(() => {
        props.removeTask(props.task.id, props.todolistId)
    }, [props.removeTask, props.task.id, props.todolistId])
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(props.task.id, props.todolistId, e.currentTarget.checked)
    }, [props.changeTaskStatus, props.task.id, props.todolistId])
    const changeTaskTitle = useCallback((title: string) => {
        props.changeTaskTitle(props.task.id, props.todolistId, title)
    }, [props.changeTaskTitle, props.task.id, props.todolistId])

    return (
        <div>
            <Checkbox onChange={onChangeHandler} checked={props.task.isDone}/>
            <EditableSpan title={props.task.title} changeTitle={changeTaskTitle}/>
            <IconButton onClick={onClickHandler}>
                <Delete color={"error"}/>
            </IconButton>
        </div>
    )
})