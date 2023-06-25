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
import {useActions} from "../common/hooks/useActions";
import {ErrorSnackbar} from "../common/components/ErrorSnackbar/ErrorSnackbar";
import {selectIsLoggedIn} from "../features/auth/auth.selectors";
import {authThunks} from "../features/auth/auth.slice";
import {selectAppStatus} from "./app.selectors";

export const Layout = () => {
  const {logout} = useActions(authThunks)
  
  const status = useSelector(selectAppStatus)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  
  const handleLogout = () => logout({})
  
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
            <Button color={"inherit"} onClick={handleLogout}>Log out</Button>}
        </Toolbar>
      </AppBar>
      
      {status === "loading" && <LinearProgress color={"info"}/>}
      
      <Container fixed>
        <Outlet/>
      </Container>
    </>
  )
}