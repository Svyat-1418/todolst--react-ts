import React, {useCallback} from "react";
import {EditableSpan} from "./EditableSpan";
import {AddItemForm} from "./AddItemForm";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {Task} from "./Task";
import {TaskStatuses, TaskType} from "./api/todolistAPI";
import {FilterValuesType} from "./state/todolistsReducer";

type PropsType = {
    id: string
    title: string
    filter: FilterValuesType
    tasks: Array<TaskType>
    removeTask: (id: string, todolistId: string) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (id: string, todolistId: string, status: TaskStatuses) => void
    changeTaskTitle: (id: string, todolistId: string, title: string) => void
    removeTodolist: (id: string) => void
    changeTodolistFilter: (id: string, value: FilterValuesType) => void
    changeTodolistTitle: (id: string, title: string) => void

}

export const Todolist = React.memo(({id, title, filter,
                                        tasks, removeTask, addTask, changeTaskStatus, changeTaskTitle,
                                        removeTodolist, changeTodolistFilter, changeTodolistTitle}: PropsType) => {
    console.log("Todolist")

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
            <h3><EditableSpan title={title} changeTitle={changeTodolistTitleCallback}/>
                <IconButton onClick={removeTodolistCallback}>
                    <Delete color={"error"}/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskCallback}/>
            {filteredTasks.map(t => <Task
                    key={t.id}
                    task={t}
                    removeTask={removeTask}
                    changeTaskStatus={changeTaskStatus}
                    changeTaskTitle={changeTaskTitle}
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

