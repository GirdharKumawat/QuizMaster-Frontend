import React, { useState } from "react";
import { PlusSquare, Gauge } from "lucide-react";
import Window from "../UI/Window";
import { Input, Button, toast } from "../UI/ui";
import AddQuestion from "./AddQuestion";
import QuestionCard from "./QuestionCard";
import { useQuiz } from "../../features/quiz/useQuiz";
import { useNavigate } from "react-router-dom";

const CreateQuizWindow = ({ onClose }) => {
  const navigate = useNavigate();
  const { createQuiz } = useQuiz();

  // Room Settings State
  const [roomData, setRoomData] = useState({
    title: "",
    description: "",
    topic: "",
    difficulty: "easy",
    max_participants: 5,
    pointsPerCorrect: 4,
    startMode: "immediate",
    scheduledStart: "",
    duration: 20,
  });

  // Questions State
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correct_answer: "",
    explanation: "",
    points: 1,
  });
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // Handlers
  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast.error("Validation Error", "Please enter question text");
      return;
    }
    if (currentQuestion.options.some((o) => !o.trim())) {
      toast.error("Validation Error", "All 4 options are required");
      return;
    }
    if (!currentQuestion.correct_answer) {
      toast.error("Validation Error", "Please select the correct answer");
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

  const handleCreate = async (e) => {
    e?.preventDefault();
    
    if (!roomData.title.trim()) return toast.error("Validation Error", "Please enter a Quiz Title");
    if (!roomData.topic.trim()) return toast.error("Validation Error", "Please enter a Topic");
    if (questions.length === 0) return toast.error("Validation Error", "Please add at least one question");
    if (roomData.startMode === "scheduled" && !roomData.scheduledStart) {
      return toast.error("Validation Error", "Please select a scheduled date/time");
    }

    const payload = {
      title: roomData.title,
      description: roomData.description,
      topic: roomData.topic,
      difficulty: roomData.difficulty,
      max_participants: Number.parseInt(roomData.max_participants) || 5,
      pointsPerCorrect: Number.parseInt(roomData.pointsPerCorrect) || 4,
      duration: Number.parseInt(roomData.duration) * 60,
      start_time: roomData.startMode === "scheduled" ? roomData.scheduledStart : new Date().toISOString(),
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation || "",
      })),
    };

    try {
      const newQuiz = await createQuiz(payload);
      if (newQuiz) {
        navigate(`/waiting/${newQuiz.session_id}`);
      }
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  return (
    <Window title="Create Quiz" icon={PlusSquare} shadowColor="shadow-[#FB923C]" baseColor="bg-[#FFEDD5]" onClose={onClose}>
      <div className="space-y-6 pb-6">
        
        {/* Quiz Settings Section */}
        <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
          <h3 className="font-black text-lg uppercase mb-4 flex items-center gap-2">
            <Gauge size={20} /> Quiz Settings
          </h3>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="font-black text-sm uppercase bg-black text-white px-2 inline-block mb-2">Quiz Title</label>
              <Input
                className="w-full  border-black p-3 font-bold  "
                placeholder="Enter quiz title..."
                value={roomData.title}
                onChange={(e) => setRoomData({ ...roomData, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-black text-sm uppercase mb-2 block">Description</label>
              <textarea
                value={roomData.description}
                onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
                rows="2"
                maxLength={250}
                className="w-full px-4 py-3 border-2 border-black   focus:outline-none focus:shadow-[4px_4px_0px_0px_#FB923C] transition-all resize-none"
                placeholder="Short summary..."
              />
            </div>

            {/* Topic & Difficulty */}
            <div className="md:grid grid-cols-2 gap-4">
              <div>
                <label className="font-black text-sm uppercase mb-2 block">Topic</label>
                <Input
                  className="w-full   border-black p-2 font-bold  "
                  placeholder="e.g. Science"
                  value={roomData.topic}
                  onChange={(e) => setRoomData({ ...roomData, topic: e.target.value })}
                />
              </div>
              <div>
                <label className="font-black text-sm uppercase mb-2 block">Difficulty</label>
                <div className="flex gap-1">
                  {["easy", "medium", "hard"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setRoomData({ ...roomData, difficulty: level })}
                      className={`flex-1 py-2 font-bold uppercase text-xs border-2 border-black transition-all ${
                        roomData.difficulty === level
                          ? "bg-[#FB923C] text-black shadow-[2px_2px_0px_0px_#000]"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Config Grid */}
            <div className="md:grid grid-cols-3 gap-1">
              <div>
                <label className="text-xs font-bold uppercase mb-1 block">Max Players</label>
                <Input
                  type="number" min={2} max={100}
                  className="w-full border-black p-2   text-center font-bold"
                  value={roomData.max_participants}
                  onChange={(e) => setRoomData({ ...roomData, max_participants: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase mb-1 block">Duration (Min)</label>
                <Input
                  type="number" min={1} max={120}
                  className="w-full  border-black p-2   text-center font-bold"
                  value={roomData.duration}
                  onChange={(e) => setRoomData({ ...roomData, duration: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase mb-1 block">Points/Q</label>
                <Input
                  type="number" min={1} max={50}
                  className="w-full  border-black p-2   text-center font-bold"
                  value={roomData.pointsPerCorrect}
                  onChange={(e) => setRoomData({ ...roomData, pointsPerCorrect: e.target.value })}
                />
              </div>
            </div>

            {/* Schedule */}
            <div className="border-2 border-black p-3 bg-orange-50">
              <div className={`flex gap-4 ${roomData.startMode === "immediate" ? "" : "mb-3"}`}>
                <button
                  type="button"
                  onClick={() => setRoomData({ ...roomData, startMode: "immediate" })}
                  className={`text-sm font-bold flex items-center gap-2 ${roomData.startMode === "immediate" ? "text-[#FB923C]" : "text-gray-500"}`}
                >
                  <span className={`w-4 h-4 border-2 border-black flex items-center justify-center ${roomData.startMode === "immediate" ? "bg-[#FB923C]" : "bg-white"}`}>
                    {roomData.startMode === "immediate" && <span className="w-2 h-2 bg-black"></span>}
                  </span>
                  START NOW
                </button>
                <button
                  type="button"
                  onClick={() => setRoomData({ ...roomData, startMode: "scheduled" })}
                  className={`text-sm font-bold flex items-center gap-2 ${roomData.startMode === "scheduled" ? "text-[#FB923C]" : "text-gray-500"}`}
                >
                  <span className={`w-4 h-4 border-2 border-black flex items-center justify-center ${roomData.startMode === "scheduled" ? "bg-[#FB923C]" : "bg-white"}`}>
                    {roomData.startMode === "scheduled" && <span className="w-2 h-2 bg-black"></span>}
                  </span>
                  SCHEDULE
                </button>
              </div>
              {roomData.startMode === "scheduled" && (
                <Input
                  type="datetime-local"
                  className="w-full border-2 border-black p-2   font-bold"
                  value={roomData.scheduledStart}
                  onChange={(e) => setRoomData({ ...roomData, scheduledStart: e.target.value })}
                />
              )}
            </div>
          </div>
        </div>

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

        {/* Create Button */}
        <Button
          onClick={handleCreate}
          className="w-full py-4 bg-[#FB923C] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all   font-black text-xl uppercase"
        >
          Create Quiz 
        </Button>
      </div>
    </Window>
  );
};

export default CreateQuizWindow;
