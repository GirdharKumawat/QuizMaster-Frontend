import { quizApi } from "../../api/quizApi"; // Import APtoastI Layer
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../../components/UI/ui";
import { useGlobalWebSocket } from "../../context/WebSocketContext";

import {
  setStatus,
  setParticipants,
  setQuizDetails,
  setQuestions,
  setCurrentQuestionIndex,
  setPlayerStatus,
  setTimeLeft,
  resetQuizSession
} from "./quizSessionSlice";

export const useQuizSession = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const quizSession = useSelector((state) => state.quizSession);
  const { disconnect } = useGlobalWebSocket();


  const calculateTimeLeft =  (quiz_start_time,durationInMinutes)=> {
     const localStartString = quiz_start_time.replace("Z", "");

    const startTime = new Date(localStartString);
    const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);
    const now = new Date();
    const difference = endTime - now;
    return difference > 0 ? Math.floor(difference / 1000) : 0; // return in seconds
}

  const getQuizDetails = async (session_id,id) => {
    try {
      const res = await quizApi.get(session_id);
      dispatch(
        setQuizDetails({
          session_id: session_id,
          quiz_id: res.data.quiz_id,
          title: res.data.title,
          description: res.data.description,
          duration: res.data.duration,
          host_id: res.data.host_id,
          question_count: res.data.question_count,
        })
      );


      const participants = res.data.participants || [];
      const duration = res.data.duration || 0; // in minutes ex 30

      const updatedParticipants = participants.map((participant) => {
        
        if (participant.quiz_start_time) {
          const timeLeft = calculateTimeLeft(participant.quiz_start_time, duration);
          return { ...participant, timeLeft: timeLeft };
        }

        return { ...participant, timeLeft: duration * 60 }; // full duration in seconds if not started
      });

      // Update participants and status in Redux

      const participant = updatedParticipants.find(p => p.user_id === id);
      
      if (participant) {
        dispatch(setPlayerStatus(participant.status));
        dispatch(setTimeLeft(participant.timeLeft));
      }


      dispatch(setParticipants(updatedParticipants));
      dispatch(setStatus(res.data.status));

      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to get quiz.";
      console.error(err);
      toast.error({ title: "Error", detail: errorMsg });
      return null;
    }
  };

  // 1. Start Quiz Session by host
  const startQuizSession = async (sessionId) => {
    try {
      await toast.promise(
        quizApi.startQuiz(sessionId),
        {
          loading: { title: "Starting Quiz", detail: "Please wait..." },
          success: { title: "Success", detail: "Quiz started successfully!" },
          error: { title: "Failed", detail: "Could not start quiz" }
        }
      );
      dispatch(setStatus("active"));
    } catch (err) {
      console.error("Failed to start quiz session:", err);
    }
  };

  const startQuizForParticipant = async (sessionId) => {
    try {
      await quizApi.startQuizForParticipant(sessionId);
      dispatch(setPlayerStatus("active"));
    } catch (err) {
      console.error("Failed to start quiz for participant:", err);
    }
  };

  const getQuestions = async (sessionId) => {
    try {
      const res = await quizApi.getQuestions(sessionId);
      dispatch(setQuestions(res.data.questions || []));
      dispatch(setCurrentQuestionIndex(res.data.current_question_index || 0));
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch quiz questions.";
      console.error("Failed to fetch quiz paper:", err);
      toast.error({ title: "Error", detail: errorMsg });
    }
  };
  const submitAnswer = async (data) => {
    try {
      const res = await quizApi.submitAnswer(
        data.session_id,
        data.question_index,
        data.answer
      );
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to submit answer.";
      console.error("Failed to submit answer:", err);
      toast.error({ title: "Error", detail: errorMsg });
      return null;
    }
  };

   
  const markCompleted = async (sessionId) => {
    try {
      await quizApi.completeQuiz(sessionId);
      dispatch(setPlayerStatus("completed"));
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to complete quiz.";
      console.error("Failed to mark quiz as completed:", err);
      toast.error({ title: "Error", detail: errorMsg });
    }
  };

  const endQuizSession = async (sessionId) => {
    try {
      await quizApi.endQuiz(sessionId);
    } catch (err) {
      console.error("Failed to end quiz session:", err);
    }
  };

  const getReview = async (sessionId) => {
    try {
      const res = await quizApi.getReview(sessionId);
      return res.data || [];
    } catch (err) {
      console.error("Failed to fetch review:", err);
      toast.error({ title: "Error", detail: "Failed to load review" });
      return [];
    }
  };

  const resetSession = () => {
    disconnect(); // Disconnect WebSocket when resetting session
    dispatch(resetQuizSession());
  }

  return {
    quizSession,
    getQuizDetails,
    startQuizSession,
    startQuizForParticipant,
    getQuestions,
    submitAnswer,
    markCompleted,
    endQuizSession,
    getReview,
    resetSession
  };
};
