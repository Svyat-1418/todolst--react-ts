import React from 'react';
import './App.css';
import {Todolist} from "./Todolist";

export type TaskType = {
  id:number
  title: string
  isDone: boolean
}

function App() {
  const tasks1: Array<TaskType> = [
    {id: 1, title: "HTML&CSS", isDone: true},
    {id: 2, title: "JS", isDone: true},
    {id: 3, title: "ReactJS", isDone: false}
  ]
  const tasks2: Array<TaskType> = [
    {id: 1, title: "NodeJS world", isDone: true},
    {id: 2, title: "Express", isDone: false},
    {id: 3, title: "NestJS", isDone: false}
  ]

  return (
      <div className="App">
        <Todolist title={"Front-end"} tasks={tasks1}/>
        <Todolist title={"Back-end"} tasks={tasks2}/>
      </div>
  );
}

export default App;

