const initialState = {
    status: "idle" as RequestStatusType,
    error: null as string | null

}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case "APP/SET_APP_STATUS":
            return {...state, status: action.status}
        case "APP/SET_APP_ERROR":
            return {...state, error: action.error}
        default:
            return state
    }
}
//Actions
export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: "APP/SET_APP_STATUS", status} as const)
export const setAppErrorAC = (error: string | null) =>
    ({type: "APP/SET_APP_ERROR", error} as const)

//Types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type InitialStateType = typeof initialState
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>

export type AppActionsType =
    SetAppStatusActionType
    | SetAppErrorActionType