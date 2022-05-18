import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {v1} from "uuid";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
export type FilterValuesType = "all" | "active" | "completed"


function App() {
    const [tasks, setTasks] = useState<Array<TaskType>>([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false},
        {id: v1(), title: "Rest API", isDone: true},
        {id: v1(), title: "GraphQL", isDone: false}
    ])
    const [filter, setFilter] = useState<FilterValuesType>("all")

    const removeTask = (id: string) => setTasks(tasks.filter(t => t.id !== id))
    const addTask = (title: string) => setTasks([{id: v1(), title, isDone: false}, ...tasks])
    const changeTaskStatus = (id: string, isDone: boolean) => {
        const task = tasks.find(t => t.id === id)
        if (task) {
            task.isDone = isDone
            setTasks([...tasks])
        }
    }

    const changeTodolistFilter = (value: FilterValuesType) => setFilter(value)

    let tasksForTodolist = tasks
    if (filter === "active") {
        tasksForTodolist = tasks.filter(t => !t.isDone)
    } else if (filter === "completed") {
        tasksForTodolist = tasks.filter(t => t.isDone)
    }

    return (
        <div className="App">
            <Todolist title={"Front-end"}
                      filter={filter}
                      tasks={tasksForTodolist}
                      removeTask={removeTask}
                      addTask={addTask}
                      changeTodolistFilter={changeTodolistFilter}
                      changeTaskStatus={changeTaskStatus}
            />
        </div>
    );
}

export default App;

