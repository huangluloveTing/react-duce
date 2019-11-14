import { useState, useEffect } from "react";

const isFunction = fn => typeof fn === 'function' ;
const isString = str => typeof str === 'string';

const defaultReducer = (state, payload) => payload;

// define global store
let $$stores = {};
const $$subscribers = {};

/**
 * the class to implements store
 * 
 * @class Store
 */
class Store {
  constructor(name, state, reducer = defaultReducer) {
    this.name = name;
    this.state = state;
    this.reducer = reducer;
    this.dispatchers = [];
    this.dispatch = this.dispatch.bind(this)
  }

  subscribe(callback) {
    if (!isFunction(callback)) {
      throw new Error(
        `the function named subscribe callback argument must be a function.`
      );
    }
    const {name} = this
    if ($$subscribers[name].includes(callback)) {
      console.warn('This callback is already subscribed to this store.');
      return;
    }
    $$subscribers[name].push(callback);
    return () => {
      $$subscribers[name] = $$subscribers[name].filter(item => item !== callback)
    }
  }

  dispatch(action, callback) {
    const { name, state } = this;
    this.state = this.reducer(state, action);
    this.dispatchers.forEach(dispatcher => dispatcher(this.state));
    if ($$subscribers[name].length) {
      $$subscribers[name].forEach(c => c(state, action));
    }
    if (typeof callback === 'function') callback(state)
  }
}

/**
 * get store instance by input identifier
 * @param {*} identifier 
 * @returns {Store}
 */
function getStoreItem(identifier) {
  const name = identifier instanceof Store ? identifier.name : identifier;
  if (!$$stores[name]) {
    throw `Store with name ${name} does not exist`;
  }
  return $$stores[name]; 
}

export function createStore(name, state = {}, reducer) {
  if (!isString(name)) {
    throw new Error('Store name must be a string');
  }
  if ($$stores[name]) {
    throw new Error(`Store with name ${name} already exists`);
  }

  $$subscribers[name] = [];
  const store = new Store(name, state, reducer);

  $$stores = Object.assign({}, $$stores, {[name]: store});
  // console.log($$stores)
  return store;
}

/**
 * Can only be called within React Components
 * @param {String|Store} identifier - The identifier for the find store
 * @returns {Array} the [state, setState] pair.
 */
export function useStore(identifier) {
  const store = getStoreItem(identifier);

  const [ state, set ] = useState(store.state);

  useEffect(() => {
    if (!store.dispatchers.includes(set)) {
      store.dispatchers.push(set);
    }

    return () => {
      store.dispatchers = store.dispatchers.filter(setter => setter !== set)
    }
  }, [])

  return [ state, store.dispatch ];
}
