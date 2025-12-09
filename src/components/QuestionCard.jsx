import React from "react";
import { Card } from "./ui";
import { ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";

const QuestionCard = ({ questions, expandedQuestions, setExpandedQuestions, removeQuestion }) => {
  if (!questions || questions.length === 0) return null;
  return (
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
                                {q.question}
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
                                const correct = option === q.correct_answer;
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
  );
};

export default QuestionCard;