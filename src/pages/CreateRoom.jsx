import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Users, Timer, Tag, Gauge } from "lucide-react";
import { Button, Input, Card } from "../components/ui";
import { toast } from "sonner";
import AddQuestion from "../components/AddQuestion";
import QuestionCard from "../components/QuestionCard";
import { useQuiz } from "../features/quiz/useQuiz";

const CreateRoomPage = () => {
  const navigate = useNavigate();
  const { createQuiz } = useQuiz();
  
  // Local State for Form
  const [roomData, setRoomData] = useState({
    title: "",
    description: "",
    topic: "",
    difficulty: "easy",
    max_participants: 5,
    pointsPerCorrect: 4,
    startMode: "immediate", // immediate | scheduled
    scheduledStart: "",
    duration: 20, // minutes
  });

  // Local State for Questions
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correct_answer: "",
    explanation: "",
    points: 1,
  });
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // --- HANDLERS ---

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast.error("Please enter question text");
      return;
    }
    if (currentQuestion.options.some((o) => !o.trim())) {
      toast.error("All 4 options are required");
      return;
    }
    if (!currentQuestion.correct_answer) {
      toast.error("Please select the correct answer");
      return;
    }
    setQuestions([...questions, { ...currentQuestion, id: Date.now() }]);
    
    // Reset Form
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

  const handleCreate = async () => {
    // 1. Validation
    if (!roomData.title.trim()) return toast.error("Please enter a Quiz Title");
    if (!roomData.topic.trim()) return toast.error("Please enter a Topic");
    if (questions.length === 0) return toast.error("Please add at least one question");
    if (roomData.startMode === "scheduled" && !roomData.scheduledStart) {
      return toast.error("Please select a scheduled date/time");
    }

    // 2. Payload Construction
    const payload = {
      title: roomData.title,
      description: roomData.description,
      topic: roomData.topic,
      difficulty: roomData.difficulty,
      max_participants: Number.parseInt(roomData.max_participants) || 5,
      pointsPerCorrect: Number.parseInt(roomData.pointsPerCorrect) || 4,
      duration: Number.parseInt(roomData.duration) * 60, // Convert mins to seconds for Backend? 
      // NOTE: Check if backend expects seconds or minutes. 
      // Assuming backend wants MINUTES based on your previous 'duration' field.
      // If backend wants SECONDS, multiply by 60. Let's assume Minutes for now based on UI.
      
      start_time: roomData.startMode === "scheduled"
          ? roomData.scheduledStart
          : new Date().toISOString(),
          
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation || "",
      })),
    };

    // 3. API Call
    try {
        const newQuiz = await createQuiz(payload);
        
        if (newQuiz) {
            const session_id =  newQuiz.session_id;
            navigate(`/waiting/${session_id}`);
        } else {
            // Error handled in useQuiz, but safety check here
            console.error("Invalid response", newQuiz);
        }
    } catch (err) {
        // useQuiz handles toast errors usually
        console.error("Create failed", err);
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="mr-4 text-gray-500 hover:text-purple-600 p-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            <Home size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Create Quiz Room</h1>
        </div>

        <div className="space-y-6">
          
          {/* Settings Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Gauge className="text-purple-600" size={20}/> Quiz Settings
            </h2>
            
            <div className="space-y-6">
              
              {/* Title */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Quiz Title</label>
                <Input
                  icon={Users}
                  value={roomData.title}
                  onChange={(e) => setRoomData({ ...roomData, title: e.target.value })}
                  placeholder="e.g. JavaScript Basics"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Description</label>
                <div className="relative">
                  <textarea
                    value={roomData.description}
                    onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
                    rows="3"
                    maxLength={250}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none"
                    placeholder="Short summary of the quiz..."
                  />
                  <div className="absolute right-3 bottom-2 text-xs text-gray-400">
                    {roomData.description.length}/250
                  </div>
                </div>
              </div>

              {/* Topic & Difficulty */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-gray-700 mb-2 font-medium">Topic</label>
                   <Input
                      icon={Tag}
                      value={roomData.topic}
                      onChange={(e) => setRoomData({ ...roomData, topic: e.target.value })}
                      placeholder="e.g. Science"
                   />
                </div>

                <div>
                   <label className="block text-gray-700 mb-2 font-medium">Difficulty</label>
                   <div className="flex gap-2">
                      {["easy", "medium", "hard"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setRoomData({ ...roomData, difficulty: level })}
                          className={`flex-1 py-2 rounded-lg capitalize border transition-all ${
                            roomData.difficulty === level 
                            ? "bg-purple-600 text-white border-purple-600" 
                            : "bg-white text-gray-600 hover:bg-gray-50 border-gray-300"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                   </div>
                </div>
              </div>

              {/* Config Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Players</label>
                    <Input 
                        type="number" min={2} max={100}
                        value={roomData.max_participants}
                        onChange={(e) => setRoomData({...roomData, max_participants: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Mins)</label>
                    <Input 
                        type="number" min={1} max={120}
                        value={roomData.duration}
                        onChange={(e) => setRoomData({...roomData, duration: e.target.value})}
                        icon={Timer}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Points / Q</label>
                    <Input 
                        type="number" min={1} max={50}
                        value={roomData.pointsPerCorrect}
                        onChange={(e) => setRoomData({...roomData, pointsPerCorrect: e.target.value})}
                    />
                  </div>
              </div>

              {/* Schedule */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                 <div className="flex items-center gap-4 mb-4">
                    <button 
                        type="button"
                        onClick={() => setRoomData({...roomData, startMode: 'immediate'})}
                        className={`text-sm font-medium flex items-center gap-2 ${roomData.startMode === 'immediate' ? 'text-purple-600' : 'text-gray-500'}`}
                    >
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${roomData.startMode === 'immediate' ? 'border-purple-600' : 'border-gray-400'}`}>
                            {roomData.startMode === 'immediate' && <span className="w-2 h-2 rounded-full bg-purple-600"></span>}
                        </span>
                        Start Immediately
                    </button>
                    <button 
                        type="button"
                        onClick={() => setRoomData({...roomData, startMode: 'scheduled'})}
                        className={`text-sm font-medium flex items-center gap-2 ${roomData.startMode === 'scheduled' ? 'text-purple-600' : 'text-gray-500'}`}
                    >
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${roomData.startMode === 'scheduled' ? 'border-purple-600' : 'border-gray-400'}`}>
                            {roomData.startMode === 'scheduled' && <span className="w-2 h-2 rounded-full bg-purple-600"></span>}
                        </span>
                        Schedule for Later
                    </button>
                 </div>
                 
                 {roomData.startMode === 'scheduled' && (
                    <Input 
                        type="datetime-local"
                        value={roomData.scheduledStart}
                        onChange={(e) => setRoomData({...roomData, scheduledStart: e.target.value})}
                    />
                 )}
              </div>

            </div>
          </Card>

          {/* Question Builder */}
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

          {/* Footer Action */}
          <div className="pt-4 pb-12">
            <Button
              onClick={handleCreate}
              className="w-full py-4 text-lg font-bold shadow-xl shadow-purple-200 hover:shadow-purple-300 transition-all"
            >
              Create Quiz Room ({questions.length} Questions)
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateRoomPage;