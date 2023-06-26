import Delete from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import {FC, useCallback} from "react";
import {RequestStatusType} from "../../../../app/app.slice";
import {useActions} from "../../../../common/hooks/useActions";
import {EditableSpan} from "../../../../common/components/EditableSpan/EditableSpan";
import {todolistThunks} from "../todolist.slice";

type PropsType = {
  todolistId: string
  title: string
  entityStatus: RequestStatusType
}
export const TodolistTitle: FC<PropsType> = ({title, entityStatus, todolistId}) => {
  const {changeTodolistTitle, removeTodolist} = useActions(todolistThunks)
  
  const handleRemoveTodolist = useCallback(() => {
    removeTodolist({id: todolistId})
  }, [removeTodolist, todolistId])
  
  const changeTodolistTitleCallback = useCallback((title: string) => {
    changeTodolistTitle({id: todolistId, title})
  }, [changeTodolistTitle, todolistId])
  
  return (
    <h3>
      <EditableSpan disabled={entityStatus === "loading"}
                    title={title}
                    changeTitle={changeTodolistTitleCallback}/>
      <IconButton disabled={entityStatus === "loading"}
                  onClick={handleRemoveTodolist}>
        <Delete color={"error"}/>
      </IconButton>
    </h3>
  )
}