import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {FilterValuesType, TaskType} from "./App";

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string) => void
    addTask: (title: string) => void
    changeTodolistFilter: (value: FilterValuesType) => void
}

export const Todolist = (props: PropsType) => {
    const [title, setTitle] = useState<string>("")

    const addTaskHandler = () => {
        props.addTask(title)
        setTitle("")
    }
    const onChangeHandler = (e:ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
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
                />
                <button onClick={addTaskHandler}>+</button>
            </div>
            <ul>
                {props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.id)
                    return (
                        <li key={t.id}>
                            <input type="checkbox" checked={t.isDone}/>
                            <span>{t.title}</span>
                            <button onClick={onClickHandler}>✖</button>
                        </li>
                    )
                })}
            </ul>
            <div>
                <button onClick={onClickAllHandler}>All</button>
                <button onClick={onClickActiveHandler}>Active</button>
                <button onClick={onClickCompletedHandler}>Completed</button>
            </div>
        </div>
    )
}