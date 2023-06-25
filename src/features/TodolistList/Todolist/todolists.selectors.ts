import {AppRootStateType} from "../../../app/store";
import {TodolistDomainType} from "./todolist.slice";

export const selectTodolists = (state: AppRootStateType): TodolistDomainType[] => state.todolists
