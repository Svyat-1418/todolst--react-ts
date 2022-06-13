const initialState = {
    status: "idle" as RequestStatusType
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case "APP/SET_APP_STATUS":
            return {...state, status: action.status}
        default:
            return state
    }
}
//Actions
export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: "APP/SET_APP_STATUS", status} as const)

//Types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type InitialStateType = typeof initialState
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type AppActionsType =
    SetAppStatusActionType