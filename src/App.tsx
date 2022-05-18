import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./Todolist";

export type TaskType = {
    id: number
    title: string
    isDone: boolean
}
export type FilterValuesType = "all" | "active" | "completed"


function App() {
    const [tasks, setTasks] = useState<Array<TaskType>>([
        {id: 1, title: "HTML&CSS", isDone: true},
        {id: 2, title: "JS", isDone: true},
        {id: 3, title: "ReactJS", isDone: false},
        {id: 4, title: "Rest API", isDone: true},
        {id: 5, title: "GraphQL", isDone: false}
    ])
    const [filter, setFilter] = useState<FilterValuesType>("all")

    const removeTask = (id: number) => setTasks(tasks.filter(t => t.id !== id))

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
                      tasks={tasksForTodolist}
                      removeTask={removeTask}
                      changeTodolistFilter={changeTodolistFilter}
            />
        </div>
    );
}

export default App;

