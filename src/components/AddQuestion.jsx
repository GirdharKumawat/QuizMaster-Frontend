
import React from "react";
import { Card, Input, Button } from "./ui";
import { Plus, Hash, FileText } from "lucide-react";

const AddQuestion = ({ currentQuestion, setCurrentQuestion, updateOption, addQuestion }) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Questions (Manual)</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Question Text</label>
          <textarea
            value={currentQuestion.question}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
            className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm border border-gray-400 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            rows="3"
            placeholder="Enter your question"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium">Options (4 required)</label>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  icon={Hash}
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium">Correct Answer</label>
          <select
            value={currentQuestion.correct_answer}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
            className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm border border-gray-400 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Select correct answer</option>
            {currentQuestion.options.filter((opt) => opt.trim()).map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium">Explanation <span className="text-xs text-gray-500">(optional)</span></label>
          <div className="relative">
            <div className="absolute z-50 left-3 top-3 text-gray-500">
              <FileText size={18} />
            </div>
            <textarea
              value={currentQuestion.explanation}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
              rows="2"
              placeholder="Why is this answer correct?"
              className="w-full pl-10 pr-4 py-2 bg-white/30 backdrop-blur-sm border border-gray-400 rounded-xl text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
          </div>
        </div>

        <Button onClick={addQuestion} className=" cursor-pointer flex items-center justify-center w-full">
          <Plus size={16} className="mr-2" />
          Add Question
        </Button>
      </div>
    </Card>
  );
};

export default AddQuestion;