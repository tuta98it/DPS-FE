import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import * as actionAuth from '../actions/auth.action';
import { AuthActionTypes } from '../actions/auth.action';
import { createSelector } from '@ngrx/store';
import { AppState } from '../../app-state/app-state';
import { AuthModel } from '../models/auth-model';

export const authAdapter: EntityAdapter<AuthModel> =
  createEntityAdapter<AuthModel>();
export const defaultAuth: AuthModel = {
  userId: null,
  userName: '',
  userTypes: [],
  fullName: '',
  isAuthenticated: false,
  avatar: '',
};

const newState = (state:any, newData:any) => Object.assign({}, state, newData);

export function authReducer(
  state = defaultAuth,
  action: actionAuth.AuthActions
): AuthModel {
  switch (action.type) {
    case AuthActionTypes.LoginSuccess: {
      return newState(state, {
        ...action.payload,
        isAuthenticated: true,
      });
    }
    case AuthActionTypes.LoginFail: {
      return {
        ...state,
        isAuthenticated: false,
      };
    }
    case AuthActionTypes.Logout: {
      return {
        ...state,
        ...defaultAuth
      };
    }
    case AuthActionTypes.LogoutFail: {
      return state;
    }
    default: {
      return state;
    }
  }
}

export const selectAuthFeature = (state: AppState) => state.auth;
export const getAuth = createSelector(
  selectAuthFeature,
  (auth: AuthModel) => auth
);
