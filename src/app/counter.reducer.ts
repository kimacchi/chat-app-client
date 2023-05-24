import { createReducer, on } from '@ngrx/store';
import { login, logout } from './counter.actions';

export const initialState = "ahmet";

export const counterReducer = createReducer(
  initialState,
  on(login, (state, action)=>{
    console.log(action);
    return action.value;
  }),
  on(logout, (state) => "")
);
