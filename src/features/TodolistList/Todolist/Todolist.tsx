import {FC, memo, useCallback} from "react";
import {useAppDispatch} from "../../../App/store";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {addTask} from "../tasksReducer";
import {TodolistDomainType} from "../todolistsReducer";
import {TaskFilterButtons} from "./components/TaskFilterButtons";
import {TaskList} from "./components/TaskList";
import {TodolistTitle} from "./components/TodolistTitle";

type PropsType = {
  todolist: TodolistDomainType
}

export const Todolist: FC<PropsType> = memo(({todolist}) => {
  const dispatch = useAppDispatch()
  
  const addTaskCallback = useCallback((title: string) => {
    dispatch(addTask({todolistId: todolist.id, title}))
  }, [dispatch, todolist.id])
  
  return (
    <div>
      <TodolistTitle todolistId={todolist.id} title={todolist.title} entityStatus={todolist.entityStatus} />
      <AddItemForm disabled={todolist.entityStatus === "loading"} addItem={addTaskCallback}/>
      <TaskList todolistId={todolist.id} todolistFilter={todolist.filter} />
      <TaskFilterButtons todolistId={todolist.id} todolistFilter={todolist.filter} />
    </div>
  )
})


