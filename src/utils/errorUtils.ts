// import {setAppError, setAppStatus} from '../App/appReducer';
// import {FieldErrorType, ResponseType, ResultCodes} from '../api/todolistAPI';
// import {AxiosError} from "axios";
// import {Dispatch} from "redux";
//
// export const handleServerAppError = <T>(data: ResponseType<T>,
//                                         thunkAPI: OwnThunkAPIType,
//                                         showError = true) => {
//   if (showError) {
//     thunkAPI.dispatch(setAppError({error: data.messages.length
//         ? data.messages[0] : "Some error has occurred. Contact the site administrator"}))
//   }
//   thunkAPI.dispatch(setAppStatus({status: "failed"}))
//   return thunkAPI.rejectWithValue({errors: data.messages[0], fieldsErrors: data.fieldsErrors})
// }
//
// export const handleServerNetworkError = (error: AxiosError,
//                                          thunkAPI: OwnThunkAPIType,
//                                          showError = true) => {
//   // (res.data.resultCode === ResultCodes.error && res.data.messages.length)
//   if (showError) {
//     thunkAPI.dispatch(setAppError({error: error.message}))
//   }
//   thunkAPI.dispatch(setAppStatus({status: 'failed'}))
//   return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
// }
//
// // type ThunkError = {
// //   errors: Array<string>
// //   rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
// // }
// type OwnThunkAPIType = {
//   dispatch: Dispatch
//   rejectWithValue: Function
// }







import {setAppError, setAppStatus} from '../App/appReducer';
import {Dispatch} from 'redux'
import {AxiosError} from 'axios'
import {FieldErrorType, ResponseType} from "../api/todolistAPI"

// original type:
// BaseThunkAPI<S, E, D extends Dispatch = Dispatch, RejectedValue = undefined>
type ThunkAPIType = {
  dispatch: (action: any) => any
  rejectWithValue: Function
}

export const handleServerAppError = <D>(data: ResponseType<D>,
                                             thunkAPI: ThunkAPIType,
                                             showError = true) => {
  if (showError) {
    thunkAPI.dispatch(setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
  }
  thunkAPI.dispatch(setAppStatus({status: 'failed'}))
  return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors})
}

export const handleServerNetworkError = (error: AxiosError,
                                              thunkAPI: ThunkAPIType,
                                              showError = true) => {
  if (showError) {
    thunkAPI.dispatch(setAppError({error: error.message ? error.message : 'Some error occurred'}))
  }
  thunkAPI.dispatch(setAppStatus({status: 'failed'}))
  return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
}

export type ThunkError = {
  errors: Array<string>
  rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}