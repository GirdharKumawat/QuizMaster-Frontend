import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Trophy, CheckCircle, Play } from "lucide-react";
import { Card, Button } from "../components/ui";
import { useQuizSession } from "../features/quiz/useQuizSession";
import { useQuiz } from "../features/quiz/useQuiz"; 

function QuizPage() {
  const { session_id } = useParams();


  const { quizState } = useQuiz();
  const createdQuizzes = quizState.createdQuizzes || [];
  const enrolledQuizzes = quizState.enrolledQuizzes || [];
  
  
  const currentQuiz = [...createdQuizzes, ...enrolledQuizzes].find(q => q.session_id === session_id || q._id === session_id) || {};
  const {
    loading,
    loadGame,
    currentQuestion,
    currentIndex,
    totalQuestions,
    score,
    timeLeft,
    rawTimeLeft,
    timerStarted,
    submitAnswer,
    completeQuiz,
    beginQuiz,
    setInitialParticipants,
  } = useQuizSession(session_id);

  const [selectedOption, setSelectedOption] = useState("");

  
  useEffect(() => {
    loadGame();
    
    
    
    if (currentQuiz.participants && currentQuiz.participants.length > 0) {
        
        const normalized = currentQuiz.participants.map(p => ({
            user_id: p.user_id || p.id,
            name: p.name || p.username || "Unknown",
            score: p.score || 0
        }));
        setInitialParticipants(normalized);
    }
    
  }, []);

  const handleNext = async () => {
    if (!selectedOption) return;

    await submitAnswer(selectedOption);
    setSelectedOption("");

    // If this was the last question, mark quiz as completed
    if (isLast) {
      await completeQuiz();
    }

    loadGame();
  };

  const progress = totalQuestions ? (currentIndex / totalQuestions) * 100 : 0;
  const isLast = currentIndex === totalQuestions - 1;

  if (loading && !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-purple-600 animate-pulse">
          Loading Question...
        </div>
      </div>
    );
  }

  // Show "Start Quiz" screen when quiz is ready but user hasn't started yet
  if (!timerStarted && currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50 p-4">
        <Card className="max-w-lg w-full p-8 text-center space-y-6 shadow-xl border-0">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Play size={36} className="text-white ml-1" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Ready to Start?
            </h1>
            <p className="text-gray-500">
              {currentQuiz.title || "Quiz"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Questions</span>
              <span className="font-semibold text-gray-800">{totalQuestions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Time Limit</span>
              <span className="font-semibold text-gray-800">{timeLeft}</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <p>
              <strong>Note:</strong> Once you start, the timer will begin counting down. Make sure you're ready!
            </p>
          </div>

          <Button
            onClick={beginQuiz}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <Play size={20} className="mr-2" />
            Start Quiz
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Bar (HUD) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <Card className={`px-5 py-3 flex items-center gap-3 ${rawTimeLeft <= 60 ? 'border-red-300 bg-red-50' : 'border-purple-100'}`}>
              <Clock size={20} className={rawTimeLeft <= 60 ? 'text-red-600' : 'text-purple-600'} />
              <span className={`font-mono text-xl font-bold ${rawTimeLeft <= 60 ? 'text-red-700' : 'text-gray-700'}`}>
                {timeLeft}
              </span>
            </Card>

            <Card className="px-4 py-2 flex items-center gap-2 border-yellow-100">
              <Trophy size={18} className="text-yellow-500" />
              <span className="font-bold text-gray-700">{score} pts</span>
            </Card>

            <Card className="px-4 py-2 flex items-center gap-2 border-gray-100 text-sm text-gray-600">
              Question {currentIndex + 1} / {totalQuestions}
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="w-full md:w-1/3 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Area */}
        <Card className="p-6 md:p-8 space-y-8 shadow-md border-0">
            {currentQuestion ? (
              <>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
                      {currentQuestion.question}
                    </h2>
                  </div>
                </div>

                <div className="grid gap-3">
                  {(currentQuestion.options || []).map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedOption(opt)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group ${
                          isSelected
                            ? "border-purple-500 bg-purple-50 shadow-md transform scale-[1.01]"
                            : "border-gray-100 hover:border-purple-200 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? "border-purple-500 bg-purple-500 text-white"
                              : "border-gray-300 group-hover:border-purple-300"
                          }`}
                        >
                          {isSelected && <CheckCircle size={14} />}
                        </div>
                        <span
                          className={`font-medium ${
                            isSelected ? "text-purple-900" : "text-gray-700"
                          }`}
                        >
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <Button
                    onClick={handleNext}
                    disabled={!selectedOption}
                    className={`px-8 py-3 text-lg font-semibold shadow-lg transition-all ${
                      !selectedOption
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:-translate-y-1 shadow-purple-200"
                    }`}
                  >
                    {isLast ? "Finish Quiz" : "Next Question"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <p>No question data available.</p>
              </div>
            )}
          </Card>
      </div>
    </div>
  );
}

export default QuizPage;