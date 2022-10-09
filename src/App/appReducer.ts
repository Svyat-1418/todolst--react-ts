import {authAPI, ResultCodes} from "../api/todolistAPI";
import {handleServerAppError, handleServerNetworkError} from "../utils/errorUtils";
import {setIsLoggedIn} from "../features/Login/authReducer";
import {AppThunk} from "./store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppStatus: (state, action: PayloadAction<{status: RequestStatusType}>) => {
      state.status = action.payload.status
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setAppIsInitialized: (state, action: PayloadAction<{isInitialized: boolean}>) => {
      state.isInitialized = action.payload.isInitialized
    },
    clearData: () => {}
  }
})

export const {setAppStatus, setAppError, setAppIsInitialized, clearData} = appSlice.actions
export const appReducer = appSlice.reducer

/*

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case "APP/SET_APP_STATUS":
            return {...state, status: action.status}
        case "APP/SET_APP_ERROR":
            return {...state, error: action.error}
        case "APP/SET_APP_IS_INITIALIZED":
            return {...state, isInitialized: action.value}
        default:
            return state
    }
}
*/

/*
//Actions
export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: "APP/SET_APP_STATUS", status} as const)
export const setAppErrorAC = (error: string | null) =>
    ({type: "APP/SET_APP_ERROR", error} as const)
export const setAppIsInitialized = (value: boolean) => ({type: "APP/SET_APP_IS_INITIALIZED", value} as const)
*/

//Thunks
export const initializeAppTC = (): AppThunk => (dispatch) => {
  authAPI.me()
    .then(res => {
      if (res.data.resultCode === ResultCodes.success) {
        dispatch(setIsLoggedIn({isLoggedIn: true}));
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => handleServerNetworkError(error, dispatch))
    .finally(() => dispatch(setAppIsInitialized({isInitialized: true})))
}

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

/*
//Types
export type InitialStateType = typeof initialState
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>

export type AppActionsType =
    SetAppStatusActionType
    | SetAppErrorActionType
    | ReturnType<typeof setAppIsInitialized>*/
