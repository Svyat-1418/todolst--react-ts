import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

function App() {
    const todolistId1 = v1()
    const todolistId2 = v1()

    const [tasks, setTasks] = useState<TasksStateType>({
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: false},
            {id: v1(), title: "ReactJS", isDone: false}
        ],
        [todolistId2]: [
            {id: v1(), title: "NodeJS", isDone: false},
            {id: v1(), title: "Express", isDone: true},
            {id: v1(), title: "NestJS", isDone: false}
        ]
    })
    const [todolists, setTodolists] = useState<Array<TodolistType>>([
        {id: todolistId1, title: "Frontend", filter: "all"},
        {id: todolistId2, title: "Backend", filter: "all"}
    ])

    const removeTask = (id: string, todolistId: string) => {
        tasks[todolistId] = tasks[todolistId].filter(t => t.id !== id)
        setTasks({...tasks})
    }
    const addTask = (todolistId: string, title: string) => {
        tasks[todolistId] = [{id: v1(), title, isDone: false}, ...tasks[todolistId]]
        setTasks({...tasks})
    }
    const changeTaskStatus = (id: string, todolistId: string, isDone: boolean) => {
        const task = tasks[todolistId].find(t => t.id === id)
        if (task) {
            task.isDone = isDone
            setTasks({...tasks})
        }
    }
    const changeTaskTitle = (id: string, todolistId: string, title: string) => {
        const task = tasks[todolistId].find(t => t.id === id)
        if (task) {
            task.title = title
            setTasks({...tasks})
        }
    }

    const removeTodolist = (id: string) => {
        setTodolists(todolists.filter(tl => tl.id !== id))
        delete tasks[id]
        setTasks({...tasks})
    }
    const addTodolist = (title: string) => {
        const newTodolistId = v1()
        setTodolists([{id: newTodolistId, title, filter: "all"}, ...todolists])
        tasks[newTodolistId] = []
        setTasks(tasks)
    }
    const changeTodolistFilter = (id: string, value: FilterValuesType) => {
        const todolist = todolists.find(tl => tl.id === id)
        if (todolist) {
            todolist.filter = value
            setTodolists([...todolists])
        }
    }
    const changeTodolistTitle = (id: string, title: string) => {
        const todolist = todolists.find(tl => tl.id === id)
        if (todolist) {
            todolist.title = title
            setTodolists([...todolists])
        }
    }

    return (
        <div className="App">
            <AppBar position={"static"}>
                <Toolbar>
                    <IconButton>
                        <Menu style={{color: "white"}}/>
                    </IconButton>
                    <Typography variant={"body1"}>News</Typography>
                    <Button color={"inherit"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {


                            let allTodolistsTasks = tasks[tl.id]
                            let tasksForTodolist = allTodolistsTasks

                            if (tl.filter === "active") {
                                tasksForTodolist = allTodolistsTasks.filter(t => !t.isDone)
                            } else if (tl.filter === "completed") {
                                tasksForTodolist = allTodolistsTasks.filter(t => t.isDone)
                            }

                            return (
                                <Grid key={tl.id} item>
                                    <Paper variant={"outlined"} style={{padding: "10px"}}>
                                        <Todolist
                                            id={tl.id}
                                            title={tl.title}
                                            filter={tl.filter}
                                            tasks={tasksForTodolist}
                                            removeTask={removeTask}
                                            addTask={addTask}
                                            changeTaskStatus={changeTaskStatus}
                                            changeTaskTitle={changeTaskTitle}
                                            removeTodolist={removeTodolist}
                                            changeTodolistFilter={changeTodolistFilter}
                                            changeTodolistTitle={changeTodolistTitle}
                                        />
                                    </Paper>
                                </Grid>

                            )
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;

