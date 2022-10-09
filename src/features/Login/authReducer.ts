import {authAPI, LoginParamsType, ResultCodes} from "../../api/todolistAPI";
import {AppThunk} from "../../App/store";
import {clearData, setAppStatus} from "../../App/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  }
})

export const {setIsLoggedIn} = authSlice.actions
export const authReducer = authSlice.reducer

// thunks
export const loginTC = (data: LoginParamsType): AppThunk => (dispatch) => {
  dispatch(setAppStatus({status: 'loading'}))
  authAPI.login(data)
    .then(res => {
      if (res.data.resultCode === ResultCodes.success) {
        dispatch(setIsLoggedIn({isLoggedIn: true}))
        dispatch(setAppStatus({status: 'idle'}))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => handleServerNetworkError(error, dispatch))
}
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(setAppStatus({status: 'loading'}))
  authAPI.logout()
    .then(res => {
      if (res.data.resultCode === ResultCodes.success) {
        dispatch(setIsLoggedIn({isLoggedIn: false}))
        dispatch(clearData())
        dispatch(setAppStatus({status: 'succeeded'}))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}