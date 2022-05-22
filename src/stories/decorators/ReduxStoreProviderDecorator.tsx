import React from "react";
import {Provider} from "react-redux";
import {combineReducers, createStore} from "redux"
import {tasksReducer} from "../../state/tasksReducer"
import {todolistsReducer} from "../../state/todolistsReducer"
import {AppRootStateType} from "../../state/store";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {
    todolists: [
        {id: "todolistId1", title: "Frontend", filter: "all"},
        {id: "todolistId2", title: "Backend", filter: "all"}
    ] ,
    tasks: {
        "todolistId1": [
            {id: "1", title: "HTML&CSS", isDone: true},
            {id: "2", title: "JS", isDone: false},
            {id: "3", title: "ReactJS", isDone: false}
        ],
        "todolistId2": [
            {id: "1", title: "NodeJS", isDone: false},
            {id: "2", title: "Express", isDone: true},
            {id: "3", title: "NestJS", isDone: false}
        ]
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);


export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)




