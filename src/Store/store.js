import { configureStore } from "@reduxjs/toolkit";
import authReducer  from "../features/auth/authSlice";
import quizReducer from "../features/quiz/quizSlice";
import quizSessionReducer from "../features/quiz/quizSessionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    quizSession: quizSessionReducer,
  },
});

export default store;