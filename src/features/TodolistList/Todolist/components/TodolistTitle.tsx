import Delete from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import {FC, useCallback} from "react";
import {RequestStatusType} from "../../../../App/appReducer";
import {useActions} from "../../../../common/hooks/useActions";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {todolistsThunks} from "../../todolistsReducer";

type PropsType = {
  todolistId: string
  title: string
  entityStatus: RequestStatusType
}
export const TodolistTitle: FC<PropsType> = ({title, entityStatus, todolistId}) => {
  const {changeTodolistTitle, removeTodolist} = useActions(todolistsThunks)
  
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