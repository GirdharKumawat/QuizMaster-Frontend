import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { quizApi } from '../../api/quizApi';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useTimer } from '../../hooks/useTimer';
import {
  setLoading,
  setParticipants,
  addParticipant,
  updateParticipantScore,
  updateParticipantStatus,
  setQuizData,
  incrementScore,
  setStatus,
  setQuizReady,
  setTimerStarted,
} from './currentQuizSessionSlice';

export const useQuizSession = (session_id) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get userId from auth state
  const { id: userId } = useSelector((state) => state.auth);

  // Get quiz lists to determine isHost
  const { createdQuizzes, enrolledQuizzes } = useSelector((state) => state.quiz);
  const currentQuiz = [...(createdQuizzes || []), ...(enrolledQuizzes || [])].find(
    (q) => q.session_id === session_id
  );
  const isHost = currentQuiz?.host_id === userId;
  const duration = currentQuiz?.duration || 60;

  // Select state from Redux
  const {
    loading,
    participants,
    currentQuestion,
    currentIndex,
    totalQuestions,
    score,
    serverDuration,
    status,
    quizReady,
    timerStarted,
  } = useSelector((state) => state.currentQuizSession);

  // --- SOCKET HANDLERS ---
  const handleWsMessage = useCallback((data) => {
    switch (data.type) {
      case 'participant_joined':
        dispatch(addParticipant({ user_id: data.user_id, name: data.name }));
        // Only show toast if we are in the lobby (not playing yet)
        if (status !== 'active') toast.info(`${data.name} joined!`);
        break;

      case 'quiz_started':
        dispatch(setQuizReady(true));
        if (isHost === false) {
          toast.success("The quiz is now available! Click 'Start Quiz' when you're ready.");
        } else {
          navigate(`/leaderboard/${session_id}`);
        }
        break;

      case 'quiz_ended':
        dispatch(setStatus('ended'));
        toast.warning("The Host has ended the quiz.");
        navigate(`/leaderboard/${session_id}`);
        break;

      case 'leaderboard_update':
        console.log("Leaderboard update received:", data);
        dispatch(updateParticipantScore({
          user_id: data.user_id,
          name: data.name,
          total_score: data.total_score,
        }));
        break;

      case 'participant_completed':
        console.log("Participant completed:", data);
        dispatch(updateParticipantStatus({
          user_id: data.user_id,
          status: 'completed',
        }));
        break;

      default:
        break;
    }
  }, [dispatch, session_id, navigate, isHost, status]);

  // Initialize WebSocket
  useWebSocket(session_id, {
    'participant_joined': handleWsMessage,
    'quiz_started': handleWsMessage,
    'quiz_ended': handleWsMessage,
    'leaderboard_update': handleWsMessage,
    'participant_completed': handleWsMessage,
  });

  // --- TIMER LOGIC ---
  const handleTimeExpire = useCallback(async () => {
    toast.warning("Time's up! Your quiz has been submitted.");
    // Auto-complete the quiz when time expires
    try {
      await quizApi.completeQuiz(session_id);
    } catch (err) {
      console.error("Failed to complete quiz on timeout", err);
    }
    navigate(`/leaderboard/${session_id}`);
  }, [session_id, navigate]);

  const { timeLeft, isRunning, startTimer, formatTime } = useTimer(serverDuration, handleTimeExpire);

  

  const setInitialParticipants = useCallback((list) => {
    dispatch(setParticipants(list || []));
  }, [dispatch]);

  const beginQuiz = useCallback(() => {
    dispatch(setTimerStarted(true));
    dispatch(setStatus('active'));
    // Pass serverDuration directly to ensure timer starts with correct value
    startTimer(serverDuration);
    navigate(`/quiz/${session_id}`);
  }, [dispatch, startTimer, navigate, session_id, serverDuration]);

  const startQuiz = async () => {
    try {
      dispatch(setLoading(true));
      await quizApi.startQuiz(session_id);
      // Navigation handled by 'quiz_started' socket event
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to start quiz");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loadGame = async () => {
    try {
      dispatch(setLoading(true));

      // Check Status (in case of refresh)
      const statusRes = await quizApi.getStatus(session_id);
      const { attempted_indices, current_score } = statusRes.data;

      // Get questions
      const paperRes = await quizApi.getPaper(session_id);
      const { questions} = paperRes.data;

      // Determine start index
      let nextIndex = 0;
      if (attempted_indices?.length > 0) {
        nextIndex = Math.max(...attempted_indices) + 1;
      }

      if (nextIndex >= questions.length) {
        navigate(`/leaderboard/${session_id}`);
      } else {
        dispatch(setQuizData({
          questions,
          duration: duration || 60,
          currentScore: current_score || 0,
          currentIndex: nextIndex,
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load quiz.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 3. STUDENT: Submit Answer
  const submitAnswer = async (selectedOption) => {
    if (!currentQuestion) return;

    try {
      const res = await quizApi.submitAnswer({
        session_id: session_id,
        question_index: currentIndex,
        selected_option: selectedOption,
      });

      if (res.data.points > 0) {
        dispatch(incrementScore(res.data.points));
      }
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  // 4. HOST: End Quiz
  const endQuiz = async () => {
    try {
      await quizApi.endQuiz(session_id);
    } catch (err) {
      toast.error("Failed to end quiz",err);
    }
  };

  // 5. STUDENT: Mark Quiz as Completed
  const completeQuiz = async () => {
    try {
      await quizApi.completeQuiz(session_id);
      toast.success("Quiz completed!");
    } catch (err) {
      console.error("Failed to complete quiz", err);
    }
  };

  // 6. Get Leaderboard
  const getLeaderboard = async () => {
    try {
      dispatch(setLoading(true));
      const res = await quizApi.getLeaderboard(session_id);
      dispatch(setParticipants(res.data.leaderboard || []));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load leaderboard");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    // State
    loading,
    participants,
    currentQuestion,
    currentIndex,
    totalQuestions,
    score,
    timeLeft: formatTime(timeLeft),
    rawTimeLeft: timeLeft,
    isTimerRunning: isRunning,
    quizReady,
    timerStarted,
    isHost,

    // Actions
    startQuiz,
    beginQuiz,
    loadGame,
    submitAnswer,
    endQuiz,
    completeQuiz,
    getLeaderboard,
    setInitialParticipants,
  };
};
