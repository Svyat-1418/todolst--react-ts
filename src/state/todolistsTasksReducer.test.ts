import {addTodolistAC, TodolistDomainType, todolistsReducer} from "./todolistsReducer";
import {tasksReducer, TasksStateType} from "./tasksReducer";
import {TodolistType} from "../api/todolistAPI";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    const newTodolist: TodolistType = {id: "todolistId3", title: "WEB", order: 0, addedDate: ""}
    const action = addTodolistAC(newTodolist);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todolist.id);
    expect(idFromTodolists).toBe(action.todolist.id);
});
