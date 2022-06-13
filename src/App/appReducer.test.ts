import {appReducer, InitialStateType, setAppStatusAC} from "./appReducer";

let startState: InitialStateType

beforeEach(() => {
    startState = {
        status: "idle"
    }
})
test('app status should be changed', () => {
    const endState = appReducer(startState, setAppStatusAC("loading"))

    expect(endState.status).toBe("loading")
})
