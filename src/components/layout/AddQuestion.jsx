import React from "react";
import { Input, Button } from "../UI/ui";
import { Plus, HelpCircle } from "lucide-react";

const AddQuestion = ({ currentQuestion, setCurrentQuestion, updateOption, addQuestion }) => {
  return (
    <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
      <h3 className="font-black text-lg uppercase mb-4 flex items-center gap-2">
        <HelpCircle size={20} /> Add Question
      </h3>
      
      <div className="space-y-4">
        {/* Question Text */}
        <div>
          <label className="font-black text-sm uppercase mb-2 block">Question Text</label>
          <textarea
            value={currentQuestion.question}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
            className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:shadow-[4px_4px_0px_0px_#FB923C] transition-all resize-none"
            rows="3"
            placeholder="Enter your question..."
          />
        </div>

        {/* Options */}
        <div>
          <label className="font-black text-sm uppercase mb-2 block">Options (4 Required)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-sm shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>

                <Input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 border-black p-2 rounded-none focus:outline-none focus:shadow-[2px_2px_0px_0px_#FB923C] transition-all"
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Correct Answer */}
        <div>
          <label className="font-black text-sm uppercase mb-2 block">Correct Answer</label>
          <select
            value={currentQuestion.correct_answer}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
            className="w-full px-4 py-3 border-2 border-black rounded-none bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_#4ADE80] transition-all font-bold"
          >
            <option value="">Select correct answer...</option>
            {currentQuestion.options.filter((opt) => opt.trim()).map((option, index) => (
              <option key={index} value={option}>
                {String.fromCharCode(65 + index)}: {option}
              </option>
            ))}
          </select>
        </div>

        {/* Explanation */}
        <div>
          <label className="font-black text-sm uppercase mb-2 block">
            Explanation <span className="text-xs font-normal text-gray-500">(Optional)</span>
          </label>
          <textarea
            value={currentQuestion.explanation}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
            rows="2"
            placeholder="Why is this answer correct?"
            className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:shadow-[4px_4px_0px_0px_#FB923C] transition-all resize-none"
          />
        </div>

        {/* Add Button */}
        <Button
          type="button"
          onClick={addQuestion}
          className="w-full py-3 bg-[#FB923C] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none font-black text-lg uppercase flex items-center justify-center gap-2"
        >
          <Plus size={20} strokeWidth={3} />
          Add Question  
        </Button>
      </div>
    </div>
  );
};

export default AddQuestion;