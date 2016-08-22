// a counter reducer
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// const { createStore } = Redux; // Redux CDN import syntax
import { createStore } from 'redux' // npm module syntax

const store = createStore(counter);

/**
 * store has 3 important methods:
 * getState()
 * dispatch()
 * subscribe()
 */
const render = () => {
 document.body.innerText = store.getState();
};

store.subscribe(render);
render(); // calling once to render the initial state (0), then the subscribe will update subsequently

document.addEventListener('click', () => {
   store.dispatch({ type : 'INCREMENT' })
});