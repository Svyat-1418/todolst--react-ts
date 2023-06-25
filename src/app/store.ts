import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from 'redux';
import {authReducer} from "../features/auth/auth.slice";
import {tasksReducer} from '../features/TodolistList/Task/task.slice';
import {todolistsReducer} from '../features/TodolistList/Todolist/todolist.slice';
import {appReducer} from "./app.slice";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer
});

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

