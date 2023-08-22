import { combineReducers } from '@reduxjs/toolkit';
import globalReducer from './systems/global.store';
import tagsViewReducer from './systems/tagsView.store';
import userReducer from './users/user.store';

const rootReducer = combineReducers({
  user: userReducer,
  tagsView: tagsViewReducer,
  global: globalReducer,
});

export default rootReducer;
