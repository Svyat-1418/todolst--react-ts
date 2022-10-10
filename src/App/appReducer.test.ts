import {appReducer, RequestStatusType, setAppError, setAppStatus} from "./appReducer";

let startState: {
    status: RequestStatusType,
    error: string | null,
    isInitialized: boolean
}

beforeEach(() => {
    startState = {
        status: "idle",
        error: null,
        isInitialized: false
    }
})
test('app status should be changed', () => {
    const endState = appReducer(startState, setAppStatus({status: "loading"}))

    expect(endState.status).toBe("loading")
})
test('error should be set', () => {
    const endState = appReducer(startState, setAppError({error: "Some error has occurred"}))

    expect(endState.error).toBe("Some error has occurred")
})
