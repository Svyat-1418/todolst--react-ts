import React, {useEffect} from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import {selectIsLoggedIn} from "../features/auth/auth.selectors";
import {TodolistList} from "../features/TodolistList/TodolistList";
import {Layout} from "../layout/Layout";
import {selectAppStatus, selectIsInitialized} from "./app.selectors";

import {initializeApp, RequestStatusType} from "./appReducer";
import {AppRootStateType, useAppDispatch} from "./store";
import {useSelector} from "react-redux";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import {logout} from "../features/Login/authReducer";

function App({demo = false}: { demo?: boolean }) {
  const dispatch = useAppDispatch()
  
  const isInitialized = useSelector(selectIsInitialized)
  
  useEffect(() => {
    dispatch(initializeApp())
  }, [])
  
  if (!isInitialized) {
    return <div
      style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
      <CircularProgress/>
    </div>
  }
  
  return (
    <>
      <Routes>
        <Route path={"/"} element={<Layout/>}>
          <Route index element={<TodolistList demo={demo}/>}/>
          <Route path={"login"} element={<Login/>}/>
          
          <Route path={"/404"} element={<h1>404 PAGE NOT FOUND</h1>}/>
          <Route path={"*"} element={<Navigate to={"/404"}/>}/>
        </Route>_
      </Routes>
    </>
  )
}

export default App