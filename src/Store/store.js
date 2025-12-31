import { configureStore } from "@reduxjs/toolkit";
import authReducer  from "../features/auth/authSlice";
import quizReducer from "../features/quiz/quizSlice";
import currentQuizSessionReducer from "../features/quiz/currentQuizSessionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    currentQuizSession: currentQuizSessionReducer,
  },
});

export default store;