import {useEffect} from "react";
import {useActions} from "../common/hooks/useActions";
import {TodolistList} from "../features/TodolistList/TodolistList";
import {Layout} from "./Layout";
import {selectIsInitialized} from "./app.selectors";
import {useSelector} from "react-redux";
import {Login} from "../features/auth/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import {authThunks} from "../features/auth/auth.slice";

function App({demo = false}: { demo?: boolean }) {
  const {initializeApp} = useActions(authThunks)
  
  const isInitialized = useSelector(selectIsInitialized)
  
  useEffect(() => {
    initializeApp({})
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