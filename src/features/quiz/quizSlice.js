import { createSlice } from "@reduxjs/toolkit";

const initialQuizState = {
  createdQuizzes: [],
  enrolledQuizzes: [],
  loading: false,
  error: null,
  canTry: true, // Used to trigger initial fetch
};

const quizSlice = createSlice({
  name: "quiz",
  initialState: initialQuizState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    
    // ACTION 1: Replace the entire list (e.g., on Dashboard load)
    setCreatedQuizzes(state, action) {
      state.createdQuizzes = action.payload;
    },
    // ACTION 2: Add a single quiz (e.g., after Create Quiz)
    addCreatedQuiz(state, action) {
      state.createdQuizzes.push(action.payload);
    },

    // ACTION 3: Replace the entire list
    setEnrolledQuizzes(state, action) {
      state.enrolledQuizzes = action.payload;
    },
    // ACTION 4: Add a single quiz (e.g., after Join Quiz)
    addEnrolledQuiz(state, action) {
      state.enrolledQuizzes.push(action.payload);
    },

    setCanTry(state, action) {
      state.canTry = action.payload;
    }
  }
});

export const { 
    setLoading, 
    setError, 
    setCreatedQuizzes, 
    addCreatedQuiz, // New export
    setEnrolledQuizzes, 
    addEnrolledQuiz, // New export
    setCanTry 
} = quizSlice.actions;

export default quizSlice.reducer;