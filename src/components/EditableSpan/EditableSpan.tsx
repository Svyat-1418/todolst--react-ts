import React, {ChangeEvent, useCallback, useState} from "react";
import TextField from "@mui/material/TextField";

type PropsType = {
    title: string
    changeTitle: (title: string) => void
}
export const EditableSpan = React.memo(({title, changeTitle}: PropsType) => {
    console.log("EditableSpan")

    const [editMode, setEditMode] = useState<boolean>(false)
    const [localTitle, setLocalTitle] = useState<string>("false")

    const activateEditMode = () => {
        setLocalTitle(title)
        setEditMode(true)
    }
    const activateViewMode = useCallback(() => {
        changeTitle(localTitle)
        setEditMode(false)
    }, [changeTitle, localTitle])
    const onChangeHandler = useCallback((e:ChangeEvent<HTMLInputElement>) => {
        setLocalTitle(e.currentTarget.value)
    }, [])

    return editMode
        ? <TextField
            variant={"standard"}
            value={localTitle}
            onChange={onChangeHandler}
            onBlur={activateViewMode}
            label={"Edit Title"}
            autoFocus
        />
        : <span onDoubleClick={activateEditMode}>{title}</span>

})