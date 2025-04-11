import { configureStore } from "@reduxjs/toolkit";
import userProgressSlice from "../features/userProgress/userProgressSlice";
import freeCodeSlice from "../features/user/freeCodeSlice.js";
import moduleSlice from "../features/module/moduleSlice";
import authSlice from "../features/auth/authSlice";
const store = configureStore({
  reducer: {
    userProgress: userProgressSlice,
    freeCode: freeCodeSlice,
    modules: moduleSlice,
    auth: authSlice,
  },
});

export default store;
