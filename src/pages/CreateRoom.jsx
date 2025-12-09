import React, { useState } from "react";
import { Home, Users, Timer, BookOpen, Tag, Gauge, Clock } from "lucide-react";
import { Button, Input, Card } from "../components/ui";
import AddQuestion from "../components/AddQuestion";
import QuestionCard from "../components/QuestionCard";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../features/quiz/useQuiz";

const CreateRoomPage = ({ onNavigate, onStartQuiz }) => {
  const navigate = useNavigate();
  const { createQuiz } = useQuiz();
  const [roomData, setRoomData] = useState({
    title: "",
    description: "",
    topic: "",
    difficulty: "easy", // optional; user can clear
    max_participants: 2,
    pointsPerCorrect: 4,
    start_time : "", // for scheduled
    duration: 20,
  });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
  question: "",
  options: ["", "", "", ""], // fixed 4 options per requirement
  correct_answer: "",
    explanation: "",
    points: 1,
  });
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // No password / join code: room accessible by link only

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = () => {

    console.log(currentQuestion)
  if (!currentQuestion.question.trim()) {
      alert("Please enter question text");
      return;
    }
    if (currentQuestion.options.some((o) => !o.trim())) {
      alert("All 4 options are required");
      return;
    }
    if (!currentQuestion.correct_answer) {
      alert("Please select the correct answer");
      return;
    }
    setQuestions([...questions, { ...currentQuestion, id: Date.now() }]);
    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correct_answer: "",
      explanation: "",
      points: 1,
    });
  };
  const removeQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

 
  const handleSetRoomReady = () => {
    // navigate("/waiting");
    console.log("Creating room with data:", { roomData, questions });
    // build payload matching backend contract
    const payload = {
      title: roomData.title,
      description: roomData.description,
      topic: roomData.topic,
      difficulty: roomData.difficulty || roomData.difficulty === '' ? roomData.difficulty : roomData.difficulty,
      max_participants: parseInt(roomData.max_participants) || 5,
      pointsPerCorrect: parseInt(roomData.pointsPerCorrect) || 4,
      duration: parseInt(roomData.duration) || 60,
      start_time:
        roomData.startMode === "scheduled"
          ? roomData.scheduledStart
          : roomData.start_time || new Date().toISOString(),
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation || "",
      })),
    };

    // use async flow and navigate after creation
    createQuiz(payload)
      .then((data) => {
        const id = data?.quiz_id || data?._id || data?.id;
        if (id) {
          navigate(`/waiting/${id}`);
        } else {
          console.error("createQuiz returned unexpected response:", data);
          alert("Quiz created but response missing id. Check console for details.");
        }
      })
      .catch((err) => {
        console.error("Failed to create quiz:", err);
        alert("Failed to create quiz. See console for details.");
      });

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
                    Quiz Title
                  </label>
                  <Input
                    icon={Users}
                    type="text"
                    value={roomData.title}
                    onChange={(e) =>
                      setRoomData({ ...roomData, title: e.target.value })
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
                    value={roomData.topic}
                    onChange={(e) =>
                      setRoomData({ ...roomData, topic: e.target.value })
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
                        value={roomData.max_participants}
                        onChange={(e) =>
                          setRoomData({
                            ...roomData,
                            max_participants: e.target.value,
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
                        value={roomData.duration}
                        onChange={(e) =>
                          setRoomData({
                            ...roomData,
                            duration: parseInt(e.target.value) || 20,
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

                

              </div>
            </Card>

            {/* Question Entry / AI Generation */}
             
              <AddQuestion
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                updateOption={updateOption}
                addQuestion={addQuestion}
              />
                        
            

            {/* Questions List */}
            <QuestionCard
              questions={questions}
              expandedQuestions={expandedQuestions}
              setExpandedQuestions={setExpandedQuestions}
              removeQuestion={removeQuestion}
            />
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
