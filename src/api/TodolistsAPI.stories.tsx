import React, {useEffect, useState} from 'react'
import {todolistAPI} from "./todolistAPI";

export default {
    title: 'API/Todolist'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodolists()
            .then((res) => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title = "Web Design"
        todolistAPI.createTodolist(title)
            .then((res) => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const id = "91eb3a8c-fbab-4baa-bd5c-4065d52de590";
        todolistAPI.deleteTodolist(id)
            .then((res) => {
                setState(res.data);
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const id = "89734535-825b-44e6-8d26-1bfd1e199c95"
        const title = "Web Design"
        todolistAPI.updateTodolist(id, title)
            .then((res) => {
                setState(res.data)
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}


export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "9ba71cc9-3ce4-4325-a9cf-57c9c1e5147c"
        todolistAPI.getTasks(todolistId)
            .then((res) => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "9ba71cc9-3ce4-4325-a9cf-57c9c1e5147c"
        const title = "Yo@"
        todolistAPI.createTask(todolistId, title)
            .then((res) => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "9ba71cc9-3ce4-4325-a9cf-57c9c1e5147c"
        const id = "f174d9fe-3257-4453-8c7f-d427938c2034"
        todolistAPI.deleteTask(id, todolistId)
            .then((res) => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "9ba71cc9-3ce4-4325-a9cf-57c9c1e5147c"
        const id = "f174d9fe-3257-4453-8c7f-d427938c2034"
        const title = "New Task"
        const model = {
            title,
            description: "",
            status: 0,
            priority: 1,
            startDate: "",
            deadline: ""
        }
        todolistAPI.updateTask(id, todolistId, model)
            .then((res) => {
                setState(res.data);
            })

    }, [])

    return <div>{JSON.stringify(state)}</div>

}
