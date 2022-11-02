import {authAPI, LoginParamsType, ResultCode} from "../../api/todolistAPI";
import {clearData, setAppStatus} from "../../App/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

export const login = createAsyncThunk<void, LoginParamsType>("auth/login",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
      const res = await authAPI.login(payload)
      if (res.data.resultCode === ResultCode.success) {
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
      } else {
        return handleServerAppError(res.data, thunkAPI)
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

export const logout = createAsyncThunk("auth/logout",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
      const res = await authAPI.logout()
      if (res.data.resultCode === ResultCode.success) {
        thunkAPI.dispatch(clearData())
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
      } else {
        return handleServerAppError(res.data, thunkAPI)
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false
      })
  }
})

export const {setIsLoggedIn} = authSlice.actions
export const authReducer = authSlice.reducer

