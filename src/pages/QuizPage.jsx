import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Trophy, CheckCircle } from "lucide-react";
import { Card, Button } from "../components/ui";
import { useQuizGame } from "../features/quiz/useQuizGame";
import { useQuiz } from "../features/quiz/useQuiz";

function QuizPage() {
  const { quizid } = useParams();
  const navigate = useNavigate();

  const {
    loading,
    loadGame,
    currentQuestion,
    currentIndex,
    totalQuestions,
    score,
    timeLeft,
    participants,
    submitAnswer,
  } = useQuizGame(quizid);

  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    loadGame();
  }, []);

  const handleNext = async () => {
    if (!selectedOption) return;

    await submitAnswer(selectedOption);
    setSelectedOption("");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Bar (HUD) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <Card className="px-4 py-2 flex items-center gap-2 border-purple-100">
              <Clock size={18} className="text-purple-600" />
              <span className="font-mono font-bold text-gray-700">
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

        <div className="grid gap-6 lg:grid-cols-3 items-start">
          {/* Left Column: Live Leaderboard */}
          <div className="space-y-6 lg:sticky lg:top-4">
            <Card className="p-5 border-purple-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" />
                Live Standings
              </h3>

              <ul className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {participants
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 5)
                  .map((p, index) => (
                    <li
                      key={p.user_id || index}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm border ${
                        false
                          ? "bg-purple-50 border-purple-200"
                          : "bg-white border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            index === 0
                              ? "bg-yellow-400"
                              : index === 1
                              ? "bg-gray-400"
                              : index === 2
                              ? "bg-orange-400"
                              : "bg-purple-300"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-700 truncate max-w-[100px]">
                          {p.name}
                        </span>
                      </div>
                      <span className="font-bold text-gray-800">{p.score}</span>
                    </li>
                  ))}
              </ul>
            </Card>
          </div>

          {/* Right Column: Question Area */}
          <Card className="p-6 md:p-8 space-y-8 lg:col-span-2 shadow-md border-0">
            {currentQuestion ? (
              <>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
                      {currentQuestion.question}
                    </h2>
                  </div>
                  {/* <p className="text-gray-500 text-sm">Select the best answer below:</p> */}
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
    </div>
  );
}

export default QuizPage;
