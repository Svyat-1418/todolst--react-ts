import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import {TodolistList} from "../features/TodolistList/TodolistList";

function App({demo = false}: { demo?: boolean }) {
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
                <TodolistList demo={demo}/>
            </Container>
        </div>
    )
}

export default App