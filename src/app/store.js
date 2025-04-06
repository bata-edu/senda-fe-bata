import { configureStore } from "@reduxjs/toolkit";
import userProgressSlice from "../features/userProgress/userProgressSlice";
import moduleSlice from "../features/module/moduleSlice";
import authSlice from "../features/auth/authSlice";
const store = configureStore({
  reducer: {
    userProgress: userProgressSlice,
    modules: moduleSlice,
    auth: authSlice,
  },
});

export default store;
