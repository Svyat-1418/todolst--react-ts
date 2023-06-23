import { AppDispatch, AppRootStateType } from '../../App/store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ResponseType } from '../../api/todolistAPI';

/**
 * This function avoids duplication when typing ThunkAPiConfig
 *
 * https://redux-toolkit.js.org/usage/usage-with-typescript#defining-a-pre-typed-createasyncthunk
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: AppDispatch
  rejectValue: null | ResponseType
}>()
