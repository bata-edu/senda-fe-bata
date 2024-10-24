import { combineReducers } from "@reduxjs/toolkit";
import userProgressSlice from "../userProgress/userProgressSlice";
import levelSlice from "../level/levelSlice";
import userSlice from "../user/userSlice";
import { RESET_STATE } from "../../utils/constants";
import moduleSlice from "../module/moduleSlice";

const appReducer = combineReducers({
  userProgress: userProgressSlice,
  level: levelSlice,
  user: userSlice,
  modules: moduleSlice,
});
const rootReducer = (state, action) => {
  if (action.type === RESET_STATE) {
    state = {};
  }
  return appReducer(state, action);
};

export default rootReducer;
