import React from "react";
import { ChevronUp, ChevronDown, CheckCircle2, Trash2, List } from "lucide-react";

const QuestionCard = ({ questions, expandedQuestions, setExpandedQuestions, removeQuestion }) => {
  if (!questions || questions.length === 0) return null;
  
  return (
    <div className="border-[1.5px] border-gray-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg uppercase flex items-center gap-2">
          <List size={18} />
          Added Questions
          <span className="bg-black text-white px-2 py-0.5 text-sm">
            {questions.length}
          </span>
        </h3>
        <div className="text-xs font-medium uppercase text-gray-600">
          Click to expand
        </div>
      </div>
      
      <div className="space-y-3">
        {questions.map((q, index) => {
          const isExpanded = expandedQuestions[q.id];
          return (
            <div
              key={q.id}
              className={`border-[1.5px] border-gray-900 transition-all ${
                isExpanded
                  ? "bg-orange-50 shadow-[3px_3px_0px_0px_#FB923C]"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedQuestions((prev) => ({
                    ...prev,
                    [q.id]: !isExpanded,
                  }))
                }
                className="w-full text-left p-3 flex items-start gap-3"
              >
                {/* Question Number */}
                <div className="w-9 h-9 bg-[#FB923C] border-[1.5px] border-gray-900 flex items-center justify-center font-bold text-lg shrink-0">
                  {index + 1}
                </div>
                
                {/* Question Text */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 leading-snug">
                    {q.question}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-bold uppercase">
                      {q.points} pt{q.points > 1 && "s"}
                    </span>
                    <span className="border border-black px-2 py-0.5 text-xs font-bold uppercase bg-gray-100">
                      4 options
                    </span>
                    {q.explanation && (
                      <span className="border border-black px-2 py-0.5 text-xs font-bold uppercase bg-yellow-100">
                        Has explanation
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Expand Icon */}
                <div className="text-black mt-1">
                  {isExpanded ? (
                    <ChevronUp size={18} strokeWidth={2.5} />
                  ) : (
                    <ChevronDown size={18} strokeWidth={2.5} />
                  )}
                </div>
              </button>
              
              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t-[1.5px] border-gray-900 p-4">
                  <label className="font-bold text-xs uppercase mb-2 block">Options:</label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {q.options.map((option, idx) => {
                      const correct = option === q.correct_answer;
                      return (
                        <div
                          key={idx}
                          className={`border-[1.5px] border-gray-900 px-3 py-2 text-sm flex items-center gap-2 ${
                            correct
                              ? "bg-[#4ADE80] font-semibold"
                              : "bg-white"
                          }`}
                        >
                          {correct && (
                            <CheckCircle2
                              size={16}
                              className="text-black shrink-0"
                              strokeWidth={2.5}
                            />
                          )}
                          <span>{option}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {q.explanation && (
                    <div className="mt-4 p-3 bg-yellow-100 border-[1.5px] border-gray-900">
                      <span className="font-bold text-xs uppercase">Explanation:</span>
                      <p className="text-sm mt-1">{q.explanation}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeQuestion(q.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white border-[1.5px] border-gray-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px] transition-all font-semibold text-sm uppercase"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;