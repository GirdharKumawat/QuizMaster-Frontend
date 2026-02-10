import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, CheckCircle, Play, Zap, HelpCircle, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "../components/UI/ui";
import { useQuizSession } from "../features/quiz/useQuizSession";
import { useQuizWebSocket } from "../hooks/useQuizWebSocket";
import { useAuth } from "../features/auth/useAuth";
import { setCurrentQuestionIndex } from "../features/quiz/quizSessionSlice";
import {
  getRandomDemoQuestions,
  getDemoTopics,
  getDemoTopicCount,
} from "../data/demoQuestions";

import { useDispatch } from "react-redux";

function QuizPage() {
  const { session_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authState } = useAuth();  
  const { id, role } = authState;
  const isGuest = role === "guest";

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
    session_id: storedSessionId,
  } = quizSession;

  useQuizWebSocket(session_id);
  const [timeLeft, setTimeLeft] = useState(
    participants.find((p) => p.user_id === id)?.timeLeft || duration * 60
  );
  const [selectedOption, setSelectedOption] = useState("");
  const [timerStarted, setTimerStarted] = useState(false);

  const [demoIndex, setDemoIndex] = useState(0);
  const [demoSelected, setDemoSelected] = useState("");
  const [demoScore, setDemoScore] = useState(0);
  const [demoTimeLeft, setDemoTimeLeft] = useState(300);
  const [demoStarted, setDemoStarted] = useState(false);
  const [demoSet, setDemoSet] = useState([]);
  const [demoTopic, setDemoTopic] = useState("All");
  const demoTopics = getDemoTopics();

  // Derived values
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] || null;
  const progress = totalQuestions
    ? ((currentQuestionIndex + 1) / totalQuestions) * 100
    : 0;
  const isLast = currentQuestionIndex === totalQuestions - 1;

  useEffect(() => {
    let isActive = true;

    const loadQuiz = async () => {
      if (isGuest) return;

      if (!id) {
        return; // Don't fetch until id is available
      }

      if (isInitialState || storedSessionId !== session_id) {
        const data = await getQuizDetails(session_id, id);
        if (!data && isActive) {
          navigate("/404", { replace: true });
          return;
        }
      }

      await getQuestions(session_id);
    };

    loadQuiz();

    return () => {
      isActive = false;
    };
  }, [isGuest, isInitialState, storedSessionId, session_id, id, navigate, getQuizDetails, getQuestions]);

  // Timer countdown
  useEffect(() => {
    if (isGuest) return;
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStarted, timeLeft]);

  // Handle time up or quiz ended
  useEffect(() => {
    if (isGuest) return;
    if (!totalQuestions) {
      return;
    }

    if (timeLeft <= 0) {
      handleQuizComplete();
    }
  }, [timeLeft, timerStarted]);

  // Navigate to leaderboard when quiz ends via WebSocket
  useEffect(() => {
    if (isGuest) return;
    if (status === "completed") {
      navigate(`/leaderboard/${session_id}`);
    }
  }, [status, session_id]);

  useEffect(() => {
    if (!isGuest || !demoStarted || demoTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setDemoTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isGuest, demoStarted, demoTimeLeft]);

  useEffect(() => {
    if (!isGuest || !demoStarted) return;

    if (demoTimeLeft <= 0) {
      navigate("/score", {
        state: { score: demoScore, total: demoSet.length },
      });
    }
  }, [isGuest, demoStarted, demoTimeLeft, demoScore, navigate, demoSet.length]);

  const beginQuiz = async () => {
    // full screen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    await startQuizForParticipant(session_id);
    setTimerStarted(true);
  };

  const beginDemo = () => {
    const topicTotal = getDemoTopicCount(demoTopic);
    const total = topicTotal > 0 ? Math.min(5, topicTotal) : 5;
    const nextSet = getRandomDemoQuestions(demoTopic, total);

    if (!nextSet.length) {
      setDemoTopic("All");
      setDemoSet(getRandomDemoQuestions("All", 5));
    } else {
      setDemoSet(nextSet);
    }

    setDemoIndex(0);
    setDemoSelected("");
    setDemoScore(0);
    setDemoTimeLeft(300);
    setDemoStarted(true);
  };

  const handleQuizComplete = async () => {
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

  const handleDemoNext = () => {
    if (!demoSelected) return;

    const current = demoSet[demoIndex];
    const isCorrect = demoSelected === current.answer;
    const nextScore = isCorrect ? demoScore + 1 : demoScore;

    setDemoScore(nextScore);
    setDemoSelected("");

    if (demoIndex >= demoSet.length - 1) {
      navigate("/score", {
        state: { score: nextScore, total: demoSet.length },
      });
      return;
    }

    setDemoIndex((prev) => prev + 1);
  };

  if (isGuest && !demoStarted) {
    const topicCount = getDemoTopicCount(demoTopic);
    const displayCount = topicCount ? Math.min(5, topicCount) : 5;
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
        <div className="max-w-lg w-full border-2 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] space-y-6">
          <div className="w-20 h-20 mx-auto bg-[#4ADE80] border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
            <Play size={40} strokeWidth={3} className="text-black ml-1" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-black uppercase">
              Demo Quiz
            </h1>
            <p className="font-bold text-gray-600">Play as Guest</p>
          </div>

          <div className="border-2 border-black bg-gray-50 p-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-bold uppercase text-sm">Total Questions</span>
              <span className="font-black bg-black text-white px-2">
                {displayCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold uppercase text-sm">Time Limit</span>
              <span className="font-black bg-black text-white px-2">5 MIN</span>
            </div>
          </div>

          <div className="border-2 border-black bg-white p-4">
            <p className="font-black uppercase text-sm mb-3">Choose Topic</p>
            <div className="flex flex-wrap gap-2">
              {demoTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setDemoTopic(topic)}
                  className={`px-3 py-2 border-2 border-black text-sm font-black uppercase transition-all ${
                    demoTopic === topic
                      ? "bg-black text-white shadow-[3px_3px_0px_0px_#000]"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="border-2 border-black bg-[#FFD028] p-4 flex items-start gap-3">
            <AlertTriangle size={20} strokeWidth={3} className="shrink-0 mt-0.5" />
            <p className="text-sm font-bold">
              This is a demo. Sign up to save your results on the leaderboard.
            </p>
          </div>

          <Button
            onClick={beginDemo}
            className="w-full py-4 bg-[#4ADE80] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none font-black text-xl uppercase flex items-center justify-center gap-2"
          >
            <Zap size={24} strokeWidth={3} />
            Start Demo
          </Button>
        </div>
      </div>
    );
  }

  if (isGuest) {
    const currentDemoQuestion = demoSet[demoIndex] || null;
    const demoProgress = demoSet.length
      ? ((demoIndex + 1) / demoSet.length) * 100
      : 0;
    const demoIsLast = demoIndex >= demoSet.length - 1;

    return (
      <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <div
                className={`px-5 py-3 border-2 border-black flex items-center gap-3 shadow-[4px_4px_0px_0px_#000] ${
                  demoTimeLeft <= 60 ? "bg-red-500 text-white" : "bg-white"
                }`}
              >
                <Clock size={20} strokeWidth={3} />
                <span className="font-mono text-xl font-black">
                  {formatTime(demoTimeLeft)}
                </span>
              </div>

              <div className="px-4 py-3 border-2 border-black bg-[#A78BFA] flex items-center gap-2 shadow-[4px_4px_0px_0px_#000]">
                <HelpCircle size={18} strokeWidth={3} />
                <span className="font-black">
                  {demoIndex + 1} / {demoSet.length}
                </span>
              </div>
            </div>

            <div className="w-full md:w-1/3 h-4 bg-white border-2 border-black overflow-hidden">
              <div
                className="h-full bg-[#4ADE80] transition-all duration-500 ease-out"
                style={{ width: `${demoProgress}%` }}
              />
            </div>
          </div>

          <div className="border-2 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] flex flex-col min-h-[500px]">
            {currentDemoQuestion ? (
              <>
                <div className="space-y-4 min-h-[120px]">
                  <div className="inline-block bg-black text-white px-3 py-1 font-black text-sm uppercase">
                    Question {demoIndex + 1}
                  </div>
                  <h2 className="text-xl md:text-2xl font-black leading-snug line-clamp-3">
                    {currentDemoQuestion.question}
                  </h2>
                </div>

                <div className="grid gap-3 flex-1 content-start mt-6">
                  {(currentDemoQuestion.options || []).map((opt, idx) => {
                    const isSelected = demoSelected === opt;
                    return (
                      <button
                        key={idx}
                        onClick={() => setDemoSelected(opt)}
                        className={`w-full text-left p-4 border-2 border-black transition-all flex items-center gap-4 min-h-[64px] ${
                          isSelected
                            ? "bg-[#4ADE80] shadow-[4px_4px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 shrink-0 border-2 border-black flex items-center justify-center font-black text-lg ${
                            isSelected
                              ? "bg-black text-white"
                              : "bg-gray-100"
                          }`}
                        >
                          {isSelected ? (
                            <CheckCircle size={20} strokeWidth={3} />
                          ) : (
                            String.fromCharCode(65 + idx)
                          )}
                        </div>
                        <span className="font-bold text-lg line-clamp-2 break-words">
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-6 mt-auto border-t-2 border-black flex justify-end">
                  <Button
                    onClick={handleDemoNext}
                    disabled={!demoSelected}
                    className={`px-8 py-3 border-2 border-black font-black text-lg uppercase flex items-center gap-2 transition-all rounded-none ${
                      !demoSelected
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#FB923C] text-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                    }`}
                  >
                    {demoIsLast ? "Finish Quiz" : "Next"}
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
        <div className="border-2 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] flex flex-col min-h-[500px]">
          {currentQuestion ? (
            <>
              {/* Question Text */}
              <div className="space-y-4 min-h-[120px]">
                <div className="inline-block bg-black text-white px-3 py-1 font-black text-sm uppercase">
                  Question {currentQuestionIndex + 1}
                </div>
                <h2 className="text-xl md:text-2xl font-black leading-snug line-clamp-3">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="grid gap-3 flex-1 content-start mt-6">
                {(currentQuestion.options || []).map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedOption(opt)}
                      className={`w-full text-left p-4 border-2 border-black transition-all flex items-center gap-4 min-h-[64px] ${
                        isSelected
                          ? "bg-[#4ADE80] shadow-[4px_4px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 shrink-0 border-2 border-black flex items-center justify-center font-black text-lg ${
                          isSelected
                            ? "bg-black text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {isSelected ? <CheckCircle size={20} strokeWidth={3} /> : String.fromCharCode(65 + idx)}
                      </div>
                      <span className="font-bold text-lg line-clamp-2 break-words">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <div className="pt-6 mt-auto border-t-2 border-black flex justify-end">
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
