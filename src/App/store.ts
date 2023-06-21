import {configureStore, ThunkAction, ThunkDispatch} from "@reduxjs/toolkit";
import {AnyAction, combineReducers,} from 'redux';
import {authReducer} from "../features/Login/authReducer";
import {tasksReducer} from '../features/TodolistList/tasksReducer';
import {todolistsReducer} from '../features/TodolistList/todolistsReducer';
import {appReducer} from "./appReducer";


// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})
// непосредственно создаём store
export const store = configureStore({
    reducer: rootReducer
});

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

export type DispatchType  = ThunkDispatch<AppRootStateType, unknown, AnyAction>
// export const useAppDispatch = () => useDispatch<DispatchType>()

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
