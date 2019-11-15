# react-dux

English | [简体中文](./README-zh_CN.md)

A very simple global state management lib for React that uses  React's useState hook. Let you share state across components without mobx or redux..

# List of contents

- [Installation](#installation)
- Usage
  - [Basic](#usage_basic)
  - [Referencing stores](#usage_mutiple)
  - [Stores with reducer](#usage_reducer)
- API
  - [createStore](#api_createStore)
  - [useStore](#api_useStore)

## <a name="installation">Installation</a>
You can install the lib through NPM.

`npm install --save react-dux`

## <a name="usage">Usage</a>
### <a name="usage_basic">Basic</a>

You need create a store with initial state Firstly, then call `useStore` inside components to receive __state__ property and __dispatch__ method.
The first argument is state. second argument is mutative. you can use a reducer or not, see the advanced example down below.

```jsx
import React from 'react';
import { createStore, useStore } from 'react-dux';

// create a global store
createStore('countStore', 0);

const HelloContent = () => {
  const [ count, setCount ] = useStore('countStore');

  return (
    <span onClick={() => setCount(count + 1)}>{count}</span>
  )
}

const WorldContent = () => {
  const [ count ] = useStore('countStore');

  return (
    <span>{count}</span>
  )
}

```
When you click the span element inside HelloContent, the count state will be updated, This update will be synchronized to the WorldContent component，get the new state.

### <a name="usage_mutiple">Referencing stores</a>
If you have to create multiple store in your app, you can do like this.
By the way, store can be referenced by using instance that is returned by the createStore method, as well as using the name you given.

```jsx
import React from 'react';
import { createStore, useStore } from 'react-dux';

const countStore = createStore('countStore', 0);
createStore('nameStore', 'Walker Lee');

// we can subscribe the state change
countStore.subscribe((state) => console.log(`更新触发，值为：${state}`))

// counter will start at 2
countStore.setState(2);

const HelloContent = () => {

  // reference a store by its instance
  const [ count, setCount ] = useStore(countStore);
  // reference a store by its name
  const [ name ] = useStore('nameStore');

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <h2>The button was clicked        {count} times</h2>
      <button type="button" onClick={() => setCount(count+1)}>Update</button>
    </div>
  );
}
```

### <a name="usage_reducer">Stores with reducer</a>
Do you like redux? here you go, `react-dux` can delegate the state management to reducers.

```javascript
import React from 'react';
import { createStore, useStore } from 'react-dux';

const todoStore = createStore(
  'todoStore',
  [
    {id: 0, text: 'Sing'}
  ],
  (state, action) => {
    // you must return a new state value when a reducer is being used.
    switch (action.type) {
      case 'add':
        const id = state.length;
        return [
          ...state, 
          { id, text: action.payload }
        ];
      case 'delete':
        return state.filter(todo => todo.id !== action.payload)
      default:
        return state;
    }
  }
);

function AddTodo() {
  const [state, dispatch] = useStore('todoStore');
  const inputRef = React.useRef(null);

  const onSubmit = e => {
    e.preventDefault();
    const todo = inputRef.current.value;
    inputRef.current.value = '';
    dispatch({ type: 'add', payload: todo });
  };

  return (
    <form onSubmit={onSubmit}>
      <input ref={inputRef} />
      <button>Create</button>
    </form>
  );
}

function TodoList() {
  const [todos, dispatch] = useStore(todoStore);
  const deleteTodo = id => dispatch({ type: 'delete', payload: id });
  return (
    <ul>
      <h2>todolist</h2>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => deleteTodo(todo.id)} type="button">
            X
          </button>
        </li>
      ))}
    </ul>
  );
}

export { TodoList, AddTodo };
```

## <a name="api">API</a>
### <a name="api_createStore">`createStore(name: string, state?:*, reducer?:function): Store`</a>
Create a global store. Register and return a store instance.
#### name
The name for your global store.
#### state
Initial state for store.
#### reducer
You can use reducer to manage your application state, if you not given it, `react-dux` will give a default reducer to handle state change, the default reducer function like this: `(state, payload) => payload`

### <a>`useStore(identifier:string|Store):[state, setState|dispatch]`</a>
A function returns a array, the first element is __state__, seconed element is change state function.