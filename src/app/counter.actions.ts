import { createAction, props } from '@ngrx/store';

export const login = createAction("Login", props<{value:string}>())
export const logout = createAction("Logout");
