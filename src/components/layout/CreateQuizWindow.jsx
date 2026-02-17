import { useState } from "react";
import { PlusSquare, Gauge, Sparkles } from "lucide-react";
import Window from "../UI/Window";
import { Input, Button, toast } from "../UI/ui";
import AddQuestion from "./AddQuestion";
import QuestionCard from "./QuestionCard";
import { useQuiz } from "../../features/quiz/useQuiz";
import { useNavigate } from "react-router-dom";
import { quizApi } from "../../api/quizApi";

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
    pointsPerCorrect: 1,
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
  const [step, setStep] = useState("settings"); // "settings" | "mode-choice" | "questions"
  const [createMode, setCreateMode] = useState("");

  // AI Question Generator State
  const [aiForm, setAiForm] = useState({
    count: 5,
    focus: "",
  });
  const [aiGenerated, setAiGenerated] = useState([]);
  const [aiSelected, setAiSelected] = useState({});
  const [aiLoading, setAiLoading] = useState(false);

  const proceedToModeChoice = () => {
    if (!roomData.title.trim()) return toast.error("Please enter a Quiz Title");
    if (!roomData.topic.trim()) return toast.error("Please enter a Topic");
    setStep("mode-choice");
  };

  const startManual = () => {
    setCreateMode("manual");
    setStep("questions");
  };

  const startAi = () => {
    setCreateMode("ai");
    setStep("questions");
  };

  const backToSettings = () => {
    setStep("settings");
    setCreateMode("");
  };

  const backToModeChoice = () => {
    setStep("mode-choice");
    setCreateMode("");
  };

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

  const handleGenerateAi = async () => {
    if (!Number.parseInt(aiForm.count, 10)) return toast.error("Validation Error", "Please enter number of questions");

    setAiLoading(true);
    try {
      const pointsByDifficulty = { easy: 1, medium: 2, hard: 3 };
      const res = await quizApi.generateQuestionsAI({
        topic: roomData.topic,
        difficulty: roomData.difficulty,
        count: aiForm.count,
        ...(aiForm.focus.trim() && { focus: aiForm.focus.trim() }),
      });

      const generated = (res.generated_questions || []).map((q, index) => ({
        id: `ai-${Date.now()}-${index}`,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation || "",
        points: pointsByDifficulty[roomData.difficulty] || 1,
      }));

      setAiGenerated(generated);
      setAiSelected({});
    } catch (err) {
      console.error("AI generation failed", err);
      toast.error("AI Error", "Failed to generate questions");
    } finally {
      setAiLoading(false);
    }
  };

  const isAllAiSelected = aiGenerated.length > 0 && aiGenerated.every((q) => aiSelected[q.id]);

  const toggleSelectAllAi = () => {
    if (!aiGenerated.length) return;
    if (isAllAiSelected) {
      setAiSelected({});
      return;
    }
    const next = {};
    aiGenerated.forEach((q) => {
      next[q.id] = true;
    });
    setAiSelected(next);
  };

  const toggleAiQuestion = (id) => {
    setAiSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addSelectedAiQuestions = () => {
    const selected = aiGenerated.filter((q) => aiSelected[q.id]);
    if (!selected.length) return toast.error("Select Questions", "Please select at least one question");

    const prepared = selected.map((q, index) => ({
      ...q,
      id: `ai-added-${Date.now()}-${index}`,
    }));
    setQuestions((prev) => [...prev, ...prepared]);
    setAiGenerated((prev) => prev.filter((q) => !aiSelected[q.id]));
    setAiSelected({});
  };

  const handleCreate = async (e) => {
    e?.preventDefault();

    if (step !== "questions") return toast.error("Validation Error", "Please complete all steps");
    if (!createMode) return toast.error("Validation Error", "Please choose Manual or AI mode");
    if (!roomData.title.trim()) return toast.error("Validation Error", "Please enter a Quiz Title");
    if (!roomData.description.trim()) return toast.error("Validation Error", "Please enter a Description");
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
      duration: Number.parseInt(roomData.duration),
      start_time: roomData.startMode === "scheduled" ? roomData.scheduledStart : new Date().toISOString(),
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation || "",
        points: Number.parseInt(q.points, 10) || 1,
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
        
        {/* Step 1: Quiz Settings (Common for both Manual and AI) */}
        {step === "settings" && (
          <div className="border-[1.5px] border-gray-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
            <h3 className="font-bold text-lg uppercase mb-4 flex items-center gap-2">
              <Gauge size={18} /> Quiz Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="font-bold text-sm uppercase bg-black text-white px-2 inline-block mb-2">Quiz Title <span className="text-red-400">*</span></label>
                <Input
                  className="w-full border-black p-3 font-bold"
                  placeholder="Enter quiz title..."
                  value={roomData.title}
                  onChange={(e) => setRoomData({ ...roomData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-sm uppercase mb-2 block">Description<span className="text-red-400">*</span></label>
                <textarea
                  value={roomData.description}
                  onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
                  rows="2"
                  maxLength={250}
                  className="w-full px-4 py-3 border-[1.5px] border-gray-900 focus:outline-none focus:shadow-[3px_3px_0px_0px_#FB923C] transition-all resize-none"
                  placeholder="Short summary..."
                />
              </div>

              <div className="md:grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-sm uppercase mb-1 block">Topic <span className="text-red-500">*</span></label>
                  <Input
                    className="w-full border-black font-bold"
                    placeholder="e.g. Science"
                    value={roomData.topic}
                    onChange={(e) => setRoomData({ ...roomData, topic: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-bold text-sm uppercase mb-2 block">Difficulty</label>
                  <div className="flex gap-1">
                    {["easy", "medium", "hard"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setRoomData({ ...roomData, difficulty: level })}
                        className={`flex-1 py-2 font-semibold uppercase text-xs border-[1.5px] border-gray-900 transition-all ${
                          roomData.difficulty === level
                            ? "bg-[#FB923C] text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,0.5)]"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:grid grid-cols-3 gap-1">
                <div>
                  <label className="text-xs font-semibold uppercase mb-1 block">Max Participants</label>
                  <Input
                    type="number"
                    min={2}
                    max={100}
                    className="w-full border-black p-2 text-center font-bold"
                    value={roomData.max_participants}
                    onChange={(e) => setRoomData({ ...roomData, max_participants: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase mb-1 block">Duration (Min)</label>
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    className="w-full border-black p-2 text-center font-bold"
                    value={roomData.duration}
                    onChange={(e) => setRoomData({ ...roomData, duration: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase mb-1 block">Points/Q</label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    className="w-full border-black p-2 text-center font-bold"
                    value={roomData.pointsPerCorrect}
                    onChange={(e) => setRoomData({ ...roomData, pointsPerCorrect: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-[1.5px] border-gray-900 p-3 bg-orange-50">
                <div className={`flex gap-4 ${roomData.startMode === "immediate" ? "" : "mb-3"}`}>
                  <button
                    type="button"
                    onClick={() => setRoomData({ ...roomData, startMode: "immediate" })}
                    className={`text-sm font-semibold flex items-center gap-2 ${roomData.startMode === "immediate" ? "text-[#FB923C]" : "text-gray-500"}`}
                  >
                    <span className={`w-4 h-4 border-[1.5px] border-gray-900 flex items-center justify-center ${roomData.startMode === "immediate" ? "bg-[#FB923C]" : "bg-white"}`}>
                      {roomData.startMode === "immediate" && <span className="w-2 h-2 bg-black"></span>}
                    </span>
                    START NOW
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoomData({ ...roomData, startMode: "scheduled" })}
                    className={`text-sm font-semibold flex items-center gap-2 ${roomData.startMode === "scheduled" ? "text-[#FB923C]" : "text-gray-500"}`}
                  >
                    <span className={`w-4 h-4 border-[1.5px] border-gray-900 flex items-center justify-center ${roomData.startMode === "scheduled" ? "bg-[#FB923C]" : "bg-white"}`}>
                      {roomData.startMode === "scheduled" && <span className="w-2 h-2 bg-black"></span>}
                    </span>
                    SCHEDULE
                  </button>
                </div>
                {roomData.startMode === "scheduled" && (
                  <Input
                    type="datetime-local"
                    className="w-full border-[1.5px] border-gray-900 p-2 font-semibold"
                    value={roomData.scheduledStart}
                    onChange={(e) => setRoomData({ ...roomData, scheduledStart: e.target.value })}
                  />
                )}
              </div>

              <Button
                type="button"
                onClick={proceedToModeChoice}
                className="w-full py-3.5 bg-[#FB923C] text-black border-[1.5px] border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold text-base uppercase"
              >
                Next: Choose Question Mode
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Mode Selection */}
        {step === "mode-choice" && (
          <div className="border-[1.5px] border-gray-900 bg-white p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
            <h3 className="font-bold text-xl uppercase mb-3">How do you want to add questions?</h3>
            <p className="text-sm font-medium text-gray-600 mb-4">
              Choose a method to create questions for your quiz.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <button
                type="button"
                onClick={startManual}
                className="group border-[1.5px] border-gray-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all text-left cursor-pointer"
              >
                <div className="w-10 h-10 bg-[#FB923C] border-[1.5px] border-gray-900 flex items-center justify-center mb-3">
                  <PlusSquare size={20} className="text-white" />
                </div>
                <div className="font-bold text-base uppercase">Write Manually</div>
                <p className="text-xs text-gray-500 mt-1">Craft each question yourself with full control over content</p>
                <span className="inline-block mt-3 text-xs font-bold uppercase text-[#FB923C] group-hover:underline">Get Started →</span>
              </button>
              <button
                type="button"
                onClick={startAi}
                className="group border-[1.5px] border-gray-900 bg-[#FB923C] p-5 shadow-[3px_3px_0px_0px_#FB923C] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all text-left cursor-pointer"
              >
                <div className="w-10 h-10 bg-black border-[1.5px] border-gray-900 flex items-center justify-center mb-3">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div className="font-bold text-base uppercase text-white">Generate with AI</div>
                <p className="text-xs text-white mt-1">Auto-generate questions from your topic using AI</p>
                <span className="inline-block mt-3 text-xs font-bold uppercase text-[#FB923C] group-hover:underline">Generate →</span>
              </button>
            </div>
            <button
              type="button"
              onClick={backToSettings}
              className="text-xs font-semibold uppercase border-[1.5px] border-gray-900 px-3 py-1 bg-white hover:bg-gray-100"
            >
              ← Back to Settings
            </button>
          </div>
        )}

        {/* Step 3: Questions Section */}
        {step === "questions" && (
          <>
            <div className="border-[1.5px] border-gray-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg uppercase flex items-center gap-2">
                  <Gauge size={18} /> Quiz Settings
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={backToModeChoice}
                    className="text-xs font-semibold uppercase border-[1.5px] border-gray-900 px-3 py-1 bg-white hover:bg-gray-100"
                  >
                    ← Change Mode
                  </button>
                  <button
                    type="button"
                    onClick={backToSettings}
                    className="text-xs font-semibold uppercase border-[1.5px] border-gray-900 px-3 py-1 bg-white hover:bg-gray-100"
                  >
                    ← Edit Settings
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">Title:</span>
                  <span>{roomData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Topic:</span>
                  <span>{roomData.topic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Difficulty:</span>
                  <span className="uppercase">{roomData.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Mode:</span>
                  <span className="uppercase bg-[#FFD028] px-2 py-0.5 border-[1.5px] border-gray-900 font-bold text-xs">
                    {createMode === "manual" ? "Manual" : "AI Generated"}
                  </span>
                </div>
              </div>
            </div>

            {createMode === "manual" && (
              <AddQuestion
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                updateOption={updateOption}
                addQuestion={addQuestion}
              />
            )}

            {createMode === "ai" && (
              <div className="border-[1.5px] border-gray-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-bold text-lg uppercase flex items-center gap-2">
                    <Sparkles size={18} /> Questions with AI
                  </h3>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="font-bold text-sm uppercase mb-2 block">Focus Area <span className="text-xs font-medium normal-case text-gray-500">(optional)</span></label>
                    <textarea
                      value={aiForm.focus}
                      onChange={(e) => setAiForm({ ...aiForm, focus: e.target.value })}
                      rows="2"
                      maxLength={200}
                      className="w-full px-4 py-3 border-[1.5px] border-gray-900 focus:outline-none focus:shadow-[3px_3px_0px_0px_#FB923C] transition-all resize-none text-sm"
                      placeholder={`e.g. "Focus more on inheritance and polymorphism" or "Include real-world scenarios"`}
                    />
                  </div>
                  <div className="md:grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-sm uppercase mb-2 block">Number of Questions</label>
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        className="w-full border-black p-2 font-medium"
                        value={aiForm.count}
                        onChange={(e) => setAiForm({ ...aiForm, count: e.target.value })}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={handleGenerateAi}
                        isLoading={aiLoading}
                        className="w-full py-3 bg-[#FB923C] text-black border-[1.5px] border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold text-sm uppercase"
                      ><Sparkles size={18} />
                        Generate Questions
                      </Button>
                    </div>
                  </div>

                  {aiGenerated.length > 0 && (
                    <div className="border-[1.5px] border-gray-900 bg-orange-50 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-sm uppercase">Preview Questions</div>
                        <button
                          type="button"
                          onClick={toggleSelectAllAi}
                          className="text-xs font-semibold uppercase border-[1.5px] border-gray-900 px-3 py-1 bg-white hover:bg-gray-100"
                        >
                          {isAllAiSelected ? "Clear All" : "Select All"}
                        </button>
                      </div>

                      <div className="space-y-3">
                        {aiGenerated.map((q, index) => (
                          <div
                            key={q.id}
                            className={`border-[1.5px] border-gray-900 p-3 ${
                              aiSelected[q.id] ? "bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]" : "bg-orange-100"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                className="mt-1 w-4 h-4"
                                checked={!!aiSelected[q.id]}
                                onChange={() => toggleAiQuestion(q.id)}
                              />
                              <div className="flex-1">
                                <div className="font-semibold text-sm">{index + 1}. {q.question}</div>
                                <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs">
                                  {q.options.map((opt, optIndex) => (
                                    <div key={optIndex} className="border-[1.5px] border-gray-900 px-2 py-1 bg-white">
                                      {opt}
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2 text-xs font-bold">
                                  Which is correct? <span className="bg-[#4ADE80] px-2 py-0.5 border-[1.5px] border-gray-900">{q.correct_answer}</span>
                                </div>
                                {q.explanation && (
                                  <div className="mt-2 text-xs">
                                    <span className="font-bold uppercase">Explanation:</span> {q.explanation}
                                  </div>
                                )}
                                <div className="mt-2 text-xs font-bold uppercase">Points: {q.points}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                        <Button
                          type="button"
                          onClick={addSelectedAiQuestions}
                          className="w-full py-3 bg-black text-white border-[1.5px] border-gray-900 shadow-[3px_3px_0px_0px_#FB923C] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold text-sm uppercase"
                        >
                          Add Selected to Quiz
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <QuestionCard
              questions={questions}
              expandedQuestions={expandedQuestions}
              setExpandedQuestions={setExpandedQuestions}
              removeQuestion={removeQuestion}
            />

            <Button
              onClick={handleCreate}
              className="w-full py-3.5 bg-[#FB923C] text-black border-[1.5px] border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold text-lg uppercase"
            >
              Create Quiz 
            </Button>
          </>
        )}
      </div>
    </Window>
  );
};

export default CreateQuizWindow;
