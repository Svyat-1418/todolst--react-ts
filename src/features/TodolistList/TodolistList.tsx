import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../App/store";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType
} from "./todolistsReducer";
import {
    addTaskTC,
    removeTaskTC,
    TasksStateType,
    UpdateDomainTaskModelType,
    updateTaskTC
} from "./tasksReducer";

import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {Navigate} from "react-router-dom";

export const TodolistList = ({demo = false}: {demo: boolean}) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
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

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }

    return (
        <>
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
                                        demo={demo}
                                        id={tl.id}
                                        title={tl.title}
                                        filter={tl.filter}
                                        entityStatus={tl.entityStatus}
                                        tasks={allTodolistsTasks}
                                        removeTask={removeTask}
                                        addTask={addTask}
                                        updateTask={updateTask}
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
        </>
    )
}