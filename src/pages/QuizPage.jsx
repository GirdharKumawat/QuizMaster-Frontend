import React, { useState, useEffect } from 'react';
import { Clock, Trophy, Home } from 'lucide-react';

const QuizPage = ({ onNavigate, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(250);
  const [answers, setAnswers] = useState([]);

  // Mock questions data
  const mockQuestions = [
    {
      id: 1,
      text: "What is the capital of France?",
      type: "mcq",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
      points: 10
    },
    {
      id: 2,
      text: "Who wrote 'To Kill a Mockingbird'?",
      type: "short",
      correctAnswer: "Harper Lee",
      points: 15
    },
    {
      id: 3,
      text: "What is the largest planet in our solar system?",
      type: "mcq",
      options: ["Earth", "Jupiter", "Saturn", "Neptune"],
      correctAnswer: "Jupiter",
      points: 10
    },
    {
      id: 4,
      text: "What year did World War II end?",
      type: "short",
      correctAnswer: "1945",
      points: 12
    }
  ];

  const leaderboard = [
    { name: 'You', score: 250, position: 1 },
    { name: 'Alice', score: 240, position: 2 },
    { name: 'Bob', score: 220, position: 3 },
    { name: 'Charlie', score: 200, position: 4 },
    { name: 'David', score: 180, position: 5 }
  ];

  // Glass card component
  const GlassCard = ({ children, className = '', ...props }) => (
    <div 
      className={`bg-white/25 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );

  // Button component
  const GlassButton = ({ children, variant = 'primary', onClick, disabled = false, className = '' }) => {
    const variants = {
      primary: 'bg-gradient-to-r from-purple-500 to-teal-400 text-white shadow-lg hover:shadow-purple-500/25',
      secondary: 'bg-white/40 text-gray-800 hover:bg-white/50',
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${className}`}
      >
        {children}
      </button>
    );
  };

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === mockQuestions.length - 1;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleQuizEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    // Save current answer
    const newAnswer = {
      questionId: currentQuestion.id,
      answer: answer,
      isCorrect: answer === currentQuestion.correctAnswer
    };
    
    setAnswers([...answers, newAnswer]);

    if (isLastQuestion) {
      handleQuizEnd();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer('');
    }
  };

  const handleQuizEnd = () => {
    // Calculate final score and pass to completion page
    const finalAnswers = [...answers];
    if (answer) {
      finalAnswers.push({
        questionId: currentQuestion.id,
        answer: answer,
        isCorrect: answer === currentQuestion.correctAnswer
      });
    }
    
    onQuizComplete({ answers: finalAnswers, score, timeLeft });
  };

  const getTimeColor = () => {
    if (timeLeft > 600) return 'text-green-600'; // > 10 minutes
    if (timeLeft > 300) return 'text-orange-500'; // > 5 minutes
    return 'text-red-500'; // < 5 minutes
  };

  const progress = ((currentQuestionIndex) / mockQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Timer and Score */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <GlassCard className="px-4 py-2">
              <div className={`flex items-center ${getTimeColor()}`}>
                <Clock className="mr-2" size={20} />
                <span className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</span>
              </div>
            </GlassCard>
            <GlassCard className="px-4 py-2">
              <div className="flex items-center text-gray-800">
                <Trophy className="mr-2 text-yellow-500" size={20} />
                <span className="font-semibold">{score} pts</span>
              </div>
            </GlassCard>
          </div>
          <div className="text-gray-600 font-medium">
            Question {currentQuestionIndex + 1} of {mockQuestions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-white/30 rounded-full h-2 backdrop-blur-sm">
            <div 
              className="bg-gradient-to-r from-purple-500 to-teal-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Question Area */}
          <div className="lg:col-span-2">
            <GlassCard className="p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-purple-600 font-medium bg-purple-100/50 px-3 py-1 rounded-full">
                    {currentQuestion.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    {currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {currentQuestion.text}
                </h2>
              </div>

              {/* Answer Section */}
              <div className="space-y-4 mb-8">
                {currentQuestion.type === 'mcq' ? (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <label key={index} className="block cursor-pointer">
                        <div className={`p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                          answer === option 
                            ? 'border-purple-400 bg-purple-50/50 shadow-lg' 
                            : 'border-white/30 bg-white/20 hover:bg-white/30 hover:border-white/50'
                        }`}>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="answer"
                              value={option}
                              checked={answer === option}
                              onChange={(e) => setAnswer(e.target.value)}
                              className="mr-3 text-purple-600 scale-125"
                            />
                            <span className="text-gray-800 font-medium">{option}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full px-6 py-4 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg placeholder-gray-500"
                    />
                    <p className="text-sm text-gray-500 mt-2">Press Enter or click Next to submit your answer</p>
                  </div>
                )}
              </div>

              {/* Next Button */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {answer ? '✓ Answer selected' : 'Select an answer to continue'}
                </div>
                <GlassButton 
                  onClick={handleNext}
                  disabled={!answer.trim()}
                  className="px-8 py-4 text-lg"
                >
                  {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                </GlassButton>
              </div>
            </GlassCard>
          </div>

          {/* Live Leaderboard */}
          <div>
            <GlassCard className="p-6 sticky top-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Trophy className="mr-2 text-yellow-500" size={20} />
                Live Leaderboard
              </h3>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((player, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      player.name === 'You' 
                        ? 'bg-gradient-to-r from-purple-100 to-teal-100 border-2 border-purple-300 shadow-lg transform scale-105' 
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-semibold text-sm ${
                        player.position === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                        player.position === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                        player.position === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 
                        'bg-gradient-to-r from-gray-300 to-gray-400'
                      }`}>
                        {player.position}
                      </div>
                      <span className={`font-medium ${
                        player.name === 'You' ? 'text-purple-800' : 'text-gray-800'
                      }`}>
                        {player.name}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-800">{player.score}</span>
                  </div>
                ))}
              </div>

              {/* Quiz Stats */}
              <div className="mt-6 pt-6 border-t border-white/30">
                <h4 className="font-semibold text-gray-800 mb-3">Your Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium">{currentQuestionIndex}/{mockQuestions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Score:</span>
                    <span className="font-medium text-purple-600">{score}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time Remaining:</span>
                    <span className={`font-medium ${getTimeColor()}`}>{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;