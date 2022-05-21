import {TasksStateType} from '../AppWithRedux';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from './tasksReducer';
import {addTodolistAC, removeTodolistAC} from "./todolistsReducer";

let startState: TasksStateType

beforeEach(() => {
    startState = {
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
})

test('correct task should be deleted from correct array', () => {
    const action = removeTaskAC("2", "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(2);
    expect(endState["todolistId2"].every(t => t.id !== "2")).toBeTruthy();
});

test('correct task should be added to correct array', () => {
    const newTaskTitle = "MongoDB"

    const action = addTaskAC("todolistId2", newTaskTitle);
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe(newTaskTitle);
    expect(endState["todolistId2"][0].isDone).toBeFalsy();
})

test('status of specified task should be changed', () => {
    const action = changeTaskStatusAC("3", "todolistId2", true);
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][2].isDone).toBeTruthy();
    expect(endState["todolistId1"][2].isDone).toBeFalsy();
});

test('title of specified task should be changed', () => {
    const newTaskTitle = "PostgreSQL"

    const action = changeTaskTitleAC("2", "todolistId2", newTaskTitle);
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe(newTaskTitle);
    expect(endState["todolistId1"][1].title).toBe("JS");
});

test('new array should be added when new todolist is added', () => {
    const action = addTodolistAC("new todolist");
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== "todolistId1" && k !== "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toStrictEqual([]);
});

test('property with id should be deleted', () => {
    const action = removeTodolistAC("todolistId2");
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).toBeUndefined()
});
