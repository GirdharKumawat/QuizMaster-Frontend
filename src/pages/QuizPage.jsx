import React, { useState, useEffect } from "react";
import { Clock, Trophy } from "lucide-react";
import { Card, Button } from "../components/ui";
import { useNavigate, useParams } from "react-router-dom";
import { useQuiz } from "../features/quiz/useQuiz";
import { useAuth } from "../features/auth/useAuth";

function QuizPage() {
  const navigate = useNavigate();
  const { quizid } = useParams();
  const { id } = useAuth().authState;
  const { quizState, getCurrentQuestion, submitAnswer,getCretedQuizzes,getEnrolledQuizzes } = useQuiz();

  const createdQuizzes = quizState.createdQuizzes || [];
  const enrolledQuizzes = quizState.enrolledQuizzes || [];

  const quizzes = [...createdQuizzes, ...enrolledQuizzes];

  const currQuiz = quizzes.find((q) => q._id === quizid) || {};

  console.log("Current Quiz Data:", currQuiz);

  const currParticipant =
    currQuiz.participants?.find((p) => p.user_id === id) || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    currParticipant.currentQuestionIndex || 0
  );
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [answer, setAnswer] = useState("");
  // local UI state
  const [timeLeft, setTimeLeft] = useState(currParticipant.timeLeft || 600);
  const [score, setScore] = useState(currParticipant.score || 0);
  const [leaderboard, setLeaderboard] = useState(currQuiz.participants || []);

  const isLast = currentQuestionIndex === currQuiz.questionCount - 1;
  const progress = currQuiz.questionCount
    ? (currentQuestionIndex / currQuiz.questionCount) * 100
    : 0;

    // get quizzes if not already loaded
  useEffect(() => {
    if (!quizzes.length && quizState.canTry) {
      getCretedQuizzes();
      getEnrolledQuizzes();
    }
  }, );



  // get first question on load
  useEffect(() => {
    (async () => {
      try {
        const questionData = await getCurrentQuestion(quizid);

        console.log("Fetched question data:", questionData);
        setCurrentQuestion(questionData);

        /* {
        
      "question": "question 1",
      "options": [ "Option 1", "Option 2", "Option 4", "Option 3"],
   
}*/
      } catch (err) {
        console.error("Failed to fetch question data on load:", err);
      }
    })();
  }, [quizid]);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          handleEnd();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const timeColor =
    timeLeft > 600
      ? "text-green-600"
      : timeLeft > 300
      ? "text-orange-500"
      : "text-red-500";

  const handleNext = () => {
    // submit answer (best-effort) and advance to next question locally
    (async () => {
      try {
        // minimal payload; backend may ignore missing fields
        await submitAnswer(quizid, { answer });
      } catch (err) {
        console.error("submitAnswer failed", err);
      }

      // advance locally
      setAnswer("");
      if (!isLast) {
        setCurrentQuestionIndex((i) => i + 1);
        // reset timer to next question's timeLimit if available
        if (questions[currentQuestionIndex + 1]?.timeLimit) {
          setTimeLeft(questions[currentQuestionIndex + 1].timeLimit);
        }
      } else {
        // finished
        navigate(`/leaderboard/${quizid}`);
      }
    })();
  };

  const handleEnd = async () => {
    // called when timer runs out for a question
    try {
      // attempt to submit current answer (may be empty)
      await submitAnswer(quizid, { answer });
    } catch (err) {
      console.error("submitAnswer on end failed", err);
    }

    // move to next question or finish
    setAnswer("");
    if (isLast) {
      navigate(`/`);
    } else {
      setCurrentQuestionIndex((i) => i + 1);
      if (questions[currentQuestionIndex + 1]?.timeLimit) {
        setTimeLeft(questions[currentQuestionIndex + 1].timeLimit);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/40 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <Card className="px-4 py-2 flex items-center gap-2" variant="outline">
              <Clock size={18} className={timeColor} />
              <span className={`font-mono font-semibold ${timeColor}`}>{formatTime(timeLeft)}</span>
            </Card>
            <Card className="px-4 py-2 flex items-center gap-2" variant="outline">
              <Trophy size={18} className="text-yellow-500" />
              <span className="font-semibold text-gray-800">{score} pts</span>
            </Card>
            <Card className="px-4 py-2 flex items-center gap-2 text-sm text-gray-600" variant="outline">
              Question {currentQuestionIndex + 1} / {currQuiz.questionCount}
            </Card>
          </div>
          <div className="w-full md:w-1/3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 items-start">
          {/* Leaderboard - now on the left */}
          <div className="space-y-6 lg:sticky lg:top-4">
            <Card className="p-5" variant="elevated">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" />
                Live Leaderboard
              </h3>
              <ul className="space-y-2">
                {(leaderboard || []).slice(0, 5).map(p => (
                  <li
                    key={p.position}
                    className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm ${p.name === 'You' ? 'bg-purple-50 border-purple-300' : 'bg-white border-gray-200 hover:border-purple-300'} transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${p.position === 1 ? 'bg-yellow-500' : p.position === 2 ? 'bg-gray-500' : p.position === 3 ? 'bg-orange-500' : 'bg-gray-400'}`}>{p.position}</span>
                      <span className={`font-medium ${p.name === 'You' ? 'text-purple-800' : 'text-gray-800'}`}>{p.name}</span>
                    </div>
                    <span className="font-semibold text-gray-700">{p.score}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Completed</span><span className="font-medium">{currentQuestionIndex}/{currQuiz.questionCount}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Score</span><span className="font-medium text-purple-600">{score}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time Left</span><span className={`font-medium ${timeColor}`}>{formatTime(timeLeft)}</span></div>
              </div>
            </Card>
            <Card className="p-4 text-xs text-gray-600" variant="subtle">
              <p className="mb-1 font-semibold text-gray-700">Tip</p>
              <p>Answer quickly for potential bonus (add logic later). Keep this tab focused to avoid time loss.</p>
            </Card>
          </div>

          {/* Question - now on the right (col-span-2) */}
          <Card className="p-6 md:p-8 space-y-6 lg:col-span-2" interactive>
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs uppercase tracking-wide font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Multiple Choice</span>
              {/* <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">{currentQuestion.points} pt{currentQuestion.points > 1 && 's'}</span> */}
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-snug">{currentQuestion.question}</h2>

            <div className="space-y-5">
              <ul className="space-y-3" role="radiogroup" aria-label="Answer choices">
                {(currentQuestion.options || []).map(opt => {
                  const selected = answer === opt;
                  return (
                    <li key={opt}>
                      <button
                        type="button"
                        onClick={() => setAnswer(opt)}
                        className={`w-full text-left border rounded-xl px-5 py-4 flex items-center gap-3 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 ${selected ? 'border-purple-400 bg-purple-50 shadow-sm' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/40'}`}
                        aria-pressed={selected}
                      >
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${selected ? 'border-purple-500 bg-purple-500 text-white' : 'border-gray-400 text-transparent'}`}>●</span>
                        <span className="font-medium text-gray-800">{opt}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">{answer ? 'Answer selected' : 'Select / enter an answer'}</div>
              <Button
                variant="primary"
                disabled={!answer.trim()}
                onClick={handleNext}
                className="px-7 py-3 text-sm font-semibold"
              >
                {isLast ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );

}

export default QuizPage;
