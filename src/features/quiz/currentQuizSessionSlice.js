import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sessionId: null,
  isHost: false,
  loading: false,
  
  // Participants (lobby & leaderboard)
  participants: [],
  
  // Quiz gameplay state
  questions: [],
  currentQuestion: null,
  currentIndex: 0,
  totalQuestions: 0,
  score: 0, 
  
  // Timer
  serverDuration: 0,
  quizReady: false,      // Host has started the quiz (WebSocket signal received)
  timerStarted: false,   // User has started their attempt (timer running)
  
  // Status: 'idle' | 'waiting' | 'active' | 'ended'
  status: 'idle',
};

const currentQuizSessionSlice = createSlice({
  name: "currentQuizSession",
  initialState,
  reducers: {
    // Initialize session
    initSession: (state, action) => {
      const { sessionId, isHost } = action.payload;
      state.sessionId = sessionId;
      state.isHost = isHost;
      state.status = 'waiting';
    },
    
    // Reset all state
    resetSession: () => initialState,
    
    // Loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Participants
    setParticipants: (state, action) => {
      state.participants = action.payload || [];
    },
    
    addParticipant: (state, action) => {
      const { user_id, name, status } = action.payload;
      // Prevent duplicates
      if (!state.participants.some(p => p.user_id === user_id)) {
        state.participants.push({ user_id, name, score: 0, status: status || 'active' });
      }
    },

    updateParticipantStatus: (state, action) => {
      const { user_id, status } = action.payload;
      const participant = state.participants.find(p => p.user_id === user_id);
      if (participant) {
        participant.status = status;
      }
    },
    
    updateParticipantScore: (state, action) => {
      const { user_id, name, total_score } = action.payload;
      const existing = state.participants.find(p => p.user_id === user_id);
      if (existing) {
        existing.score = total_score;
      } else {
        state.participants.push({
          user_id,
          name: name || "Unknown",
          score: total_score || 0,
        });
      }
    },
    
    // Quiz data (loaded from API)
    setQuizData: (state, action) => {
      const { questions, duration, currentScore, currentIndex } = action.payload;
      state.questions = questions;
      state.totalQuestions = questions.length;
      state.serverDuration = duration || 60;
      state.score = currentScore || 0;
      state.currentIndex = currentIndex;
      state.currentQuestion = questions[currentIndex] || null;
      state.status = 'active';
    },
    
    // Score
    incrementScore: (state, action) => {
      state.score += action.payload;
    },
    
    // Move to next question
    nextQuestion: (state) => {
      const nextIdx = state.currentIndex + 1;
      if (nextIdx < state.questions.length) {
        state.currentIndex = nextIdx;
        state.currentQuestion = state.questions[nextIdx];
      }
    },
    
    // Quiz status
    setStatus: (state, action) => {
      state.status = action.payload;
    },

    // Quiz ready (host started, waiting for user to begin)
    setQuizReady: (state, action) => {
      state.quizReady = action.payload;
    },

    // Timer started (user began their attempt)
    setTimerStarted: (state, action) => {
      state.timerStarted = action.payload;
    },
  },
});

export const {
  initSession,
  resetSession,
  setLoading,
  setParticipants,
  addParticipant,
  updateParticipantScore,
  updateParticipantStatus,
  setQuizData,
  incrementScore,
  nextQuestion,
  setStatus,
  setQuizReady,
  setTimerStarted,
} = currentQuizSessionSlice.actions;

export default currentQuizSessionSlice.reducer;
