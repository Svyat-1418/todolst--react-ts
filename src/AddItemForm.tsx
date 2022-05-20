import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";

type PropsType = {
    addItem: (title: string) => void
}
export const AddItemForm = (props: PropsType) => {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const onClickHandler = () => {
        if (title.trim() !== "") {
            props.addItem(title.trim())
            setTitle("")
        } else {
            setError("Title is required")
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.key === "Enter") {
            onClickHandler()
        }
    }

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
}