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
		clearData: () => {},
	},
	extraReducers: (builder) => {
		builder.addCase(authThunks.initializeApp.fulfilled, (state) => {
			state.isInitialized = true
		})
	},
})

export const { reducer: appReducer, actions: appActions } = slice

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
