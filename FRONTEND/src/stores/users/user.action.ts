import type { LoginParams } from '../../interface/user/login.interface';
import type { ModelGetData } from '../../interface/user/user.interface';
import type { Dispatch } from '@reduxjs/toolkit';

import { apiLogin } from '../../api/system/auth-api';
import { apiGetUsers } from '../../api/system/users-api';
import { setUserItem } from './user.store';
import { createAsyncAction } from '../utils';

// typed wrapper async thunk function demo, no extra feature, just for powerful typings
// export const loginAsync = createAsyncAction<LoginParams, boolean>(payload => {
//   return async dispatch => {
//     const { result, status } = await apiLogin(payload);
//     console.log(result);
//     console.log(status);

//     if (status) {
//       localStorage.setItem('jwt', result.token);
//       localStorage.setItem('username', result.username);
//       dispatch(setUserItem({ logged: true, username: result.username, }),);
//     }
//     return status;
//   };
// });

export const loginAsync = (payload: LoginParams) => {
  return async (dispatch: Dispatch) => {
    const { result, status } = await apiLogin(payload);

    if (status) {
      localStorage.setItem('jwt', result.data.tokens.accessToken);
      localStorage.setItem('username', result.data.user.username);
      dispatch(setUserItem({ logged: true, username: result.data.user.username, }),);
    }
    return status;
  };
};

export const logoutAsync = () => {
  return async (dispatch: Dispatch) => {
    localStorage.clear();
    dispatch(setUserItem({ logged: false, }),);
    return true;
  };
};

export const getDataUserAsync = (payload: ModelGetData) => {
  return async (dispatch: Dispatch) => {
    const { result, status } = await apiGetUsers(payload);
    console.log(result);
    console.log(status);
    if (status) {

    }
    return result;
  };
}
