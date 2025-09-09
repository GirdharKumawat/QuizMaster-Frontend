import { configureStore } from "@reduxjs/toolkit";
import authReducer  from "../features/auth/authSlice";
import quizReducer from "../features/quiz/quizSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
  },
});

export default store;