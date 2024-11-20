import { configureStore } from "@reduxjs/toolkit";
import userProgressSlice from "../features/userProgress/userProgressSlice";
import levelSlice from "../features/level/levelSlice";
import userSlice from "../features/user/userSlice";
import rootReducer from "../features/auth/rootReducer";
import moduleSlice from "../features/module/moduleSlice";
import sectionSlice from "../features/section/sectionSlice";
import teacherSlice from "../features/teacher/teacherSlice";
import schoolSlice from "../features/school/schoolSlice";
import examSlice from "../features/exam/examSlice";

const store = configureStore({
  reducer: {
    userProgress: userProgressSlice,
    level: levelSlice,
    user: userSlice,
    modules: moduleSlice,
    section: sectionSlice,
    teacher: teacherSlice,
    school: schoolSlice,
    exam: examSlice,
    rootReducer,
  },
});

export default store;
