export {}

// import React, {useReducer} from 'react';
// import './App.css';
// import {Todolist} from "./Todolist";
// import {v1} from "uuid";
// import {AddItemForm} from "./AddItemForm";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/icons-material/Menu";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import {
//     addTodolistAC,
//     changeTodolistFilterAC,
//     changeTodolistTitleAC,
//     removeTodolistAC,
//     todolistsReducer
// } from "./state/todolistsReducer";
// import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasksReducer";
//
// export type TaskType = {
//     id: string
//     title: string
//     isDone: boolean
// }
// export type TasksStateType = {
//     [key: string]: Array<TaskType>
// }
// export type FilterValuesType = "all" | "active" | "completed"
// export type TodolistType = {
//     id: string
//     title: string
//     filter: FilterValuesType
// }
//
// function AppWithReducers() {
//     const todolistId1 = v1()
//     const todolistId2 = v1()
//
//     const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
//         [todolistId1]: [
//             {id: v1(), title: "HTML&CSS", isDone: true},
//             {id: v1(), title: "JS", isDone: false},
//             {id: v1(), title: "ReactJS", isDone: false}
//         ],
//         [todolistId2]: [
//             {id: v1(), title: "NodeJS", isDone: false},
//             {id: v1(), title: "Express", isDone: true},
//             {id: v1(), title: "NestJS", isDone: false}
//         ]
//     })
//     const [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
//         {id: todolistId1, title: "Frontend", filter: "all"},
//         {id: todolistId2, title: "Backend", filter: "all"}
//     ])
//
//     const removeTask = (id: string, todolistId: string) => {
//         dispatchToTasks(removeTaskAC(id, todolistId))
//     }
//     const addTask = (todolistId: string, title: string) => {
//         dispatchToTasks(addTaskAC(todolistId, title))
//     }
//     const changeTaskStatus = (id: string, todolistId: string, isDone: boolean) => {
//         dispatchToTasks(changeTaskStatusAC(id, todolistId, isDone))
//     }
//     const changeTaskTitle = (id: string, todolistId: string, title: string) => {
//         dispatchToTasks(changeTaskTitleAC(id, todolistId, title))
//     }
//
//     const removeTodolist = (id: string) => {
//         const action = removeTodolistAC(id)
//         dispatchToTodolists(action)
//         dispatchToTasks(action)
//     }
//     const addTodolist = (title: string) => {
//         const action = addTodolistAC(title)
//         dispatchToTodolists(action)
//         dispatchToTasks(action)
//     }
//     const changeTodolistFilter = (id: string, value: FilterValuesType) => {
//         dispatchToTodolists(changeTodolistFilterAC(id, value))
//     }
//     const changeTodolistTitle = (id: string, title: string) => {
//         dispatchToTodolists(changeTodolistTitleAC(id, title))
//     }
//
//     return (
//         <div className="App">
//             <AppBar position={"static"}>
//                 <Toolbar>
//                     <IconButton>
//                         <Menu style={{color: "white"}}/>
//                     </IconButton>
//                     <Typography variant={"body1"}>News</Typography>
//                     <Button color={"inherit"}>Login</Button>
//                 </Toolbar>
//             </AppBar>
//             <Container fixed>
//                 <Grid container style={{padding: "20px"}}>
//                     <AddItemForm addItem={addTodolist}/>
//                 </Grid>
//                 <Grid container spacing={3}>
//                     {
//                         todolists.map(tl => {
//
//
//                             let allTodolistsTasks = tasks[tl.id]
//                             let tasksForTodolist = allTodolistsTasks
//
//                             if (tl.filter === "active") {
//                                 tasksForTodolist = allTodolistsTasks.filter(t => !t.isDone)
//                             } else if (tl.filter === "completed") {
//                                 tasksForTodolist = allTodolistsTasks.filter(t => t.isDone)
//                             }
//
//                             return (
//                                 <Grid key={tl.id} item>
//                                     <Paper variant={"outlined"} style={{padding: "10px"}}>
//                                         <Todolist
//                                             id={tl.id}
//                                             title={tl.title}
//                                             filter={tl.filter}
//                                             tasks={tasksForTodolist}
//                                             removeTask={removeTask}
//                                             addTask={addTask}
//                                             changeTaskStatus={changeTaskStatus}
//                                             changeTaskTitle={changeTaskTitle}
//                                             removeTodolist={removeTodolist}
//                                             changeTodolistFilter={changeTodolistFilter}
//                                             changeTodolistTitle={changeTodolistTitle}
//                                         />
//                                     </Paper>
//                                 </Grid>
//
//                             )
//                         })
//                     }
//                 </Grid>
//             </Container>
//         </div>
//     );
// }
//
// export default AppWithReducers;
//
