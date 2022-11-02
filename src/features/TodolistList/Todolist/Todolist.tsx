import React, {useCallback, useEffect} from "react";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {Task} from "./Task/Task";
import {TaskStatuses} from "../../../api/todolistAPI";
import {FilterValuesType} from "../todolistsReducer";
import {fetchTasks, TaskDomainType, UpdateDomainTaskModelType} from "../tasksReducer";
import {AppRootStateType, useAppDispatch} from "../../../App/store";
import {RequestStatusType} from "../../../App/appReducer";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type PropsType = {
    demo: boolean
    id: string
    title: string
    filter: FilterValuesType
    entityStatus: RequestStatusType
    tasks: Array<TaskDomainType>
    removeTaskCb: (id: string, todolistId: string) => void
    addTaskCb: (todolistId: string, title: string) => void
    updateTaskCb: (id: string, todolistId: string, model: UpdateDomainTaskModelType) => void
    removeTodolistCb: (id: string) => void
    changeTodolistFilterCb: (id: string, value: FilterValuesType) => void
    changeTodolistTitleCb: (id: string, title: string) => void

}

export const Todolist = React.memo(({
                                        demo,
                                        id, title, filter, entityStatus,
                                        tasks, removeTaskCb, addTaskCb, updateTaskCb,
                                        removeTodolistCb, changeTodolistFilterCb, changeTodolistTitleCb
                                    }: PropsType) => {

    const addTaskCallback = useCallback((title: string) => {
        addTaskCb(id, title)
    }, [addTaskCb, id])
    const removeTodolistCallback = useCallback(() => {
        removeTodolistCb(id)
    }, [removeTodolistCb, id])
    const changeTodolistTitleCallback = useCallback((title: string) => {
        changeTodolistTitleCb(id, title)
    }, [changeTodolistTitleCb, id])

    const onClickAllHandler = useCallback(() => {
        changeTodolistFilterCb(id, "all")
    }, [changeTodolistFilterCb, id])
    const onClickActiveHandler = useCallback(() => {
        changeTodolistFilterCb(id, "active")
    }, [changeTodolistFilterCb, id])
    const onClickCompletedHandler = useCallback(() => {
        changeTodolistFilterCb(id, "completed")
    }, [changeTodolistFilterCb, id])

    let filteredTasks = tasks
    if (filter === "active") {
        filteredTasks = tasks.filter(t => t.status === TaskStatuses.New)
    } else if (filter === "completed") {
        filteredTasks = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return (
        <div>
            <h3><EditableSpan disabled={entityStatus === "loading"} title={title} changeTitle={changeTodolistTitleCallback}/>
                <IconButton disabled={entityStatus === "loading"} onClick={removeTodolistCallback}>
                    <Delete color={"error"}/>
                </IconButton>
            </h3>
            <AddItemForm disabled={entityStatus === "loading"} addItem={addTaskCallback}/>
            {filteredTasks.map(t => <Task
                    key={t.id}
                    task={t}
                    removeTask={removeTaskCb}
                    updateTask={updateTaskCb}
                />
            )}

            <div>
                <Button variant={filter === "all" ? "contained" : "outlined"}
                        color={"primary"}
                        size={"small"}
                        onClick={onClickAllHandler}>All
                </Button>
                <Button variant={filter === "active" ? "contained" : "outlined"}
                        color={"success"}
                        size={"small"}
                        onClick={onClickActiveHandler}>Active
                </Button>
                <Button variant={filter === "completed" ? "contained" : "outlined"}
                        color={"secondary"}
                        size={"small"}
                        onClick={onClickCompletedHandler}>Completed
                </Button>
            </div>
        </div>
    )
})

