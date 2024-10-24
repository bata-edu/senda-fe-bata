import { configureStore } from "@reduxjs/toolkit";
import userProgressSlice from "../features/userProgress/userProgressSlice";
import levelSlice from "../features/level/levelSlice";
import userSlice from "../features/user/userSlice";
import rootReducer from "../features/auth/rootReducer";
import moduleSlice from "../features/module/moduleSlice";

const store = configureStore({
  reducer: {
    userProgress: userProgressSlice,
    level: levelSlice,
    user: userSlice,
    modules: moduleSlice,
    rootReducer,
  },
});

export default store;
