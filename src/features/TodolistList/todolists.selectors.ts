import {AppRootStateType} from "../../App/store";
import {TodolistDomainType} from "./todolistsReducer";

export const selectTodolists = (state: AppRootStateType): TodolistDomainType[] => state.todolists
