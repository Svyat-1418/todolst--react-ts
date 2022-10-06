import {authAPI, LoginParamsType, ResultCodes} from "../../api/todolistAPI";
import {AppThunk} from "../../App/store";
import {setAppStatusAC} from "../../App/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {clearDataAC} from "../TodolistList/todolistsReducer";

const initialState = {
  isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
  switch (action.type) {
    case 'login/SET-IS-LOGGED-IN':
      return {...state, isLoggedIn: action.value}
    default:
      return state
  }
}

// actions
export const setIsLoggedInAC = (value: boolean) =>
  ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginParamsType): AppThunk => (dispatch) => {
  dispatch(setAppStatusAC('loading'))
  authAPI.login(data)
    .then(res => {
      if (res.data.resultCode === ResultCodes.success) {
        dispatch(setIsLoggedInAC(true))
        dispatch(setAppStatusAC('idle'))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => handleServerNetworkError(error, dispatch))
}
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(setAppStatusAC('loading'))
  authAPI.logout()
    .then(res => {
      if (res.data.resultCode === ResultCodes.success) {
        dispatch(setIsLoggedInAC(false))
        dispatch(clearDataAC())
        dispatch(setAppStatusAC('succeeded'))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

// types
export type AuthActionsType =
  ReturnType<typeof setIsLoggedInAC>
