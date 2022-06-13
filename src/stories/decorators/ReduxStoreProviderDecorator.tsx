import React from "react";
import {Provider} from "react-redux";
import {combineReducers, createStore} from "redux"
import {tasksReducer} from "../../features/TodolistList/tasksReducer"
import {todolistsReducer} from "../../features/TodolistList/todolistsReducer"
import {AppRootStateType} from "../../App/store";
import {TaskPriorities, TaskStatuses} from "../../api/todolistAPI";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "Frontend",
            filter: "all", addedDate: "", order: 0},
        {id: "todolistId2", title: "Backend",
            filter: "all", addedDate: "", order: 0}
    ] ,
    tasks: {
        "todolistId1": [
            {id: "1", title: "HTML&CSS", status: TaskStatuses.Completed,
                todoListId: "todolistId1", deadline: "", description: "",
                startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle},
            {id: "2", title: "JS", status: TaskStatuses.New,
                todoListId: "todolistId1", deadline: "", description: "",
                startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle},
            {id: "3", title: "ReactJS", status: TaskStatuses.New,
                todoListId: "todolistId1", deadline: "", description: "",
                startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle}
        ],
        "todolistId2": [
            {id: "1", title: "NodeJS", status: TaskStatuses.New,
                todoListId: "todolistId2", deadline: "", description: "",
                startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle},
            {id: "2", title: "Express", status: TaskStatuses.Completed,
                todoListId: "todolistId2", deadline: "", description: "",
                startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle},
            {id: "3", title: "NestJS", status: TaskStatuses.New,
                todoListId: "todolistId1", deadline: "", description: "",
                startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle}
        ]
    },
    app: {status: "idle"}
};

export const storyBookStore = createStore(rootReducer, initialGlobalState);


export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)




