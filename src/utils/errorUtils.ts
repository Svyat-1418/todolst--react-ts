import { setAppError, setAppStatus } from '../App/appReducer';
import { Dispatch } from 'redux';
import {ResponseType, ResultCodes} from '../api/todolistAPI';

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.resultCode === ResultCodes.error && data.messages.length) {
        dispatch(setAppError({error: data.messages[0]}))
    } else {
        dispatch(setAppError({error: "Some error has occurred. Contact the site administrator"}))
    }
    dispatch(setAppStatus({status: "succeeded"}))

}

export const handleServerNetworkError = (error: {message: string}, dispatch: Dispatch) => {
    dispatch(setAppError({error: error.message}))
    dispatch(setAppStatus({status: 'failed'}))
}

//=====================================
// if (data.messages.length) {
//     dispatch(setAppErrorAC(data.messages[0]))
// } else {
//     dispatch(setAppErrorAC('Some error occurred'))
// }
// dispatch(setAppStatusAC('failed'))