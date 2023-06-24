import {authAPI, LoginParamsType, ResultCode} from "../../api/todolistAPI";
import {appActions} from "../../App/appReducer";
import {createSlice} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "../../common/utils/createAppAsyncThunk";
import {handleServerAppError} from "../../common/utils/handleServerAppError";
import {thunkTryCatch} from "../../common/utils/thunkTryCatch";

const login = createAppAsyncThunk<void, LoginParamsType>("auth/login",
  async (payload, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.login(payload)
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  })

const logout = createAppAsyncThunk("auth/logout",
  async (_, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.logout()
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.clearData())
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  })

const initializeApp = createAppAsyncThunk("app/initializeApp",
  async (_, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.me()
      if (res.data.resultCode === ResultCode.success) {
        return {isLoggedIn: true}
      }
    })
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

