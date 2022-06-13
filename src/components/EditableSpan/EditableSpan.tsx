import React, {ChangeEvent, useCallback, useState} from "react";
import TextField from "@mui/material/TextField";

type PropsType = {
    title: string
    changeTitle: (title: string) => void
    disabled?: boolean
}
export const EditableSpan = React.memo(({title, changeTitle, disabled}: PropsType) => {
    console.log("EditableSpan")

    const [editMode, setEditMode] = useState<boolean>(false)
    const [localTitle, setLocalTitle] = useState<string>("false")

    const activateEditMode = () => {
        if (disabled) {
            return
        } else {
            setLocalTitle(title)
            setEditMode(true)
        }
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