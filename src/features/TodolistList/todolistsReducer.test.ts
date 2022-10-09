import {
    removeTodolist,
    todolistsReducer,
    addTodolist,
    changeTodolistTitle,
    changeTodolistFilter, TodolistDomainType, FilterValuesType, setTodolists, changeTodolistEntityStatus
} from './todolistsReducer';
import {v1} from 'uuid';
import {TodolistType} from "../../api/todolistAPI";
import {RequestStatusType} from "../../App/appReducer";

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = [
        {id: todolistId1, title: "Frontend",
            filter: "all", addedDate: "", order: 0, entityStatus: "idle"},
        {id: todolistId2, title: "Backend",
            filter: "all", addedDate: "", order: 0, entityStatus: "idle"}
    ]
})

test('correct todolists should be set', () => {
    const endState = todolistsReducer([], setTodolists({todolists: startState}))

    expect(endState).toStrictEqual(startState)
})
test('correct todolist should be removed', () => {
    const action = removeTodolist({id: todolistId1})
    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    let newTodolistTitle = "New Todolist";
    const newTodolist: TodolistType = {id: "todolistId3", title: newTodolistTitle, order: 0, addedDate: ""}


    const action = addTodolist({todolist: newTodolist})
    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
    expect(endState[0].filter).toBe("all");
});

test('correct todolist should change its name', () => {
    let newTodolistTitle = "New Todolist";

    const action = changeTodolistTitle({id: todolistId2, title: newTodolistTitle})
    const endState = todolistsReducer(startState, action);

    expect(endState[0].title).toBe("Frontend");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
    let newFilter: FilterValuesType = "completed";

    const action = changeTodolistFilter({id: todolistId2, filter: newFilter})
    const endState = todolistsReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});
test('correct entityStatus of todolist should be changed', () => {
    const newEntityStatus: RequestStatusType = "loading";

    const action = changeTodolistEntityStatus({id: todolistId2, entityStatus: newEntityStatus})
    const endState = todolistsReducer(startState, action);

    expect(endState[0].entityStatus).toBe("idle");
    expect(endState[1].entityStatus).toBe(newEntityStatus);
});