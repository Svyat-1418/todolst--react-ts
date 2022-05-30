import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    tasksReducer,
    TasksStateType
} from './tasksReducer';
import {addTodolistAC, removeTodolistAC} from "./todolistsReducer";
import {TaskPriorities, TaskStatuses} from "../api/todolistAPI";

let startState: TasksStateType

beforeEach(() => {
    startState = {
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
                todoListId: "todolistId2", deadline: "", description: "",
                startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle}
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
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})

test('status of specified task should be changed', () => {
    const action = changeTaskStatusAC("3", "todolistId2", TaskStatuses.Completed);
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][2].status).toBe(TaskStatuses.Completed);
    expect(endState["todolistId1"][2].status).toBe(TaskStatuses.New);
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
