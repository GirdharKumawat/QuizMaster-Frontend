import { createSlice } from "@reduxjs/toolkit";

const initialState = {

  session_id: null,
  status: "waiting", // 'waiting' | 'active' | 'completed'
  participants: [],
  
  // Quiz Session State for participants
  quiz_id: null,
  title: "",
  description: "",
  duration: 0, // in minutes
  host_id: null,
  question_count: 0,
  
  questions: [],
  currentQuestionIndex: 0,
  playerStatus: "lobby", // 'lobby' | 'active' | 'completed'
  timeLeft: 0,

  isInitialState: true,
};
const quizSessionSlice = createSlice({
  name: "quizSession",
  initialState,
  reducers: {

    

    //   status
    setStatus(state, action) {
      state.status = action.payload;
    },

    // participant management
    setParticipants(state, action) {
      state.participants = action.payload;
    },

    addParticipant(state, action) {
      const { user_id, name, score, status, start_time } = action.payload;
      const exists = state.participants.some((p) => p.user_id === user_id);
      if (!exists) {
        state.participants.push({ user_id, name, score, status ,start_time });
      }
    },

    updateParticipantScore(state, action) {
      const { user_id, score } = action.payload;
      const participant = state.participants.find((p) => p.user_id === user_id);
      if (participant) {
        participant.score = score;
      }
    },

    updateParticipantStatus(state, action) {
      const { user_id, status,start_time } = action.payload;
      const participant = state.participants.find((p) => p.user_id === user_id);
      if (participant) {
        participant.status = status;
        participant.start_time=start_time;
      }
    },

    // metaData management
    setQuizDetails(state, action) {
      const { session_id, quiz_id, title, description, duration,pointsPerCorrect,host_id,question_count } = action.payload;
      state.session_id = session_id;
      state.quiz_id = quiz_id;
        state.title = title;
        state.description = description;
        state.duration = duration;
        state.pointsPerCorrect = pointsPerCorrect;
        state.host_id=host_id;
        state.question_count=question_count;

        state.isInitialState = false;
    },

    // quiz questions management
    setQuestions(state, action) {
      state.questions = action.payload;
    },
    setCurrentQuestionIndex(state, action) {
      state.currentQuestionIndex = action.payload;
    },
    
    setPlayerStatus(state, action) {
      state.playerStatus = action.payload;
    },

    setTimeLeft(state, action) {
      state.timeLeft = action.payload;
    },

    resetQuizSession(state) {
      state.session_id = null;
      state.status = "waiting";
      state.participants = [];
      state.quiz_id = null;
      state.currentQuestionIndex = 0;
      state.questions = [];
      state.timeLeft = 0;
      state.playerStatus = "lobby";
      state.isInitialState = true;

      console.log("Quiz session state has been reset to initial state.");

    },

  },
});
export const {

  setStatus,

  setParticipants,
  addParticipant,
  updateParticipantScore,
  updateParticipantStatus,

  setQuizDetails,

  setQuestions,
  setCurrentQuestionIndex,
   
  setPlayerStatus,
  setTimeLeft,  
  resetQuizSession,
} = quizSessionSlice.actions;
export default quizSessionSlice.reducer;
