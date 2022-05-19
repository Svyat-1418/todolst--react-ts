import React, {ChangeEvent} from "react";
import {FilterValuesType, TaskType} from "./App";
import {EditableSpan} from "./EditableSpan";
import {AddItemForm} from "./AddItemForm";

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
                <button onClick={removeTodolist}>✖</button>
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
                        <li key={t.id} className={t.isDone ? "is-done" : ""}>
                            <input type="checkbox" onChange={onChangeHandler} checked={t.isDone}/>
                            <EditableSpan title={t.title} changeTitle={changeTaskTitle}/>
                            <button onClick={onClickHandler}>✖</button>
                        </li>
                    )
                })}
            </ul>
            <div>
                <button className={props.filter === "all" ? "active-filter" : ""}
                        onClick={onClickAllHandler}>All
                </button>
                <button className={props.filter === "active" ? "active-filter" : ""}
                        onClick={onClickActiveHandler}>Active
                </button>
                <button className={props.filter === "completed" ? "active-filter" : ""}
                        onClick={onClickCompletedHandler}>Completed
                </button>
            </div>
        </div>
    )
}