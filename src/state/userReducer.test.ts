import {userReducer} from './userReducer';

test('user reducer should increment only age', () => {
    const startState = { age: 20, childrenCount: 2, name: 'Dimych' };
    const action = { type: 'INCREMENT_AGE' }
    const endState = userReducer(startState, action)

    expect(endState.age).toBe(21);
    expect(endState.childrenCount).toBe(2);
});

test('user reducer should increment only childrenCount', () => {
    const startState = { age: 20, childrenCount: 2, name: 'Dimych' };
    const action = { type: 'INCREMENT_CHILDREN_COUNT' }
    const endState = userReducer(startState, action)

    expect(endState.age).toBe(20)
    expect(endState.childrenCount).toBe(3)
});

test('user reducer should change name of user', () => {
    const startState = { name: 'Dimych', age: 20, childrenCount: 2 };
    const newName = 'Viktor';
    const action = { type: 'CHANGE-NAME', newName: newName }
    const endState = userReducer(startState, action)

    expect(endState.age).toBe(20)
    expect(endState.childrenCount).toBe(2)
    expect(endState.name).toBe(newName);
});
