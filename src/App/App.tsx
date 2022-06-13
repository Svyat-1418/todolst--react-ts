import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import {TodolistList} from "../features/TodolistList/TodolistList";

import {RequestStatusType} from "./appReducer";
import {AppRootStateType} from "./store";
import {useSelector} from "react-redux";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";

function App({demo = false}: { demo?: boolean }) {

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position={"static"}>
                <Toolbar>
                    <IconButton>
                        <Menu style={{color: "white"}}/>
                    </IconButton>
                    <Typography variant={"body1"}>News</Typography>
                    <Button color={"inherit"}>Login</Button>
                </Toolbar>
            </AppBar>

            {status === "loading" && <LinearProgress color={"info"} />}

            <Container fixed>
                <TodolistList demo={demo}/>
            </Container>
        </div>
    )
}

export default App