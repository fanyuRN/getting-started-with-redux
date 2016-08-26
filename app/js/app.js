/**
 * chapter11: Implementing combineReducers() from Scratch
 */

import React from 'react';
import ReactDOM from 'react-dom';

// create a top level store with combineReducers
import { createStore } from 'redux';

// reducer composition with arrays
const todo = (state, action) => {
	Object.freeze(state);

	switch (action.type) {
		case 'ADD_TODO':
			return {
				id: action.id,
				text: action.text,
				completed: false,
			};

		case 'TOGGLE_TODO':
			if (state.id !== action.id) {
					return state;
				}

				return {
					...state,
					completed: !state.completed,
				}
		default: 
			return state;
	}
}

const todos = (state = [], action) => {
	console.log('dispatch to reducer todos ---', action)

	Object.freeze(state);

	switch (action.type) {
		case 'ADD_TODO':
			return [
				...state,
				todo(undefined, action),
			];
		case 'TOGGLE_TODO':
			return state.map(t => todo(t, action));
		default: 
			return state;
	}
}


// To store this new information, we don't need to change the existing reducers.
const visibilityFilter = (state = 'SHOW_ALL', action) => {
	console.log('dispatch to reducer visibilityFilter ***', action);
	Object.freeze(state);
	switch (action.type) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default: 
			return state;
	}
}

/**
 * reducer composition with objects
 *
 * We will use reducer composition to create a new reducer that calls existing reducers to manage their parts of the state, 
 * then combine the parts into a single state object.
 * 
 * This pattern helps to scale Redux development, 
 * since different team members can work on different reducers that work with the same actions, 
 * without stepping on eachother's toes.
 *
 * 每一次dispatch都会流过每一个子reducer
 */
// const todoApp = (state = {}, action) => {
//   return {
//      // Call the `todos()` reducer from last section
//      todos: todos( 
//       state.todos,
//       action
//     ),
//     visibilityFilter: visibilityFilter(
//       state.visibilityFilter,
//       action
//     )
//   };
// };

// Implementing combineReducers from scratch
const combineReducers = reducers => {
  return (state = {}, action) => {
    // Reduce all the keys for reducers from `todos` and `visibilityFilter`
    return Object.keys(reducers).reduce(
      (nextState, key) => {
        // Call the corresponding reducer function for a given key
        nextState[key] = reducers[key] (
          state[key],
          action
        );
        return nextState;
      },
      {} // The `reduce` on our keys gradually fills this empty object until it is returned.
    );
  };
};

///////////////////////////////////////////////////////////////////
/**
 * so, what is javascript function Array.prototype.reduce do ?
 */
var _arr1 = [0, 1, 2, 3],
		_arr2 = [[0, 1], [2, 3], [4, 5]],
		_arr3 = ['hello', 'world'];

var arr1 = _arr1.reduce(function (previousValue, currentValue, index, array) {
	return previousValue + currentValue;
}, 10);

console.log('_arr1', _arr1)
console.log('arr1', arr1)

var arr2 = _arr2.reduce(function (previousValue, currentValue, index, array) {
	return previousValue.concat(currentValue);
}, [8, 0]);

console.log('_arr2', _arr2)
console.log('arr2', arr2)

var arr3 = _arr3.reduce(function (nextState, key) {
	nextState[key] = key.toUpperCase();
	return nextState;
}, {});

console.log('_arr3', _arr3)
console.log('arr3', arr3)
////////////////////////////////////////////////////////////////////

/**
 * now, we use our combineReducers
 */
const todoApp = combineReducers({
	todos,
	visibilityFilter
});

// createStore
const store = createStore(todoApp);

var count = 0,
		redux = ['r', 'e', 'd', 'u', 'x'];

// React render like function
const Todos = ({
  todos,
}) => {
	let list = todos.map(todo => {
		return <li 
			key={todo.id} 
			style={{fontSize: 16, color: todo.completed ? '#aaa' : '#00a'}}>
				<a onClick={() => store.dispatch({
					type: 'TOGGLE_TODO',
					id: todo.id,
				})}>{todo.text}</a>
			</li>
	})

	return (
	  <div>
	  	<button onClick={() => {
	    	let _text = redux.slice().sort(function() {
				  return .5 - Math.random();
				});
	    	store.dispatch({
		    	type: 'ADD_TODO',
		    	id: count,
		    	text: _text.join('')
		    });

		    count++;
	    }}>add todo</button>
	    <ul>
	    	{list}
	    </ul>
	  </div>
	);
}

const render = () => {
  ReactDOM.render(
    <Todos
      todos={store.getState().todos}
    />,
    document.getElementById('root')
  );
}

render();

// everytime store.dispatch, subscribe called
store.subscribe(render)

