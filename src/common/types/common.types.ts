export type CommonResponseType<T = {}> = {
	resultCode: number
	fieldsErrors: FieldErrorType[]
	messages: string[]
	data: T
}
export type FieldErrorType = { field: string; error: string }
