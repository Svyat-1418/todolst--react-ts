import {ChangeEvent, FC, KeyboardEvent, memo, useCallback, useState} from "react";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";

type PropsType = {
  addItem: (title: string) => void
  disabled?: boolean
}
export const AddItemForm: FC<PropsType> = memo(({addItem, disabled}) => {
  const [title, setTitle] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  
  const handleAddItem = useCallback(() => {
    if (title.trim() !== "") {
      addItem(title.trim())
      setTitle("")
    } else {
      setError("Title is required")
    }
  }, [addItem, title])
  
  const handleChangeText = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }, [])
  
  const handleEnterPress = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) setError(null)
    if (e.key === "Enter") {
      handleAddItem()
    }
  }, [handleAddItem, error])
  
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
        onChange={handleChangeText}
        onKeyDown={handleEnterPress}
      />
      <IconButton disabled={disabled} onClick={handleAddItem}>
        <AddCircleOutline color={"primary"}/>
      </IconButton>
    </div>
  )
})