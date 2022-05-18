import React from "react";
import {FilterValuesType, TaskType} from "./App";

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (id: number) => void
    changeTodolistFilter: (value: FilterValuesType) => void
}

export const Todolist = (props: PropsType) => {
    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {props.tasks.map(t => <li key={t.id}>
                    <input type="checkbox" checked={t.isDone}/>
                    <span>{t.title}</span>
                    <button onClick={() => props.removeTask(t.id)}>✖</button>
                </li>)}
            </ul>
            <div>
                <button onClick={() => props.changeTodolistFilter("all")}>All</button>
                <button onClick={() => props.changeTodolistFilter("active")}>Active</button>
                <button onClick={() => props.changeTodolistFilter("completed")}>Completed</button>
            </div>
        </div>
    )
}