import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {FilterValuesType, TaskType} from "./App";

type PropsType = {
    title: string
    filter: FilterValuesType
    tasks: Array<TaskType>
    removeTask: (id: string) => void
    addTask: (title: string) => void
    changeTaskStatus: (id: string, isDone: boolean) => void
    changeTodolistFilter: (value: FilterValuesType) => void
}

export const Todolist = (props: PropsType) => {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const addTaskHandler = () => {
        if (title.trim() !== "") {
            props.addTask(title.trim())
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

    const onClickAllHandler = () => props.changeTodolistFilter("all")
    const onClickActiveHandler = () => props.changeTodolistFilter("active")
    const onClickCompletedHandler = () => props.changeTodolistFilter("completed")


    return (
        <div>
            <h3>{props.title}</h3>
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
                    const onClickHandler = () => props.removeTask(t.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, e.currentTarget.checked)
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