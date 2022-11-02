import {
  removeTodolist,
  todolistsReducer,
  addTodolist,
  changeTodolistTitle,
  changeTodolistFilter, TodolistDomainType, FilterValuesType, changeTodolistEntityStatus, fetchTodolists
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
    {
      id: todolistId1, title: "Frontend",
      filter: "all", addedDate: "", order: 0, entityStatus: "idle"
    },
    {
      id: todolistId2, title: "Backend",
      filter: "all", addedDate: "", order: 0, entityStatus: "idle"
    }
  ]
})

test('correct todolists should be set', () => {
  const payload = {todolists: startState}
  const action = fetchTodolists.fulfilled(payload, "requestId", undefined)

  const endState = todolistsReducer([], action)

  expect(endState.length).toBe(2)
})
test('correct todolist should be removed', () => {
  const endState = todolistsReducer(startState, removeTodolist.fulfilled({id: todolistId1}, 'requestId', {id: todolistId1}))

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
});

test('correct todolist should be added', () => {
  let todolist: TodolistType = {
    title: 'New Todolist',
    id: 'any id',
    addedDate: '',
    order: 0
  }


  const endState = todolistsReducer(startState, addTodolist.fulfilled({todolist}, "requestId", todolist.title))

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(todolist.title)
  expect(endState[0].filter).toBe('all')
});

test('correct todolist should change its name', () => {
  let newTodolistTitle = 'New Todolist'

  let payload = {id: todolistId2, title: newTodolistTitle}
  const action = changeTodolistTitle.fulfilled(payload,"requestId", payload)

  const endState = todolistsReducer(startState, action)

  expect(endState[0].title).toBe('What to learn')
  expect(endState[1].title).toBe(newTodolistTitle)
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