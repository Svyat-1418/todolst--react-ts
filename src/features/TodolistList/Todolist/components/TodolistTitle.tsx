import Delete from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import {FC, useCallback} from "react";
import {RequestStatusType} from "../../../../App/appReducer";
import {useAppDispatch} from "../../../../App/store";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {changeTodolistTitle, removeTodolist} from "../../todolistsReducer";

type PropsType = {
  todolistId: string
  title: string
  entityStatus: RequestStatusType
}
export const TodolistTitle: FC<PropsType> = ({title, entityStatus, todolistId}) => {
  const dispatch = useAppDispatch()
  
  const handleRemoveTodolist = useCallback(() => {
    dispatch(removeTodolist({id: todolistId}))
  }, [removeTodolist, todolistId])
  
  const changeTodolistTitleCallback = useCallback((title: string) => {
    dispatch(changeTodolistTitle({id: todolistId, title}))
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