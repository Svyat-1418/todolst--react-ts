import {appReducer, RequestStatusType, setAppError, setAppStatus} from "./appReducer";

let startState: any

beforeEach(() => {
    startState = {
        status: "idle",
        error: null,
        isInitialized: false
    }
})
test('app status should be changed', () => {
    // @ts-ignore
    const endState = appReducer(startState, setAppStatus("loading"))

    expect(endState.status).toBe("loading")
})
test('error should be set', () => {
    // @ts-ignore
    const endState = appReducer(startState, setAppError("Some error has occurred"))

    expect(endState.error).toBe("Some error has occurred")
})
