import {
    tasksActions,
    tasksThunks,
    tasksReducer,
    TasksStateType, UpdateDomainTaskModelType,
} from './tasksReducer';
import {todolistsThunks} from "./todolistsReducer";
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
    const action = tasksThunks.fetchTasks.fulfilled({
        tasks: startState['todolistId1'],
        todolistId: 'todolistId1'
    }, 'requestId', {todolistId: 'todolistId1'})

    const endState = tasksReducer({
        'todolistId2': [],
        'todolistId1': []
    }, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(0)
})
test('correct task should be deleted from correct array', () => {
    const payload = {id: '2', todolistId: 'todolistId2'}
    const action = tasksThunks.removeTask.fulfilled(payload, 'requestId', payload)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(2)
    expect(endState['todolistId2'].every(t => t.id !== '2')).toBeTruthy()
});

test('correct task should be added to correct array', () => {
    const newTaskTitle = "MongoDB"
    const task = {
        todoListId: 'todolistId2',
        title: newTaskTitle,
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        order: 0,
        priority: 0,
        startDate: '',
        id: 'id exists'
    }
    const action = tasksThunks.addTask.fulfilled({task}, 'requestId', {title: task.title, todolistId: task.todoListId})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe(newTaskTitle)
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {
    /*const model: UpdateDomainTaskModelType = {status: TaskStatuses.Completed}

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
    expect(endState["todolistId1"][1].title).toBe("JS");*/

    const newTaskTitle = "PostgreSQL"
    const domainModel: UpdateDomainTaskModelType = {title: newTaskTitle}
    const payload = {id: '2', domainModel, todolistId: 'todolistId2'}

    const action = tasksThunks.updateTask.fulfilled(payload, 'requestId', payload)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][1].title).toBe('JS')
    expect(endState['todolistId2'][1].title).toBe(newTaskTitle)
});

test('empty arrays should be added when correct todolists will be set', () => {
    const correctTodolists = [
        {id: "todolistId1", title: "Frontend", filter: "all", addedDate: "", order: 0},
        {id: "todolistId2", title: "Backend", filter: "all", addedDate: "", order: 0}
    ]
    const endState = tasksReducer({}, todolistsThunks.fetchTodolists.fulfilled({todolists: correctTodolists}, 'requestId', undefined))

    expect(endState[correctTodolists[0].id]).toStrictEqual([])
})


test('new array should be added when new todolist is added', () => {
    /*const newTodolist: TodolistType = {id: "todolistId3", title: "WEB", order: 0, addedDate: ""}

    const action = addTodolist(newTodolist.title);
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== "todolistId1" && k !== "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toStrictEqual([]);*/

    let payload = {
        todolist: {
            id: 'blabla',
            title: 'new todolist',
            order: 0,
            addedDate: ''
        }
    }
    const action = todolistsThunks.addTodolist.fulfilled(payload, 'requestId', payload.todolist.title)

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
});


test('property with id should be deleted', () => {
    const action = todolistsThunks.removeTodolist.fulfilled({id: 'todolistId2'}, 'requestId', {id: 'todolistId2'})

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
});
test('correct entityStatus of task should be changed', () => {
    const newEntityStatus: RequestStatusType = "loading";

    const action = tasksActions.changeTaskEntityStatus({id: "2", todolistId: "todolistId2", entityStatus: newEntityStatus})
    const endState = tasksReducer(startState, action);

    expect(endState["todolistId1"][1].entityStatus).toBe("idle");
    expect(endState["todolistId2"][1].entityStatus).toBe(newEntityStatus);
});

