import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {FilterValuesType, TaskType} from "./App";

type PropsType = {
    id: string
    title: string
    filter: FilterValuesType
    tasks: Array<TaskType>
    removeTask: (id: string, todolistId: string) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (id: string, todolistId: string, isDone: boolean) => void
    removeTodolist: (id: string) => void
    changeTodolistFilter: (id: string, value: FilterValuesType) => void
}

export const Todolist = (props: PropsType) => {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const removeTodolist = () => props.removeTodolist(props.id)
    const addTaskHandler = () => {
        if (title.trim() !== "") {
            props.addTask(props.id, title.trim())
            setTitle("")
        } else {
            setError("Title is required")
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.key === "Enter") {
            addTaskHandler()
        }
    }

    const onClickAllHandler = () => props.changeTodolistFilter(props.id, "all")
    const onClickActiveHandler = () => props.changeTodolistFilter(props.id, "active")
    const onClickCompletedHandler = () => props.changeTodolistFilter(props.id, "completed")


    return (
        <div>
            <h3>{props.title}<button onClick={removeTodolist}>✖</button></h3>
            <div>
                <input
                    value={title}
                    onChange={onChangeHandler}
                    onKeyDown={onKeyDownHandler}
                    /*I replace onKeyPress with onKeyDown because onKeyPress deprecated */
                    className={error ? "error" : ""}
                />
                <button onClick={addTaskHandler}>+</button>
            </div>
            {error && <div className={"error-message"}>{error}</div>}
            <ul>
                {props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.id, props.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, props.id, e.currentTarget.checked)
                    }

                    return (
                        <li key={t.id} className={t.isDone ? "is-done" : ""}>
                            <input type="checkbox" onChange={onChangeHandler} checked={t.isDone}/>
                            <span>{t.title}</span>
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