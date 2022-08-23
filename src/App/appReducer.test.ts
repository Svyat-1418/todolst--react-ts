import {appReducer, InitialStateType, setAppErrorAC, setAppStatusAC} from "./appReducer";

let startState: InitialStateType

beforeEach(() => {
    startState = {
        status: "idle",
        error: null,
        isInitialized: false
    }
})
test('app status should be changed', () => {
    const endState = appReducer(startState, setAppStatusAC("loading"))

    expect(endState.status).toBe("loading")
})
test('error should be set', () => {
    const endState = appReducer(startState, setAppErrorAC("Some error has occurred"))

    expect(endState.error).toBe("Some error has occurred")
})
