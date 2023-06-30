import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { authThunks } from '../features/auth/auth.slice'

const slice = createSlice({
	name: 'app',
	initialState: {
		status: 'idle' as RequestStatusType,
		error: null as string | null,
		isInitialized: false,
	},
	reducers: {
		setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
			state.status = action.payload.status
		},
		setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
			state.error = action.payload.error
		},
		setAppIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
			state.isInitialized = action.payload.isInitialized
		},
		clearData: () => {},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(
				(action) => action.type.endsWith('pending'),
				(state) => {
					state.status = 'loading'
				}
			)
			.addMatcher(
				(action) => action.type.endsWith('/fulfilled'),
				(state) => {
					state.status = 'succeeded'
				}
			)
			.addMatcher(
				(action) => {
					console.log('✅✅✅ addMatcher matcher', action)
					return action.type.endsWith('/rejected')
				},
				(state, action) => {
					state.status = 'failed'
					console.log('✅ addMatcher reducer', state, action)
				}
			)
	},
})

export const { reducer: appReducer, actions: appActions } = slice

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
