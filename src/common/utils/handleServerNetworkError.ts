import { appActions } from 'app/app.slice'
import axios, { AxiosError } from 'axios'
import { Dispatch } from 'redux'

/**
 * Handles network errors that occur when sending requests to the server
 * @param {unknown} e - Error, which occurred when sending requests to the server
 * @param {Dispatch} dispatch - Funtion dispatch from Redux library for sending actions
 * @param showError
 * @returns {void}
 */
export const handleServerNetworkError = (
	e: unknown,
	dispatch: Dispatch,
	showError: boolean = true
) => {
	if (showError) {
		const err = e as Error | AxiosError<{ error: string }>
		if (axios.isAxiosError(err)) {
			const error = err.message ? err.message : 'Some error occurred'
			dispatch(appActions.setAppError({ error }))
		} else {
			dispatch(appActions.setAppError({ error: `Native error ${err.message}` }))
		}
	}
}
