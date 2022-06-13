import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from "react";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";

type PropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}
export const AddItemForm = React.memo(({addItem, disabled}: PropsType) => {
    console.log("AddItemForm")

    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const onClickHandler = useCallback(() => {
        if (title.trim() !== "") {
            addItem(title.trim())
            setTitle("")
        } else {
            setError("Title is required")
        }
    }, [addItem, title])
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }, [])
    const onKeyDownHandler = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) setError(null)
        if (e.key === "Enter") {
            onClickHandler()
        }
    }, [onClickHandler, error])

    return (
        <div>
            <TextField
                disabled={disabled}
                variant={"standard"}
                error={!!error}
                helperText={error}
                label={"Title"}
                placeholder={"Type title here..."}
                value={title}
                onChange={onChangeHandler}
                onKeyDown={onKeyDownHandler}
                /*I replace onKeyPress with onKeyDown because onKeyPress deprecated */
            />
            <IconButton disabled={disabled} onClick={onClickHandler}>
                <AddCircleOutline color={"primary"}/>
            </IconButton>
        </div>
    )
})