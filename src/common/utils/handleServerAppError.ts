import {Dispatch} from "redux";
import {ResponseType} from "../../api/todolistAPI";
import {appActions} from "../../App/appReducer";

export const handleServerAppError = <D>(data: ResponseType<D>,
                                        dispatch: Dispatch,
                                        showError = true) => {
  if (showError) {
    dispatch(appActions.setAppError({
      error: data.messages.length
        ? data.messages[0]
        : 'Some error occurred'
    }))
  }
}