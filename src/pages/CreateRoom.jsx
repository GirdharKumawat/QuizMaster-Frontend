import React, { useState } from 'react';
import { Home, Plus, X } from 'lucide-react';

const CreateRoomPage = ({ onNavigate, onStartQuiz }) => {
  const [roomData, setRoomData] = useState({
    name: '',
    password: '',
    duration: 30
  });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'mcq',
    options: ['', ''],
    correctAnswer: '',
    points: 1
  });
  const [participants, setParticipants] = useState([
    { id: 1, name: 'John Doe', status: 'ready' },
    { id: 2, name: 'Jane Smith', status: 'waiting' }
  ]);

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
      danger: 'bg-gradient-to-r from-red-400 to-pink-400 text-white hover:shadow-red-500/25',
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

  const generatePassword = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomData({...roomData, password: code});
  };

  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, '']
    });
  };

  const removeOption = (index) => {
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({...currentQuestion, options: newOptions});
  };

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({...currentQuestion, options: newOptions});
  };

  const addQuestion = () => {
    if (!currentQuestion.text || !currentQuestion.correctAnswer) {
      alert('Please fill in question text and correct answer');
      return;
    }
    
    setQuestions([...questions, { ...currentQuestion, id: Date.now() }]);
    setCurrentQuestion({
      text: '',
      type: 'mcq',
      options: ['', ''],
      correctAnswer: '',
      points: 1
    });
  };

  const removeQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const kickUser = (userId) => {
    setParticipants(participants.filter(p => p.id !== userId));
  };

  const handleSetRoomReady = () => {
    if (questions.length === 0) {
      alert('Please add at least one question before starting the quiz');
      return;
    }
    
    if (!roomData.name || !roomData.password) {
      alert('Please fill in room name and password');
      return;
    }

    // Pass quiz data to parent or navigate to quiz page
    onStartQuiz({ roomData, questions, participants });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => onNavigate('home')}
            className="mr-4 text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-white/20 transition-all"
          >
            <Home size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Create Quiz Room</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Room Settings & Questions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Settings */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Room Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Room Name</label>
                  <input
                    type="text"
                    value={roomData.name}
                    onChange={(e) => setRoomData({...roomData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Enter room name"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Room Password</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={roomData.password}
                      onChange={(e) => setRoomData({...roomData, password: e.target.value})}
                      className="flex-1 px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="Enter password"
                    />
                    <GlassButton variant="secondary" onClick={generatePassword}>
                      Generate
                    </GlassButton>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Duration (minutes)</label>
                  <input
                    type="number"
                    value={roomData.duration}
                    onChange={(e) => setRoomData({...roomData, duration: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    min="5"
                    max="180"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Add Questions */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Questions</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Question Text</label>
                  <textarea
                    value={currentQuestion.text}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                    className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                    rows="3"
                    placeholder="Enter your question"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 mb-2 font-medium">Question Type</label>
                    <select
                      value={currentQuestion.type}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, type: e.target.value, options: e.target.value === 'mcq' ? ['', ''] : []})}
                      className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="mcq">Multiple Choice</option>
                      <option value="short">Short Answer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Points</label>
                    <input
                      type="number"
                      value={currentQuestion.points}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value) || 1})}
                      className="w-20 px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      min="1"
                      max="50"
                    />
                  </div>
                </div>

                {currentQuestion.type === 'mcq' && (
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Options</label>
                    <div className="space-y-2">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            className="flex-1 px-4 py-2 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder={`Option ${index + 1}`}
                          />
                          <button
                            onClick={() => removeOption(index)}
                            className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            disabled={currentQuestion.options.length <= 2}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      {currentQuestion.options.length < 6 && (
                        <GlassButton variant="secondary" onClick={addOption} className="w-full">
                          <Plus size={16} className="mr-2" /> Add Option
                        </GlassButton>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Correct Answer</label>
                  {currentQuestion.type === 'mcq' ? (
                    <select
                      value={currentQuestion.correctAnswer}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
                      className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="">Select correct answer</option>
                      {currentQuestion.options.filter(opt => opt.trim()).map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={currentQuestion.correctAnswer}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
                      className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="Enter correct answer"
                    />
                  )}
                </div>

                <GlassButton onClick={addQuestion} className="w-full">
                  <Plus size={16} className="mr-2" />
                  Add Question
                </GlassButton>
              </div>
            </GlassCard>

            {/* Questions List */}
            {questions.length > 0 && (
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Added Questions ({questions.length})</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {questions.map((q, index) => (
                    <div key={q.id} className="p-4 bg-white/20 rounded-xl">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 mb-1">{index + 1}. {q.text}</p>
                          <p className="text-sm text-gray-600">
                            {q.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'} • {q.points} point{q.points > 1 ? 's' : ''}
                          </p>
                          {q.type === 'mcq' && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 mb-1">Options:</p>
                              <ul className="text-sm text-gray-600 ml-4 list-disc">
                                {q.options.map((option, idx) => (
                                  <li key={idx} className={option === q.correctAnswer ? 'text-green-600 font-medium' : ''}>
                                    {option}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {q.type === 'short' && (
                            <p className="text-sm text-green-600 mt-1">Answer: {q.correctAnswer}</p>
                          )}
                        </div>
                        <button 
                          onClick={() => removeQuestion(q.id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>

          {/* Participants */}
          <div>
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Participants ({participants.length})</h2>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 bg-white/20 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">{participant.name}</p>
                      <p className={`text-sm ${participant.status === 'ready' ? 'text-green-600' : 'text-orange-500'}`}>
                        {participant.status}
                      </p>
                    </div>
                    <button 
                      onClick={() => kickUser(participant.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      title="Kick user"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {participants.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>No participants yet</p>
                  <p className="text-sm">Share the room code to invite players</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/30">
                {roomData.password && (
                  <div className="mb-4 p-3 bg-purple-100/50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Room Code:</p>
                    <p className="font-mono text-lg font-bold text-purple-800">{roomData.password}</p>
                  </div>
                )}
                
                <GlassButton 
                  variant="primary" 
                  className="w-full"
                  onClick={handleSetRoomReady}
                  disabled={questions.length === 0 || !roomData.name || !roomData.password}
                >
                  Start Quiz
                </GlassButton>
                
                <p className="text-xs text-gray-500 text-center mt-2">
                  {questions.length === 0 && "Add questions • "}
                  {!roomData.name && "Set room name • "}
                  {!roomData.password && "Set password • "}
                  {questions.length > 0 && roomData.name && roomData.password && "Ready to start!"}
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomPage;
                    