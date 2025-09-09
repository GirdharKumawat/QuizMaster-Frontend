import { createSlice } from "@reduxjs/toolkit";
 


const initialQuizState = {
  quiz:[],
  loading: false,
  error: null,
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
        setQuiz(state, action) {
            state.quiz = action.payload;
        }
    }
   
});

export const { setLoading, setError, setQuiz } = quizSlice.actions;
export default quizSlice.reducer;