import React from "react";
import { shallow } from 'enzyme';
import { createStore, useStore } from "../lib/index";

describe('test createStore', () => {
  it('test dispatch without reducer', () => {
    const valueStore = createStore('value', 0)
    expect(valueStore).not.toBeNull()
    
    const Button = () => {
      const [value, setValue] = useStore('value')
      return (
        <div id="btn" onClick={() => setValue(value + 1)}>
          {value}
        </div>
      );
    }

    const button = shallow(<Button />)
    expect(button.find('#btn').text()).toEqual("0")
  })

  it('test dispatch with reducer', () => {
    const countStore = createStore('count', {
      idCount: 0,
      todos: [{ id: 0, text: 'buy milk' }]
    }, (state, action) => {
      // when a reducer is being used, you must return a new state value
      switch (action.type) {
        case 'add':
          const id = ++state.idCount;
          return {
            ...state,
            todos: [...state.todos, { id, text: action.payload }]
          };
        case 'delete':
          return {
            ...state,
            todos: state.todos.filter(todo => todo.id !== action.payload)
          };
        default:
          return state;
      }
    })
    expect(countStore).not.toBeNull()

    const Button = () => {
      const [count, dispatch] = useStore('count')
      return (
        <div id="btn" onClick={() => dispatch({type: 'add'})}>
          {count}
        </div>
      );
    }

    // const button = shallow(<Button />)
    // expect(button.find('#btn').text()).toEqual("0")
  })
})