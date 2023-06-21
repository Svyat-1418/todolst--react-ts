import Menu from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {useSelector} from "react-redux";
import {Outlet} from "react-router-dom";
import {selectAppStatus} from "../App/app.selectors";

import {useAppDispatch} from "../common/hooks/useAppDispatch";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {selectIsLoggedIn} from "../features/auth/auth.selectors";
import {logout} from "../features/Login/authReducer";

export const Layout = () => {
  const dispatch = useAppDispatch()
  
  const status = useSelector(selectAppStatus)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  
  return (
    <>
      <ErrorSnackbar/>
      <AppBar position={"static"}>
        <Toolbar>
          <IconButton>
            <Menu style={{color: "white"}}/>
          </IconButton>
          <Typography variant={"body1"}>News</Typography>
          {isLoggedIn &&
            <Button color={"inherit"} onClick={() => dispatch(logout())}>Log out</Button>}
        </Toolbar>
      </AppBar>
      
      {status === "loading" && <LinearProgress color={"info"}/>}
      
      <Container fixed>
        <Outlet/>
      </Container>
    </>
  )
}