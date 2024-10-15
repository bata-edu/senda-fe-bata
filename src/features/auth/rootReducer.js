import { combineReducers } from '@reduxjs/toolkit';
import userProgressSlice from '../userProgress/userProgressSlice';
import levelSlice from '../level/levelSlice';
import userSlice from '../user/userSlice';
import { RESET_STATE } from '../../utils/constants';

const appReducer = combineReducers({
  userProgress: userProgressSlice,
  level: levelSlice,
  user: userSlice,
});
const rootReducer = (state, action) => {
    if (action.type === RESET_STATE) {
        state = undefined;
    }
    return appReducer(state, action);
};
  
  export default rootReducer;
  
