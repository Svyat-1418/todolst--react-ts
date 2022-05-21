import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from "react";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";

type PropsType = {
    addItem: (title: string) => void
}
export const AddItemForm = React.memo(({addItem}: PropsType) => {
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
            <IconButton onClick={onClickHandler}>
                <AddCircleOutline color={"primary"}/>
            </IconButton>
        </div>
    )
})