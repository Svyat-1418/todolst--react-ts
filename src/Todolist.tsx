import React, {ChangeEvent} from "react";
import {FilterValuesType, TaskType} from "./App";
import {EditableSpan} from "./EditableSpan";
import {AddItemForm} from "./AddItemForm";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";

type PropsType = {
    id: string
    title: string
    filter: FilterValuesType
    tasks: Array<TaskType>
    removeTask: (id: string, todolistId: string) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (id: string, todolistId: string, isDone: boolean) => void
    changeTaskTitle: (id: string, todolistId: string, title: string) => void
    removeTodolist: (id: string) => void
    changeTodolistFilter: (id: string, value: FilterValuesType) => void
    changeTodolistTitle: (id: string, title: string) => void

}

export const Todolist = (props: PropsType) => {
    const addTask = (title: string) => props.addTask(props.id, title)
    const removeTodolist = () => props.removeTodolist(props.id)
    const changeTodolistTitle = (title: string) => props.changeTodolistTitle(props.id, title)

    const onClickAllHandler = () => props.changeTodolistFilter(props.id, "all")
    const onClickActiveHandler = () => props.changeTodolistFilter(props.id, "active")
    const onClickCompletedHandler = () => props.changeTodolistFilter(props.id, "completed")

    return (
        <div>
            <h3><EditableSpan title={props.title} changeTitle={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete color={"error"}/>
            </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>

            <ul>
                {props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.id, props.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, props.id, e.currentTarget.checked)
                    }
                    const changeTaskTitle = (title: string) => props.changeTaskTitle(t.id, props.id, title)


                    return (
                        <li key={t.id} >
                            <Checkbox onChange={onChangeHandler} checked={t.isDone}/>
                            <EditableSpan title={t.title} changeTitle={changeTaskTitle}/>
                            <IconButton onClick={onClickHandler}>
                                <Delete color={"error"}/>
                            </IconButton>
                        </li>
                    )
                })}
            </ul>
            <div>
                <Button variant={props.filter === "all" ? "contained" : "outlined"}
                        color={"primary"}
                        size={"small"}
                        onClick={onClickAllHandler}>All
                </Button>
                <Button variant={props.filter === "active" ? "contained" : "outlined"}
                        color={"success"}
                        size={"small"}
                        onClick={onClickActiveHandler}>Active
                </Button>
                <Button variant={props.filter === "completed" ? "contained" : "outlined"}
                        color={"secondary"}
                        size={"small"}
                        onClick={onClickCompletedHandler}>Completed
            </Button>
            </div>
        </div>
    )
}