import {
    addTask,
    updateTask,
    removeTask,
    tasksReducer,
    TasksStateType, UpdateDomainTaskModelType, setTasks, changeTaskEntityStatus
} from './tasksReducer';
import {addTodolist, removeTodolist, setTodolists} from "./todolistsReducer";
import {TaskPriorities, TaskStatuses, TaskType, TodolistType} from "../../api/todolistAPI";
import {RequestStatusType} from "../../App/appReducer";

let startState: TasksStateType

beforeEach(() => {
    startState = {
        "todolistId1": [
            {id: "1", title: "HTML&CSS", status: TaskStatuses.Completed,
                todoListId: "todolistId1", deadline: "", description: "", entityStatus: "idle",
                startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle},
            {id: "2", title: "JS", status: TaskStatuses.New,
                todoListId: "todolistId1", deadline: "", description: "", entityStatus: "idle",
                startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle},
            {id: "3", title: "ReactJS", status: TaskStatuses.New,
                todoListId: "todolistId1", deadline: "", description: "", entityStatus: "idle",
                startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle}
        ],
        "todolistId2": [
            {id: "1", title: "NodeJS", status: TaskStatuses.New,
                todoListId: "todolistId2", deadline: "", description: "", entityStatus: "idle",
                startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle},
            {id: "2", title: "Express", status: TaskStatuses.Completed,
                todoListId: "todolistId2", deadline: "", description: "", entityStatus: "idle",
                startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle},
            {id: "3", title: "NestJS", status: TaskStatuses.New,
                todoListId: "todolistId2", deadline: "", description: "", entityStatus: "idle",
                startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle}
        ]
    }
})

test('correct tasks for current todolist should be set', () => {
    const endState = tasksReducer({}, setTasks({todolistId: "todolistId3", tasks: startState["todolistId1"]}))

    expect(endState["todolistId3"]).toStrictEqual(startState["todolistId1"])
})
test('correct task should be deleted from correct array', () => {
    const action = removeTask({id: "2", todolistId: "todolistId2"});
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(2);
    expect(endState["todolistId2"].every(t => t.id !== "2")).toBeTruthy();
});

test('correct task should be added to correct array', () => {
    const newTaskTitle = "MongoDB"
    const newTask: TaskType = {
        id: "4",
        title: newTaskTitle,
        status: TaskStatuses.New,
        addedDate: "",
        todoListId: "todolistId2",
        priority: TaskPriorities.Middle,
        order: 0,
        startDate: null,
        description: null,
        deadline: null
    }

    const action = addTask({task: newTask});
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe(newTaskTitle);
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})

test('status of specified task should be changed', () => {
    const model: UpdateDomainTaskModelType = {status: TaskStatuses.Completed}

    const action = updateTask({id: "3", todolistId: "todolistId2", model});
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][2].status).toBe(TaskStatuses.Completed);
    expect(endState["todolistId1"][2].status).toBe(TaskStatuses.New);
});

test('title of specified task should be changed', () => {
    const newTaskTitle = "PostgreSQL"
    const model: UpdateDomainTaskModelType = {title: newTaskTitle}

    const action = updateTask({id: "2", todolistId: "todolistId2", model});
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe(newTaskTitle);
    expect(endState["todolistId1"][1].title).toBe("JS");
});

test('empty arrays should be added when correct todolists will be set', () => {
    const correctTodolists = [
        {id: "todolistId1", title: "Frontend", filter: "all", addedDate: "", order: 0},
        {id: "todolistId2", title: "Backend", filter: "all", addedDate: "", order: 0}
    ]
    const endState = tasksReducer({}, setTodolists({todolists: correctTodolists}))

    expect(endState[correctTodolists[0].id]).toStrictEqual([])
})

test('new array should be added when new todolist is added', () => {
    const newTodolist: TodolistType = {id: "todolistId3", title: "WEB", order: 0, addedDate: ""}

    const action = addTodolist({todolist: newTodolist});
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
    const action = removeTodolist({id: "todolistId2"});
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).toBeUndefined()
});
test('correct entityStatus of task should be changed', () => {
    const newEntityStatus: RequestStatusType = "loading";

    const action = changeTaskEntityStatus({id: "2", todolistId: "todolistId2", entityStatus: newEntityStatus})
    const endState = tasksReducer(startState, action);

    expect(endState["todolistId1"][1].entityStatus).toBe("idle");
    expect(endState["todolistId2"][1].entityStatus).toBe(newEntityStatus);
});
