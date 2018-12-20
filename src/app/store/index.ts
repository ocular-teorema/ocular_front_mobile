import { combineReducers, compose } from '@ngrx/store';
import * as teoremaReducer from './teorema/teoremaReducers';

export interface IState {
  teorema: any;
}

export function reducers(state, action) {
  const reducer = compose(combineReducers)({
    teoremaReducer: teoremaReducer.reducer
  });
  return reducer(state, action);
}
