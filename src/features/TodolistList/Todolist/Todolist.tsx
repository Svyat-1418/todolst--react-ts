import React, {useCallback, useEffect} from "react";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {Task} from "./Task/Task";
import {TaskStatuses} from "../../../api/todolistAPI";
import {FilterValuesType} from "../todolistsReducer";
import {fetchTasksTC, TaskDomainType, UpdateDomainTaskModelType} from "../tasksReducer";
import {useAppDispatch} from "../../../App/store";
import {RequestStatusType} from "../../../App/appReducer";

type PropsType = {
    demo: boolean
    id: string
    title: string
    filter: FilterValuesType
    entityStatus: RequestStatusType
    tasks: Array<TaskDomainType>
    removeTask: (id: string, todolistId: string) => void
    addTask: (todolistId: string, title: string) => void
    updateTask: (id: string, todolistId: string, model: UpdateDomainTaskModelType) => void
    removeTodolist: (id: string) => void
    changeTodolistFilter: (id: string, value: FilterValuesType) => void
    changeTodolistTitle: (id: string, title: string) => void

}

export const Todolist = React.memo(({
                                        demo,
                                        id, title, filter, entityStatus,
                                        tasks, removeTask, addTask, updateTask,
                                        removeTodolist, changeTodolistFilter, changeTodolistTitle
                                    }: PropsType) => {
    console.log("Todolist")
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!demo) dispatch(fetchTasksTC(id))
        // eslint-disable-next-line
    }, [])

    const addTaskCallback = useCallback((title: string) => {
        addTask(id, title)
    }, [addTask, id])
    const removeTodolistCallback = useCallback(() => {
        removeTodolist(id)
    }, [removeTodolist, id])
    const changeTodolistTitleCallback = useCallback((title: string) => {
        changeTodolistTitle(id, title)
    }, [changeTodolistTitle, id])

    const onClickAllHandler = useCallback(() => {
        changeTodolistFilter(id, "all")
    }, [changeTodolistFilter, id])
    const onClickActiveHandler = useCallback(() => {
        changeTodolistFilter(id, "active")
    }, [changeTodolistFilter, id])
    const onClickCompletedHandler = useCallback(() => {
        changeTodolistFilter(id, "completed")
    }, [changeTodolistFilter, id])

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
                    removeTask={removeTask}
                    updateTask={updateTask}
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

