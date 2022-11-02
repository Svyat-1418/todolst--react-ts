import React, {useEffect} from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import {TodolistList} from "../features/TodolistList/TodolistList";

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

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

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
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position={"static"}>
                <Toolbar>
                    <IconButton>
                        <Menu style={{color: "white"}}/>
                    </IconButton>
                    <Typography variant={"body1"}>News</Typography>
                    {isLoggedIn && <Button color={"inherit"} onClick={() => dispatch(logout())}>Log out</Button>}
                </Toolbar>
            </AppBar>

            {status === "loading" && <LinearProgress color={"info"}/>}

            <Container fixed>
                <Routes>
                    <Route path={"/"} element={<TodolistList demo={demo}/>} />
                    <Route path={"login"} element={<Login/>} />_

                    <Route path={"/404"} element={<h1>404 PAGE NOT FOUND</h1>}/>
                    <Route path={"*"} element={<Navigate to={"/404"}/>}/>
                </Routes>
            </Container>
        </div>
    )
}

export default App