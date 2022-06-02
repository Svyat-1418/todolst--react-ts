import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
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
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    fetchTodolistsTC, FilterValuesType, removeTodolistTC,
    TodolistDomainType,
} from "./state/todolistsReducer";
import {addTaskTC, removeTaskTC, TasksStateType, UpdateDomainTaskModelType, updateTaskTC} from "./state/tasksReducer";
import { useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from './state/store';

function AppWithRedux() {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTodolistsTC())
        // eslint-disable-next-line
    }, [])

    const removeTask = useCallback((id: string, todolistId: string) => {
        dispatch(removeTaskTC(id, todolistId))
    }, [dispatch])
    const addTask = useCallback((todolistId: string, title: string) => {
        dispatch(addTaskTC(todolistId, title))
    }, [dispatch])
    const updateTask = useCallback((id: string, todolistId: string, model: UpdateDomainTaskModelType) => {
        dispatch(updateTaskTC(id, todolistId, model))
    }, [dispatch])

    const removeTodolist = useCallback((id: string) => {
        dispatch(removeTodolistTC(id))
    }, [dispatch])
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])
    const changeTodolistFilter = useCallback((id: string, value: FilterValuesType) => {
        dispatch(changeTodolistFilterAC(id, value))
    }, [dispatch])
    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(changeTodolistTitleTC(id, title))
    }, [dispatch])

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

                            return (
                                <Grid key={tl.id} item>
                                    <Paper variant={"outlined"} style={{padding: "10px"}}>
                                        <Todolist
                                            updateTask={updateTask}
                                            id={tl.id}
                                            title={tl.title}
                                            filter={tl.filter}
                                            tasks={allTodolistsTasks}
                                            removeTask={removeTask}
                                            addTask={addTask}
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

export default AppWithRedux;

