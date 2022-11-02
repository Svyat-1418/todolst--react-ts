import {authAPI, ResultCode} from "../api/todolistAPI";
import {handleServerNetworkError} from "../utils/errorUtils";
import {setIsLoggedIn} from "../features/Login/authReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

export const initializeApp = createAsyncThunk("app/initializeApp",
  async (_, thunkAPI) => {
    try {
      const res = await authAPI.me()
      if (res.data.resultCode === ResultCode.success) {
        thunkAPI.dispatch(setIsLoggedIn({isLoggedIn: true}))
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI, false)
    }
  })

const appSlice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false
  },
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    clearData: () => {
    }
  },
  extraReducers: builder => {
    builder
      .addCase(initializeApp.fulfilled, (state) => {
        state.isInitialized = true
      })
  }
})

export const {setAppStatus, setAppError, clearData} = appSlice.actions
export const appReducer = appSlice.reducer

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"