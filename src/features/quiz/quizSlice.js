import { createSlice } from "@reduxjs/toolkit";
 


const initialQuizState = {
  createdQuizzes:[],
  enrolledQuizzes:[],
  loading: false,
  error: null,
  canTry: true,
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
        
        setCretedQuizzes(state, action) {
            state.createdQuizzes = action.payload;
        },
        setEnrolledQuizzes(state, action) {
            state.enrolledQuizzes = action.payload;
        },

        setCanTry(state, action) {
            state.canTry = action.payload;
        }
        
    }
   
});

export const { setLoading, setError, setCretedQuizzes,setEnrolledQuizzes ,setCanTry } = quizSlice.actions;
export default quizSlice.reducer;