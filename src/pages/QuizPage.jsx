import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, CheckCircle, Play, Zap, HelpCircle, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "../components/UI/ui";
import { useQuizSession } from "../features/quiz/useQuizSession";
import { useQuizWebSocket } from "../hooks/useQuizWebSocket";
import { useAuth } from "../features/auth/useAuth";
import { setCurrentQuestionIndex } from "../features/quiz/quizSessionSlice";

import { useDispatch } from "react-redux";

function QuizPage() {
  const { session_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authState } = useAuth();  
  const { id } = authState;

  const {
    quizSession,
    getQuestions,
    submitAnswer,
    markCompleted,
    startQuizForParticipant,
    getQuizDetails,
  } = useQuizSession();

  const {
    status,
    title,
    playerStatus,
    questions,
    currentQuestionIndex,
    participants,
    duration,
    isInitialState,
  } = quizSession;

  useQuizWebSocket(session_id);
  const [timeLeft, setTimeLeft] = useState(
    participants.find((p) => p.user_id === id)?.timeLeft || duration * 60
  );
  const [selectedOption, setSelectedOption] = useState("");
  const [timerStarted, setTimerStarted] = useState(false);

  // Derived values
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] || null;
  const progress = totalQuestions
    ? ((currentQuestionIndex + 1) / totalQuestions) * 100
    : 0;
  const isLast = currentQuestionIndex === totalQuestions - 1;

  useEffect(() => {
    if (!id) {
      return; // Don't fetch until id is available
    }
    
    if (isInitialState) {
      getQuizDetails(session_id, id);
    }
    getQuestions(session_id);
  }, [isInitialState, session_id, id]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStarted, timeLeft]);

  // Handle time up or quiz ended
  useEffect(() => {
    if (!totalQuestions) {
      return;
    }

    if (timeLeft <= 0) {
      console.log("Time's up! Completing quiz...");
      handleQuizComplete();
    }
  }, [timeLeft, timerStarted]);

  // Navigate to leaderboard when quiz ends via WebSocket
  useEffect(() => {
    if (status === "completed") {
      navigate(`/leaderboard/${session_id}`);
    }
  }, [status, session_id]);

  const beginQuiz = async () => {
    // full screen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    await startQuizForParticipant(session_id);
    setTimerStarted(true);
  };

  const handleQuizComplete = async () => {
    console.log("Marking quiz as completed...");
    await markCompleted(session_id);
    navigate(`/leaderboard/${session_id}`);
  };

  const handleNext = async () => {
    if (!selectedOption) return;

    await submitAnswer({
      session_id: session_id,
      question_index: currentQuestionIndex,
      answer: selectedOption,
    });

    setSelectedOption("");

    if (isLast) {
      await handleQuizComplete();
    } else {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Loading state
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <div className="border-2 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] animate-pulse">
          <span className="font-black text-xl uppercase">Loading Question...</span>
        </div>
      </div>
    );
  }

  // Start Quiz screen
  if (currentQuestion && playerStatus === "lobby") {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
        <div className="max-w-lg w-full border-2 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto bg-[#4ADE80] border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
            <Play size={40} strokeWidth={3} className="text-black ml-1" />
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-black uppercase">
              Ready to Start?
            </h1>
            <p className="font-bold text-gray-600">{title || "Quiz"}</p>
          </div>

          {/* Stats */}
          <div className="border-2 border-black bg-gray-50 p-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-bold uppercase text-sm">Total Questions</span>
              <span className="font-black bg-black text-white px-2">
                {totalQuestions}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold uppercase text-sm">Time Limit</span>
              <span className="font-black bg-black text-white px-2">
                {duration} MIN
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="border-2 border-black bg-[#FFD028] p-4 flex items-start gap-3">
            <AlertTriangle size={20} strokeWidth={3} className="shrink-0 mt-0.5" />
            <p className="text-sm font-bold">
              Once you start, the timer will begin counting down. Make sure you're ready!
            </p>
          </div>

          {/* Start Button */}
          <Button
            onClick={beginQuiz}
            className="w-full py-4 bg-[#4ADE80] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none font-black text-xl uppercase flex items-center justify-center gap-2"
          >
            <Zap size={24} strokeWidth={3} />
            Start Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Bar (HUD) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {/* Timer */}
            <div
              className={`px-5 py-3 border-2 border-black flex items-center gap-3 shadow-[4px_4px_0px_0px_#000] ${
                timeLeft <= 60
                  ? "bg-red-500 text-white"
                  : "bg-white"
              }`}
            >
              <Clock size={20} strokeWidth={3} />
              <span className="font-mono text-xl font-black">
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Question Counter */}
            <div className="px-4 py-3 border-2 border-black bg-[#A78BFA] flex items-center gap-2 shadow-[4px_4px_0px_0px_#000]">
              <HelpCircle size={18} strokeWidth={3} />
              <span className="font-black">
                {currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full md:w-1/3 h-4 bg-white border-2 border-black overflow-hidden">
            <div
              className="h-full bg-[#4ADE80] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="border-2 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] space-y-6">
          {currentQuestion ? (
            <>
              {/* Question Text */}
              <div className="space-y-4">
                <div className="inline-block bg-black text-white px-3 py-1 font-black text-sm uppercase">
                  Question {currentQuestionIndex + 1}
                </div>
                <h2 className="text-xl md:text-2xl font-black leading-snug">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="grid gap-3">
                {(currentQuestion.options || []).map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedOption(opt)}
                      className={`w-full text-left p-4 border-2 border-black transition-all flex items-center gap-4 ${
                        isSelected
                          ? "bg-[#4ADE80] shadow-[4px_4px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 border-2 border-black flex items-center justify-center font-black text-lg ${
                          isSelected
                            ? "bg-black text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {isSelected ? <CheckCircle size={20} strokeWidth={3} /> : String.fromCharCode(65 + idx)}
                      </div>
                      <span className="font-bold text-lg">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <div className="pt-6 border-t-2 border-black flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className={`px-8 py-3 border-2 border-black font-black text-lg uppercase flex items-center gap-2 transition-all rounded-none ${
                    !selectedOption
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#FB923C] text-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                  }`}
                >
                  {isLast ? "Finish Quiz" : "Next"}
                  <ChevronRight size={20} strokeWidth={3} />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 font-bold text-gray-500 uppercase">
              No question data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
