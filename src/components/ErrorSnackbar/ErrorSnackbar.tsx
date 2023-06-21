import Snackbar from '@mui/material/Snackbar'
import MuiAlert, {AlertProps} from '@mui/material/Alert'
import {FC, forwardRef, SyntheticEvent} from "react";
import {useSelector} from "react-redux";
import {selectAppError} from "../../App/app.selectors";
import {setAppError} from "../../App/appReducer";
import {useAppDispatch} from "../../common/hooks/useAppDispatch";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export const ErrorSnackbar: FC = () => {
  const error = useSelector(selectAppError)
  const dispatch = useAppDispatch();
  
  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(setAppError({error: null}))
  }
  return (
    <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity='error' sx={{width: '100%'}}>
        {error}
      </Alert>
    </Snackbar>
  )
}
