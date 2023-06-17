import React, {FC, useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../App/store";
import {selectIsLoggedIn} from "../auth/auth.selectors";
import {selectTodolists} from "./todolists.selectors";
import {
  addTodolist,
  fetchTodolists
} from "./todolistsReducer";

import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {Navigate} from "react-router-dom";

export const TodolistList: FC<{ demo: boolean }> = ({demo = false}) => {
  const todolists = useSelector(selectTodolists)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    dispatch(fetchTodolists())
  }, [dispatch, demo, isLoggedIn])

  
  const addTodolistCallback = useCallback((title: string) => {
    dispatch(addTodolist(title))
  }, [dispatch])

  if (!isLoggedIn) {
    return <Navigate to={"/login"}/>
  }

  return (
    <>
      <Grid container style={{padding: "20px"}}>
        <AddItemForm addItem={addTodolistCallback}/>
      </Grid>
      <Grid container spacing={3}>
        {
          todolists.map(tl => {
            return (
              <Grid key={tl.id} item>
                <Paper variant={"outlined"} style={{padding: "10px"}}>
                  <Todolist todolist={tl} />
                </Paper>
              </Grid>

            )
          })
        }
      </Grid>
    </>
  )
}