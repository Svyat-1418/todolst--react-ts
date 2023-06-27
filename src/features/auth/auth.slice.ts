import { createSlice } from '@reduxjs/toolkit'
import { ResultCode } from 'common/enums/common.enums'
import { createAppAsyncThunk } from 'common/utils/createAppAsyncThunk'

import { appActions } from '../../app/app.slice'

import { LoginParamsType, authAPI } from './auth.api'

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
	'auth/login',
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI
		const res = await authAPI.login(arg)
		if (res.data.resultCode === ResultCode.success) {
			return { isLoggedIn: true }
		} else {
			return rejectWithValue(null)
		}
	}
)

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
	'auth/logout',
	async (_, { dispatch, rejectWithValue }) => {
		const res = await authAPI.logout()
		if (res.data.resultCode === ResultCode.success) {
			dispatch(appActions.clearData())
			return { isLoggedIn: false }
		} else {
			return rejectWithValue(null)
		}
	}
)

const initializeApp = createAppAsyncThunk('app/initializeApp', async (_, thunkAPI) => {
	const { dispatch, rejectWithValue } = thunkAPI
	try {
		const res = await authAPI.me()
		if (res.data.resultCode === ResultCode.success) {
			return { isLoggedIn: true }
		} else {
			return rejectWithValue(null)
		}
	} finally {
		dispatch(appActions.setAppIsInitialized({ isInitialized: true }))
	}
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
