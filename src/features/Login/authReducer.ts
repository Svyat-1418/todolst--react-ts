import {authAPI, LoginParamsType, ResultCode} from "../../api/todolistAPI";
import {appActions} from "../../App/appReducer";
import {createSlice} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {createAppAsyncThunk} from "../../common/utils/createAppAsyncThunk";
import {handleServerAppError, handleServerNetworkError} from "../../common/utils/errorUtils";

const login = createAppAsyncThunk<void, LoginParamsType>("auth/login",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
      const res = await authAPI.login(payload)
      if (res.data.resultCode === ResultCode.success) {
        thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
      } else {
        return handleServerAppError(res.data, thunkAPI)
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

const logout = createAppAsyncThunk("auth/logout",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
      const res = await authAPI.logout()
      if (res.data.resultCode === ResultCode.success) {
        thunkAPI.dispatch(appActions.clearData())
        thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
      } else {
        return handleServerAppError(res.data, thunkAPI)
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI)
    }
  })

const initializeApp = createAppAsyncThunk("app/initializeApp",
  async (_, thunkAPI) => {
    try {
      const res = await authAPI.me()
      if (res.data.resultCode === ResultCode.success) {
        return {isLoggedIn: true}
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI, false)
    }
  })

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  )
  }
})

export const {reducer: authReducer} = authSlice
export const authThunks = {login, logout, initializeApp}

