import { createSlice } from '@reduxjs/toolkit'
import { ResultCode } from 'common/enums/common.enums'
import { createAppAsyncThunk } from 'common/utils/createAppAsyncThunk'
import { handleServerAppError } from 'common/utils/handleServerAppError'
import { thunkTryCatch } from 'common/utils/thunkTryCatch'

import { LoginParamsType, authAPI } from './auth.api'

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
	'auth/login',
	async (payload, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI
		return thunkTryCatch(thunkAPI, async () => {
			const res = await authAPI.login(payload)
			if (res.data.resultCode === ResultCode.success) {
				return { isLoggedIn: true }
			} else {
				handleServerAppError(res.data, dispatch)
				return rejectWithValue(null)
			}
		})
	}
)

const logout = createAppAsyncThunk('auth/logout', async (_, thunkAPI) => {
	const { dispatch, rejectWithValue } = thunkAPI
	return thunkTryCatch(thunkAPI, async () => {
		const res = await authAPI.logout()
		if (res.data.resultCode === ResultCode.success) {
			return { isLoggedIn: false }
		} else {
			handleServerAppError(res.data, dispatch)
			return rejectWithValue(null)
		}
	})
})

const initializeApp = createAppAsyncThunk('app/initializeApp', async (_, thunkAPI) => {
	return thunkTryCatch(thunkAPI, async () => {
		const res = await authAPI.me()
		if (res.data.resultCode === ResultCode.success) {
			return { isLoggedIn: true }
		}
	})
})

const slice = createSlice({
	name: 'auth',
	initialState: {
		isLoggedIn: false,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(login.fulfilled, (state, action) => {
				state.isLoggedIn = action.payload.isLoggedIn
			})
			.addCase(logout.fulfilled, (state, action) => {
				state.isLoggedIn = action.payload.isLoggedIn
			})
			.addCase(initializeApp.fulfilled, (state, action) => {
				state.isLoggedIn = action.payload.isLoggedIn
			})
	},
})

export const { reducer: authReducer } = slice
export const authThunks = { login, logout, initializeApp }
