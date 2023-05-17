import { createReducer, on } from '@ngrx/store';
import { login } from './counter.actions';

export const initialState = "sdafdf";

export const counterReducer = createReducer(
  initialState,
  on(login, (state, action)=>{
    console.log(action);
    return action.value;
  })
);
