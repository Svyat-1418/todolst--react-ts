import { Dispatch } from 'redux'

import { appActions } from '../../app/app.slice'
import { CommonResponseType } from '../types/common.types'

export const handleServerAppError = <D>(
	data: CommonResponseType<D>,
	dispatch: Dispatch,
	showError = true
) => {
	if (showError) {
		dispatch(
			appActions.setAppError({
				error: data.messages.length ? data.messages[0] : 'Some error occurred',
			})
		)
	}
}
