import React, {ChangeEvent, useState} from "react";
import TextField from "@mui/material/TextField";

type PropsType = {
    title: string
    changeTitle: (title: string) => void
}
export const EditableSpan = (props: PropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>("false")

    const activateEditMode = () => {
        setTitle(props.title)
        setEditMode(true)
    }
    const activateViewMode = () => {
        props.changeTitle(title)
        setEditMode(false)
    }
    const onChangeHandler = (e:ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)

    return editMode
        ? <TextField
            variant={"standard"}
            value={title}
            onChange={onChangeHandler}
            onBlur={activateViewMode}
            label={"Edit Title"}
            autoFocus
        />
        : <span onDoubleClick={activateEditMode}>{props.title}</span>

}