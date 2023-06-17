import {FC, memo, useCallback} from "react";
import {useSelector} from "react-redux";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {selectTasks} from "../tasks.selectors";
import {Task} from "./Task/Task";
import {TaskStatuses} from "../../../api/todolistAPI";
import {
  changeTodolistFilter,
  changeTodolistTitle,
  FilterValuesType,
  removeTodolist,
  TodolistDomainType
} from "../todolistsReducer";
import {addTask} from "../tasksReducer";
import {useAppDispatch} from "../../../App/store";

type PropsType = {
  todolist: TodolistDomainType
}

export const Todolist: FC<PropsType> = memo(({todolist}) => {
  const dispatch = useAppDispatch()
  
  const tasks = useSelector(selectTasks)
  
  const addTaskCallback = useCallback((title: string) => {
    dispatch(addTask({todolistId: todolist.id, title}))
  }, [dispatch, todolist.id])
  
  const handleRemoveTodolist = useCallback(() => {
    dispatch(removeTodolist({id: todolist.id}))
  }, [removeTodolist, todolist.id])
  
  const changeTodolistTitleCallback = useCallback((title: string) => {
    dispatch(changeTodolistTitle({id: todolist.id, title}))
  }, [changeTodolistTitle, todolist.id])
  
  const handleTodolistFilter = useCallback((filter: FilterValuesType) => {
    dispatch(changeTodolistFilter({id: todolist.id, filter}))
  }, [changeTodolistFilter, todolist.id])
  
  let filteredTasks = tasks[todolist.id]
  if (todolist.filter === "active") {
    filteredTasks = tasks[todolist.id].filter(t => t.status === TaskStatuses.New)
  } else if (todolist.filter === "completed") {
    filteredTasks = tasks[todolist.id].filter(t => t.status === TaskStatuses.Completed)
  }
  
  return (
    <div>
      <h3>
        <EditableSpan disabled={todolist.entityStatus === "loading"} title={todolist.title}
                        changeTitle={changeTodolistTitleCallback}/>
        <IconButton disabled={todolist.entityStatus === "loading"} onClick={handleRemoveTodolist}>
          <Delete color={"error"}/>
        </IconButton>
      </h3>
      <AddItemForm disabled={todolist.entityStatus === "loading"} addItem={addTaskCallback}/>
      {filteredTasks.map(t => <Task
          key={t.id}
          task={t}
        />
      )}
      
      <div>
        <Button variant={todolist.filter === "all" ? "contained" : "outlined"}
                color={"primary"}
                size={"small"}
                onClick={() => handleTodolistFilter("all")}>All
        </Button>
        <Button variant={todolist.filter === "active" ? "contained" : "outlined"}
                color={"success"}
                size={"small"}
                onClick={() => handleTodolistFilter("active")}>Active
        </Button>
        <Button variant={todolist.filter === "completed" ? "contained" : "outlined"}
                color={"secondary"}
                size={"small"}
                onClick={() => handleTodolistFilter("completed")}>Completed
        </Button>
      </div>
    </div>
  )
})

