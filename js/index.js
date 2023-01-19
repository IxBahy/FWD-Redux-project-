//  action types and functions
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'

function addTodoAction(todo) {
    return {
        type: ADD_TODO,
        todo,
    }
}
function removeTodoAction(id) {
    return {
        type: REMOVE_TODO,
        id,
    }
}
function toggleTodoAction(id) {
    return {
        type: TOGGLE_TODO,
        id,
    }
}
function addGoalAction(goal) {
    return {
        type: ADD_GOAL,
        goal,
    }
}
function removeGoalAction(id) {
    return {
        type: REMOVE_GOAL,
        id,
    }
}
function generateId() {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

//*****************************************************************************/
//*****************************************************************************/


//store functions
const createStore = (reducer) => {

    let state;
    let eventListeners = [];
    const getState = () => state;

    const subscribe = (listener) => {
        eventListeners.push(listener)
        return () => {
            eventListeners.filter((l) => l !== listener)
        }
    };

    const dispatch = (action) => {
        state = reducer(state, action)
        eventListeners.forEach((listener) => listener())
    }

    return {
        getState,
        subscribe,
        dispatch
    }
}

const rootReducer = (state = {}, action) => {
    return {
        todos: todos(state.todos, action),
        goals: goals(state.goals, action)
    }
}

const todos = (state = [], action) => {
    switch (action.type) {
        case ADD_TODO:
            return state.concat([action.todo])
        case REMOVE_TODO:
            return state.filter((todo) => todo.id !== action.id)
        case TOGGLE_TODO:
            return state.map((todo) => todo.id !== action.id ? todo :
                Object.assign({}, todo, { complete: !todo.complete }))
        default:
            return state
    }
}

const goals = (state = [], action) => {
    switch (action.type) {
        case ADD_GOAL:
            return state.concat([action.goal])
        case REMOVE_GOAL:
            return state.filter((goal) => goal.id !== action.id)
        default:
            return state
    }
}

//*****************************************************************************/
//*****************************************************************************/
//dom functions and calls

function createRemoveButton(onClick) {
    const removeBtn = document.createElement('button')
    removeBtn.innerHTML = 'X'
    removeBtn.addEventListener('click', onClick)
    return removeBtn
}

const addTodo = () => {
    const input = document.getElementById('todo')
    const name = input.value;
    input.value = ''
    store.dispatch(addTodoAction({
        name,
        complete: false,
        id: generateId()
    }))
}
const addGoal = () => {
    const input = document.getElementById('goal')
    const name = input.value;
    input.value = ''
    store.dispatch(addGoalAction({
        name,
        id: generateId()
    }))
}
const addTodoToHTML = (todo) => {
    const node = document.createElement('li')
    const text = document.createTextNode(todo.name)
    const removeBtn = createRemoveButton(() => {
        store.dispatch(removeTodoAction(todo.id))
    })
    removeBtn.className = 'btn btn-outline-danger mx-2'

    node.appendChild(text)
    node.appendChild(removeBtn)
    node.className = todo.complete ? 'text-success' : 'text-danger'
    node.addEventListener('click', () => {
        store.dispatch(toggleTodoAction(todo.id))
    })
    document.getElementById('todos').appendChild(node)
}

const addGoalToHTML = (goal) => {
    const node = document.createElement('li')
    const text = document.createTextNode(goal.name)
    const removeBtn = createRemoveButton(() => {
        store.dispatch(removeGoalAction(goal.id))
    })
    removeBtn.className = 'btn btn-outline-danger mx-2'
    node.appendChild(text)
    node.appendChild(removeBtn)
    document.getElementById('goals').appendChild(node)
}


document.getElementById('todoBtn').addEventListener('click', addTodo)
document.getElementById('goalBtn').addEventListener('click', addGoal)


//*****************************************************************************/
//*****************************************************************************/

const store = createStore(rootReducer)

store.subscribe(() => {
    const { goals, todos } = store.getState()
    document.getElementById('goals').innerHTML = ''
    document.getElementById('todos').innerHTML = ''
    goals.forEach(addGoalToHTML)
    todos.forEach(addTodoToHTML)
})
