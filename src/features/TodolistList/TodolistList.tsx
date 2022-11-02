import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../App/store";
import {
  addTodolist,
  changeTodolistFilter,
  changeTodolistTitle,
  fetchTodolists,
  FilterValuesType,
  removeTodolist,
  TodolistDomainType
} from "./todolistsReducer";
import {
  addTask,
  removeTask,
  TasksStateType,
  UpdateDomainTaskModelType,
  updateTask
} from "./tasksReducer";

import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {Navigate} from "react-router-dom";

export const TodolistList = ({demo = false}: { demo: boolean }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    dispatch(fetchTodolists())
  }, [dispatch, demo, isLoggedIn])

  const removeTaskCb = useCallback((id: string, todolistId: string) => {
    dispatch(removeTask({id, todolistId}))
  }, [dispatch])
  const addTaskCb = useCallback((todolistId: string, title: string) => {
    dispatch(addTask({todolistId, title}))
  }, [dispatch])
  const updateTaskCb = useCallback((id: string, todolistId: string, model: UpdateDomainTaskModelType) => {
    dispatch(updateTask({id, todolistId, domainModel: model}))
  }, [dispatch])

  const removeTodolistCb = useCallback((id: string) => {
    dispatch(removeTodolist({id}))
  }, [dispatch])
  const addTodolistCb = useCallback((title: string) => {
    dispatch(addTodolist(title))
  }, [dispatch])
  const changeTodolistFilterCb = useCallback((id: string, value: FilterValuesType) => {
    dispatch(changeTodolistFilter({id, filter: value}))
  }, [dispatch])
  const changeTodolistTitleCb = useCallback((id: string, title: string) => {
    dispatch(changeTodolistTitle({id: id, title}))
  }, [dispatch])

  if (!isLoggedIn) {
    return <Navigate to={"/login"}/>
  }

  return (
    <>
      <Grid container style={{padding: "20px"}}>
        <AddItemForm addItem={addTodolistCb}/>
      </Grid>
      <Grid container spacing={3}>
        {
          todolists.map(tl => {
            console.log(tasks)
            let allTodolistsTasks = tasks[tl.id]
            console.log(allTodolistsTasks)
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
                    removeTaskCb={removeTaskCb}
                    addTaskCb={addTaskCb}
                    updateTaskCb={updateTaskCb}
                    removeTodolistCb={removeTodolistCb}
                    changeTodolistFilterCb={changeTodolistFilterCb}
                    changeTodolistTitleCb={changeTodolistTitleCb}
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