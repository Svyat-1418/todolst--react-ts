import { setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from '../App/appReducer';
import { Dispatch } from 'redux';
import {ResponseType, ResultCodes} from '../api/todolistAPI';

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.resultCode === ResultCodes.error && data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC("Some error has occurred. Contact the site administrator"))
    }
    dispatch(setAppStatusAC("succeeded"))

}

export const handleServerNetworkError = (error: {message: string}, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppErrorAC(error.message))
    dispatch(setAppStatusAC('failed'))
}

type ErrorUtilsDispatchType = Dispatch<SetAppErrorActionType | SetAppStatusActionType>

//=====================================
// if (data.messages.length) {
//     dispatch(setAppErrorAC(data.messages[0]))
// } else {
//     dispatch(setAppErrorAC('Some error occurred'))
// }
// dispatch(setAppStatusAC('failed'))