import Button from "@mui/material/Button";
import {FC, useCallback} from "react";
import {useAppDispatch} from "../../../../App/store";
import {changeTodolistFilter, FilterValuesType} from "../../todolistsReducer";

type PropsType = {
  todolistId: string
  todolistFilter: FilterValuesType
}

export const TaskFilterButtons: FC<PropsType> = ({todolistFilter, todolistId}) => {
  const dispatch = useAppDispatch()
  
  const handleTodolistFilter = useCallback((filter: FilterValuesType) => {
    dispatch(changeTodolistFilter({id: todolistId, filter}))
  }, [changeTodolistFilter, todolistId])
  
  return (
    <div>
      <Button variant={todolistFilter === "all" ? "contained" : "outlined"}
              color={"primary"}
              size={"small"}
              onClick={() => handleTodolistFilter("all")}>All
      </Button>
      <Button variant={todolistFilter === "active" ? "contained" : "outlined"}
              color={"success"}
              size={"small"}
              onClick={() => handleTodolistFilter("active")}>Active
      </Button>
      <Button variant={todolistFilter === "completed" ? "contained" : "outlined"}
              color={"secondary"}
              size={"small"}
              onClick={() => handleTodolistFilter("completed")}>Completed
      </Button>
    </div>
  )
}