import TextField from '@mui/material/TextField'
import { ChangeEvent, FC, memo, useCallback, useState } from 'react'

type PropsType = {
	title: string
	changeTitle: (title: string) => void
	disabled?: boolean
}
export const EditableSpan: FC<PropsType> = memo(({ title, changeTitle, disabled }) => {
	const [editMode, setEditMode] = useState<boolean>(false)
	const [localTitle, setLocalTitle] = useState<string>('false')

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

	const handleChangeText = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setLocalTitle(e.currentTarget.value)
	}, [])

	return editMode ? (
		<TextField
			variant={'standard'}
			value={localTitle}
			onChange={handleChangeText}
			onBlur={activateViewMode}
			label={'Edit Title'}
			autoFocus
		/>
	) : (
		<span onDoubleClick={activateEditMode}>{title}</span>
	)
})
