import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    
    leaderboard: [],


    // Quiz Session State for participants
    currentQuestionIndex: 0,
    questions: [],
    timeLeft: 0,
    playerStatus: 'not_started', // 'lobby' | 'active' | 'completed'
    attempted_questions: [],

};
const quizSessionSlice = createSlice({
    name: 'quizSession',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setQuestions(state, action) {
            state.questions = action.payload;
        },
        setCurrentQuestionIndex(state, action) {
            state.currentQuestionIndex = action.payload;
        },
        setTimeLeft(state, action) {
            state.timeLeft = action.payload;
        },
        setPlayerStatus(state, action) {
            state.playerStatus = action.payload;
        },
        setAttemptedQuestions(state, action) {
            state.attempted_questions = action.payload;
        },
        addAttemptedQuestion(state, action) {
            state.attempted_questions.push(action.payload);
        },

        setLeaderBoard(state, action) {
            state.leaderboard = action.payload;
        },
        updateLeaderBoard(state, action) {
            const updatedEntry = action.payload;
            const index = state.leaderboard.findIndex(entry => entry.participant_id === updatedEntry.participant_id);
            if (index !== -1) {
                state.leaderboard[index] = updatedEntry;
            }
        },
        resetQuizSession(state) {
            state.currentQuestionIndex = 0;
            state.questions = [];
            state.timeLeft = 0;
            state.playerStatus = 'not_started';
            state.attempted_questions = [];
        }

    }
});
export const {
    setLoading,
    setQuestions,
    setCurrentQuestionIndex,
    setTimeLeft,
    setPlayerStatus,
    setAttemptedQuestions,
    addAttemptedQuestion,
    resetQuizSession
} = quizSessionSlice.actions;
export default quizSessionSlice.reducer;
