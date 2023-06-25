import { AppDispatch, AppRootStateType } from '../../app/store';
import { createAsyncThunk } from '@reduxjs/toolkit';

import {CommonResponseType} from "../types/common.types";

/**
 * This function avoids duplication when typing ThunkAPiConfig
 *
 * https://redux-toolkit.js.org/usage/usage-with-typescript#defining-a-pre-typed-createasyncthunk
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: AppDispatch
  rejectValue: null | CommonResponseType
}>()
