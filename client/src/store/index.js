import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import dogsReducer from '../reducer/index';

const store = createStore(dogsReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;