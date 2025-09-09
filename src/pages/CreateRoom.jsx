import React, { useState } from "react";
import {
  Home,
  Plus,
  X,
  Hash,
  Users,
  Timer,
  Award,
  BookOpen,
  Tag,
  Gauge,
  Bot,
  User,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock
} from "lucide-react";
import { Button, Input, Card } from "../components/ui";
import { useNavigate } from "react-router-dom";

const CreateRoomPage = ({ onNavigate, onStartQuiz }) => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    name: "",
    description: "",
    category: "",
    difficulty: "easy", // optional; user can clear
    source: "admin",
    duration: 30,
    maxPlayers: 2,
    timePerQuestion: 20,
    pointsPerCorrect: 4,
    startMode: "immediate",
    scheduledStart: "",
  });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    options: ["", "", "", ""], // fixed 4 options per requirement
    correctAnswer: "",
    explanation: "",
    points: 1,
  });
  const [aiConfig, setAiConfig] = useState({ count: 10, generating: false });
  const [participants, setParticipants] = useState([
    { id: 1, name: "John Doe", status: "ready" },
    { id: 2, name: "Jane Smith", status: "waiting" },
  ]);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // No password / join code: room accessible by link only

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      alert("Please enter question text");
      return;
    }
    if (currentQuestion.options.some((o) => !o.trim())) {
      alert("All 4 options are required");
      return;
    }
    if (!currentQuestion.correctAnswer) {
      alert("Please select the correct answer");
      return;
    }
    setQuestions([...questions, { ...currentQuestion, id: Date.now() }]);
    setCurrentQuestion({
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
      points: 1,
    });
  };

  const handleGenerateAIQuestions = () => {
    if (aiConfig.count < 1 || aiConfig.count > 50) {
      alert("Choose between 1 and 50 questions");
      return;
    }
    setAiConfig((prev) => ({ ...prev, generating: true }));
    const generated = Array.from({ length: aiConfig.count }).map((_, idx) => ({
      id: Date.now() + idx,
      text: `Generated Question ${idx + 1}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
      explanation: "AI generated sample explanation.",
      points: 1,
    }));
    setTimeout(() => {
      setQuestions(generated);
      setAiConfig((prev) => ({ ...prev, generating: false }));
    }, 400);
  };

  const removeQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

 
  const handleSetRoomReady = () => {
    navigate("/waiting");
    if (questions.length === 0) {
      alert("Please add at least one question before starting the quiz");
      return;
    }

    if (!roomData.name) {
      alert("Please enter a quiz name");
      return;
    }

    // Pass quiz data to parent or navigate to quiz page
    // onStartQuiz({ roomData, questions, participants });
  // Navigate to waiting room after successful creation
  navigate("/waiting");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="mr-4 text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-white/20 transition-all"
          >
            <Home size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Create Quiz Room</h1>
        </div>

        <div className="">
          {/* Room Settings & Questions */}
          <div className=" space-y-6">
            {/* Room Settings */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Quiz Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Quiz Name
                  </label>
                  <Input
                    icon={Users}
                    type="text"
                    value={roomData.name}
                    onChange={(e) =>
                      setRoomData({ ...roomData, name: e.target.value })
                    }
                    placeholder="Enter Quiz name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Description{" "}
                    <span className="text-xs text-gray-500 font-normal">
                      (Short summary)
                    </span>
                  </label>
                  <div className="relative">
                    <div className="z-50 absolute left-4 top-4 text-gray-600">
                      <BookOpen size={20} />
                    </div>
                    <textarea
                      value={roomData.description}
                      onChange={(e) =>
                        setRoomData({
                          ...roomData,
                          description: e.target.value,
                        })
                      }
                      rows="3"
                      maxLength={250}
                      placeholder="e.g., Fast-paced challenge on fractions & basic algebra concepts"
                      className="w-full pl-12 pr-4 py-3 bg-white/30 backdrop-blur-sm border border-gray-400 rounded-xl text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                    />
                    <div className="absolute right-4 bottom-2 text-xs text-gray-500">
                      {roomData.description.length}/250
                    </div>
                  </div>
                </div>

                {/* Category / Topic */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Topic / Category
                  </label>
                  <Input
                    icon={Tag}
                    type="text"
                    value={roomData.category}
                    onChange={(e) =>
                      setRoomData({ ...roomData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm   rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="e.g., Math, Science, General Knowledge"
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-gray-700 mb-2 font-medium flex items-center gap-2">
                    Difficulty{" "}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["easy", "medium", "hard"].map((level) => {
                      const active = roomData.difficulty === level;
                      return (
                        <button
                          type="button"
                          key={level}
                          onClick={() =>
                            setRoomData({
                              ...roomData,
                              difficulty: active ? "" : level,
                            })
                          }
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${
                            active
                              ? "bg-purple-600 text-white border-purple-600 shadow-sm scale-[1.02]"
                              : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                          } `}
                        >
                          <Gauge size={16} />
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Max Players & Time Per Question */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Max Players 
                    </label>
                    <div className="flex gap-2">
                      <Input
                        icon={Users}
                        type="number"
                        min={5}
                        max={300}
                        value={roomData.maxPlayers}
                        onChange={(e) =>
                          setRoomData({
                            ...roomData,
                            maxPlayers: e.target.value,
                          })
                        }
                        className="w-full pl-9 pr-3 py-2 bg-white/30 backdrop-blur-sm border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                     Total Time (minutes)
                    </label>
                    <div className="relative">
                      <Clock
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                      <Input
                        icon={Timer}
                        type="number"
                        min={5}
                        max={300}
                        value={roomData.timePerQuestion}
                        onChange={(e) =>
                          setRoomData({
                            ...roomData,
                            timePerQuestion: parseInt(e.target.value) || 20,
                          })
                        }
                        className="w-full pl-9 pr-3 py-2 bg-white/30 backdrop-blur-sm border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Scoring */}
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Points / Correct</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={roomData.pointsPerCorrect}
                      onChange={(e) => setRoomData({ ...roomData, pointsPerCorrect: parseInt(e.target.value) || 10 })}
                      className="w-full px-3 py-2 bg-white/60 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    
                </div>

                {/* Start Time / Schedule */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Start Time
                    </label>
                    <div className="flex gap-2">
                      {["immediate", "scheduled"].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() =>
                            setRoomData({ ...roomData, startMode: mode })
                          }
                          className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                            roomData.startMode === mode
                              ? "bg-purple-600 text-white border-purple-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {mode === "immediate" ? "Immediate" : "Schedule"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {roomData.startMode === "scheduled" && (
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">
                        Scheduled Date/Time
                      </label>
                      <input
                        type="datetime-local"
                        value={roomData.scheduledStart}
                        onChange={(e) =>
                          setRoomData({
                            ...roomData,
                            scheduledStart: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/30 backdrop-blur-sm border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  )}
                </div>

                {/* Visibility & Join Code removed: room accessible via link */}

                {/* Source */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Question Source
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label
                      className={`flex-1 cursor-pointer rounded-2xl border p-4 transition-all ${
                        roomData.source === "admin"
                          ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                          : "bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-xl ${
                            roomData.source === "admin"
                              ? "bg-white/20"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <User size={18} />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              roomData.source === "admin"
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                          >
                            Manual (Admin)
                          </p>
                          <p
                            className={`text-xs mt-0.5 ${
                              roomData.source === "admin"
                                ? "text-white/80"
                                : "text-gray-600"
                            }`}
                          >
                            You will enter each question
                          </p>
                        </div>
                        <input
                          type="radio"
                          name="source"
                          value="admin"
                          checked={roomData.source === "admin"}
                          onChange={() =>
                            setRoomData({ ...roomData, source: "admin" })
                          }
                          className="hidden"
                        />
                      </div>
                    </label>
                    <label
                      className={`flex-1 cursor-pointer rounded-2xl border p-4 transition-all ${
                        roomData.source === "ai"
                          ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                          : "bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-xl ${
                            roomData.source === "ai"
                              ? "bg-white/20"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <Bot size={18} />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              roomData.source === "ai"
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                          >
                            AI Generated
                          </p>
                          <p
                            className={`text-xs mt-0.5 ${
                              roomData.source === "ai"
                                ? "text-white/80"
                                : "text-gray-600"
                            }`}
                          >
                            AI assists generating questions
                          </p>
                        </div>
                        <input
                          type="radio"
                          name="source"
                          value="ai"
                          checked={roomData.source === "ai"}
                          onChange={() =>
                            setRoomData({ ...roomData, source: "ai" })
                          }
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* Question Entry / AI Generation */}
            {roomData.source === "admin" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Add Questions (Manual)
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Question Text
                    </label>
                    <textarea
                      value={currentQuestion.text}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          text: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm border border-gray-400 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                      rows="3"
                      placeholder="Enter your question"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Options (4 required)
                    </label>
                    <div className="space-y-2">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            icon={Hash}
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOption(index, e.target.value)
                            }
                            className="flex-1 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder={`Option ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Correct Answer
                    </label>
                    <select
                      value={currentQuestion.correctAnswer}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          correctAnswer: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm border border-gray-400 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="">Select correct answer</option>
                      {currentQuestion.options
                        .filter((opt) => opt.trim())
                        .map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Explanation{" "}
                      <span className="text-xs text-gray-500">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute z-50 left-3 top-3 text-gray-500">
                        <FileText size={18} />
                      </div>
                      <textarea
                        value={currentQuestion.explanation}
                        onChange={(e) =>
                          setCurrentQuestion({
                            ...currentQuestion,
                            explanation: e.target.value,
                          })
                        }
                        rows="2"
                        placeholder="Why is this answer correct?"
                        className="w-full pl-10 pr-4 py-2 bg-white/30 backdrop-blur-sm border border-gray-400 rounded-xl text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={addQuestion}
                    className=" cursor-pointer flex items-center justify-center w-full"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Question
                  </Button>
                </div>
              </Card>
            )}
            {roomData.source === "ai" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  AI Question Generation
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Number of Questions
                    </label>
                    <Input
                      type="number"
                      icon={Hash}
                      min={1}
                      max={50}
                      value={aiConfig.count}
                      onChange={(e) =>
                        setAiConfig({
                          ...aiConfig,
                          count: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-32 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <Button
                    onClick={handleGenerateAIQuestions}
                    disabled={aiConfig.generating}
                    className="flex items-center justify-center w-full"
                  >
                    {aiConfig.generating
                      ? "Generating..."
                      : "Generate Questions"}
                  </Button>
                  <p className="text-xs text-gray-500">
                    Placeholder AI generation creates sample questions.
                    Integrate real AI API later.
                  </p>
                </div>
              </Card>
            )}

            {/* Questions List */}
            {questions.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Added Questions{" "}
                    <span className="text-sm font-normal text-gray-500">
                      ({questions.length})
                    </span>
                  </h3>
                  <div className="text-xs text-gray-500">
                    Click a question to expand details
                  </div>
                </div>
                <div className="space-y-4">
                  {questions.map((q, index) => {
                    const isExpanded = expandedQuestions[q.id];
                    return (
                      <div
                        key={q.id}
                        className={`group border rounded-xl relative overflow-hidden transition-all ${
                          isExpanded
                            ? "bg-white shadow-md border-purple-200"
                            : "bg-white/40 hover:bg-white/60 border-gray-200"
                        } `}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedQuestions((prev) => ({
                              ...prev,
                              [q.id]: !isExpanded,
                            }))
                          }
                          className="w-full text-left p-4 flex items-start gap-4"
                        >
                          <div className="flex flex-col items-center pt-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                              {index + 1}
                            </div>
                            <span className="mt-2 text-[10px] uppercase tracking-wide text-gray-500 font-medium">
                              MCQ
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start gap-2">
                              <p className="font-medium text-gray-800 leading-snug flex-1">
                                {q.text}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full bg-purple-100 text-purple-700">
                                {q.points} pt{q.points > 1 && "s"}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full bg-gray-100 text-gray-600">
                                4 options
                              </span>
                              {q.explanation && (
                                <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full bg-indigo-100 text-indigo-600">
                                  Explanation
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-1 text-gray-500">
                            {isExpanded ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </div>
                        </button>
                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="px-5 pb-5 -mt-2">
                            <div className="grid sm:grid-cols-2 gap-3 mt-2">
                              {q.options.map((option, idx) => {
                                const correct = option === q.correctAnswer;
                                return (
                                  <div
                                    key={idx}
                                    className={`relative rounded-lg border px-3 py-2 text-sm flex items-start gap-2 transition-all ${
                                      correct
                                        ? "border-green-500 bg-green-50"
                                        : "border-gray-200 bg-white"
                                    } `}
                                  >
                                    {correct && (
                                      <CheckCircle2
                                        size={16}
                                        className="text-green-600 shrink-0 mt-0.5"
                                      />
                                    )}
                                    <span
                                      className={`leading-snug ${
                                        correct
                                          ? "font-medium text-green-700"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {option}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            {q.explanation && (
                              <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-lg text-sm text-purple-800">
                                <span className="font-medium">
                                  Explanation:
                                </span>{" "}
                                {q.explanation}
                              </div>
                            )}
                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={() => removeQuestion(q.id)}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Participants */}
          {/* Create & Navigate Button */}
          <div className="mt-8 mb-12">
            <Button

              onClick={handleSetRoomReady}
              className="w-full py-3 text-lg font-semibold cursor-pointer "
            >
              Create & Go To Waiting Room
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomPage;
