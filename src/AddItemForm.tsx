import React, {ChangeEvent, KeyboardEvent, useState} from "react";

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
            <input
                value={title}
                onChange={onChangeHandler}
                onKeyDown={onKeyDownHandler}
                /*I replace onKeyPress with onKeyDown because onKeyPress deprecated */
                className={error ? "error" : ""}
            />
            <button onClick={onClickHandler}>+</button>
            {error && <div className={"error-message"}>{error}</div>}
        </div>
    )
}