import { configureStore } from "@reduxjs/toolkit";
import userProgressSlice from "../features/userProgress/userProgressSlice";
import userSlice from "../features/user/userSlice";
import moduleSlice from "../features/module/moduleSlice";

const store = configureStore({
  reducer: {
    userProgress: userProgressSlice,
    user: userSlice,
    modules: moduleSlice,
  },
});

export default store;
