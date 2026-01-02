import { quizApi } from "../../api/quizApi"; // Import API Layer
import { useDispatch, useSelector } from "react-redux";
import {

  setLoading,
    setLeaderBoard,
  updateLeaderBoard,
  setQuestions,
  setCurrentQuestionIndex,
  setTimeLeft,
  setPlayerStatus,
  setAttemptedQuestions,
  addAttemptedQuestion,
} from "./quizSessionSlice";

export const useQuizSession = () => {
  const dispatch = useDispatch();
  const quizSession = useSelector((state) => state.quizSession);

  // 1. Start Quiz Session by host
  const startQuizSession = async (session_id) => {
    try {
      dispatch(setLoading(true));
      const res = await quizApi.startQuiz(session_id);
    } catch (err) {
      console.error("Failed to start quiz session:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const startQuizForParticipant = async (session_id) => {
    try {
      dispatch(setLoading(true));
      await quizApi.startQuizForParticipant(session_id);
      dispatch(setPlayerStatus("active"));
    } catch (err) {
      console.error("Failed to start quiz for participant:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getPaper = async (session_id) => {
    try {
      dispatch(setLoading(true));
      const res = await quizApi.getPaper(session_id);
      dispatch(setQuestions(res.data.questions || []));
      const duration = res.data.duration || 0;
      const start_time = new Date(res.data.start_time);
      const end_time = new Date(start_time.getTime() + duration * 60000);
      const now = new Date();
      const timeLeft = Math.max(0, Math.floor((end_time - now) / 1000));
      dispatch(setTimeLeft(timeLeft));
    } catch (err) {
      console.error("Failed to fetch quiz paper:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const submitAnswer = async (data) => {
    try {
      dispatch(setLoading(true));
      const res = await quizApi.submitAnswer(data);
      const question_index = data.question_index;
      const answer = data.answer;
      dispatch(addAttemptedQuestion({ question_index, answer }));
      return res.data;
    } catch (err) {
      console.error("Failed to submit answer:", err);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getStatus = async (session_id) => {
    try {
      dispatch(setLoading(true));
      const res = await quizApi.getStatus(session_id);

      const attemptedQuestions = res.data.attempted_questions || [];
      const maxIndex = attemptedQuestions.reduce(
        (max, q) => Math.max(max, q.question_index),
        -1
      );
      dispatch(setCurrentQuestionIndex(maxIndex + 1));

      dispatch(setAttemptedQuestions(res.data.attempted_questions || []));
    } catch (err) {
      console.error("Failed to fetch quiz status:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getLeaderboard = async (session_id) => {
    try {
      dispatch(setLoading(true));
      const res = await quizApi.getLeaderboard(session_id);
        dispatch(setLeaderBoard(res.data || []));
      return res.data;
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const markCompleted = async (session_id) => {
    try {
      dispatch(setLoading(true));
      await quizApi.completeQuiz(session_id);
      dispatch(setPlayerStatus("completed"));
    } catch (err) {
      console.error("Failed to mark quiz as completed:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const endQuizSession = async (session_id) => {
    try {
      dispatch(setLoading(true));
      await quizApi.endQuiz(session_id);
    } catch (err) {
      console.error("Failed to end quiz session:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    quizSession,
    startQuizSession,
    startQuizForParticipant,
    getPaper,
    submitAnswer,
    getStatus,
    getLeaderboard,
    markCompleted,
    endQuizSession,
  };
};
