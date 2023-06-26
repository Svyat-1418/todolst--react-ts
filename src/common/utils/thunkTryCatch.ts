import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { appActions } from 'app/app.slice'
import { AppDispatch, AppRootStateType } from 'app/store'
import { CommonResponseType } from 'common/types/common.types'

import { handleServerNetworkError } from './handleServerNetworkError'

export const thunkTryCatch = async (
	thunkAPI: BaseThunkAPI<AppRootStateType, any, AppDispatch, null | CommonResponseType>,
	logic: Function
) => {
	const { dispatch, rejectWithValue } = thunkAPI

	dispatch(appActions.setAppStatus({ status: 'loading' }))
	try {
		return await logic()
	} catch (e) {
		handleServerNetworkError(e, dispatch)
		return rejectWithValue(null)
	} finally {
		dispatch(appActions.setAppStatus({ status: 'idle' }))
	}
}
