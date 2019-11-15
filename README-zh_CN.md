# react-dux

[English](./README.md) | 简体中文

在react中使用的一个非常简单的全局状态管理库，使用react的useState钩子。使得组件之间能够共享状态，而无需mobx或redux。

# 文档列表

- [安装](#installation)
- 使用
  - [基础](#usage_basic)
  - [多个store使用](#usage_mutiple)
  - [为store加入reducer](#usage_reducer)
- API
  - [createStore](#api_createStore)
  - [useStore](#api_useStore)

## <a name="installation">安装</a>
使用npm进行安装.

`npm install --save react-dux`

## <a name="usage">使用</a>
### <a name="usage_basic">基础</a>

使用`useStore`方法，返回值为一个数组，数组的第一个元素为 __状态__，数组的第二个元素为状态处理函数 __dispatch__ 或 __setState__ . 当你使用了reducer，该值为dispatch， 否则为setState。

使用方法及实例如下：

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
HelloContent组件中的span元素被点击时，count会增加1，并且这个改变会同步到WorldContent组件中.

### <a name="usage_mutiple">多个store使用</a>
如果你在某个模块下需要使用多个store，可以这样使用。
再者，你可以使用store创建时给定的名字或创建后返回的store实例来使用useStore。

```jsx
import React from 'react';
import { createStore, useStore } from 'react-dux';

const countStore = createStore('countStore', 0);
createStore('nameStore', 'Walker Lee');

// 我们能够通过subscribe方法，订阅改store的变化
countStore.subscribe((state) => console.log(`更新触发，值为：${state}`))

// 设置count的值为2
countStore.setState(2);

const HelloContent = () => {

  // 通过实例获取值
  const [ count, setCount ] = useStore(countStore);
  // 通过store名获取值
  const [ name ] = useStore('nameStore');

  return (
    <div>
      <h1>你好, {name}!</h1>
      <h2>按钮被点击了 {count} 次</h2>
      <button type="button" onClick={() => setCount(count+1)}>更新</button>
    </div>
  );
}
```

### <a name="usage_reducer">为store加入reducer</a>
你习惯使用redux吗？那么请看，这个reducer方法类似于redux的处理, 此时我们就将状态的管理交给了`react-dux`，预先定义的reducer.

```jsx
import React from 'react';
import { createStore, useStore } from 'react-dux';

const todoStore = createStore(
  'todoStore',
  [
    {id: 0, text: 'Sing'}
  ],
  (state, action) => {
    // 如果使用了reducer，那么每次必须返回新的对象
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
      <button>创建</button>
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
创建一个公共store， 注册并返回store实例
#### name
store的名字
#### state
创建store的初始化state
#### reducer
你可以使用reducer去管理应用中的state，如果在创建store的时候你没有传入reducer，`react-dux` 会一个默认的reducer函数，换句话说，setState其实是dispatch的一个语法糖，setState是不用传递形如{type: 'add'}参数，这个函数是这样：`(state, payload) => payload`。

### <a>`useStore(identifier:string|Store):[state, setState|dispatch]`</a>
该方法调用后，返回一个数组，数组的第一个元素为 __state__，第二个元素为状态处理函数。