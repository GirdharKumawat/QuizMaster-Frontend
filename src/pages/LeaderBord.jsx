import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trophy, Home, Medal, Loader2, CheckCircle, StopCircle, Zap, XCircle, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Button } from "../components/UI/ui";
import { useAuth } from "../features/auth/useAuth";
import { useQuizSession } from "../features/quiz/useQuizSession";
import { useQuizWebSocket } from "../hooks/useQuizWebSocket";

function LeaderBordPage() {
  const { session_id } = useParams();
  const navigate = useNavigate();

  const { authState } = useAuth();
  const { id: userId } = authState;

  const { quizSession, getQuizDetails, endQuizSession, resetSession, getReview } = useQuizSession();
  const { title, status, host_id, isInitialState, participants, session_id: storedSessionId } = quizSession;
  
  // Review state
  const [reviewData, setReviewData] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState({});
  
  // Connect to WebSocket for real-time leaderboard updates
  useQuizWebSocket(session_id);

  // Determine if current user is the host
  const isHost = host_id === userId;
  const isLoading = isInitialState || storedSessionId !== session_id;
  const isCompleted = status === "completed";

  // Fetch review data when quiz is completed
  const fetchReview = async () => {
    if (isHost) return;
    setReviewLoading(true);
    try {
      const data = await getReview(session_id);
      setReviewData(data);
      setShowReview(true);
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    // Fetch if initial state OR if session_id changed (navigated to different quiz)
    if (isInitialState || storedSessionId !== session_id) {
      console.log("Fetching quiz details for session:", session_id);
      getQuizDetails(session_id, userId);
    }
  }, [session_id, isInitialState, storedSessionId]);

  // Prepare sorted leaderboard with rankings from quizSession participants
  const sortedLeaderboard = useMemo(() => {
    const sorted = [...participants].sort((a, b) => b.score - a.score);
    return sorted.map((p, index) => ({
      id: p.user_id,
      name: p.name,
      score: p.score,
      status: p.status,
      position: index + 1,
    }));
  }, [participants]);

  const yourStats = useMemo(() => {
    return sortedLeaderboard.find((p) => p.id === userId);
  }, [sortedLeaderboard, userId]);

  // Handle Dashboard navigation
  const handleDashboardNavigation = () => {
    resetSession();
    navigate("/");
  };

  const handleEndQuizSession = async () => {
    await endQuizSession(session_id);
    handleDashboardNavigation();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <div className="border-2 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] animate-pulse">
          <span className="font-black text-xl uppercase">Loading Leaderboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-2 border-black bg-[#FFD028] p-6 shadow-[8px_8px_0px_0px_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                <Trophy size={32} strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                  Leaderboard
                </h1>
                <p className="font-bold text-sm mt-1">
                  {title || "Quiz Session"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleDashboardNavigation}
                className="px-6 py-3 bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none font-black uppercase flex items-center gap-2"
              >
                <Home size={18} strokeWidth={3} />
                Dashboard
              </Button>
              {isHost && status === "active" && (
                <Button
                  onClick={handleEndQuizSession}
                  className="px-6 py-3 bg-red-500 text-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none font-black uppercase flex items-center gap-2"
                >
                  <StopCircle size={18} strokeWidth={3} />
                  End Quiz
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3 items-start">
          
          {/* Main Table */}
          <div className="md:col-span-2 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] overflow-hidden">
            {/* Table Header */}
            <div className="p-4 border-b-2 border-black bg-gray-50 flex justify-between items-center">
              <h3 className="font-black text-lg uppercase">Rankings</h3>
              <span className="bg-[#4ADE80] border-2 border-black px-3 py-1 font-black text-xs uppercase">
                {status === "active" ? "Live" : "Final"}
              </span>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="py-3 px-4 font-black text-left uppercase text-sm w-16">#</th>
                    <th className="py-3 px-4 font-black text-left uppercase text-sm">Player</th>
                    <th className="py-3 px-4 font-black text-center uppercase text-sm">Status</th>
                    <th className="py-3 px-4 font-black text-right uppercase text-sm">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeaderboard.map((p, idx) => {
                    const isYou = p.id === userId;
                    return (
                      <tr
                        key={p.id || p.name}
                        className={`border-b-2 border-black transition-colors ${
                          isYou ? "bg-[#A78BFA]" : idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        {/* Position */}
                        <td className="py-4 px-4">
                          {p.position === 1 ? (
                            <div className="w-8 h-8 bg-[#FFD028] border-2 border-black flex items-center justify-center">
                              <Medal size={18} strokeWidth={3} />
                            </div>
                          ) : p.position === 2 ? (
                            <div className="w-8 h-8 bg-gray-300 border-2 border-black flex items-center justify-center">
                              <Medal size={18} strokeWidth={3} />
                            </div>
                          ) : p.position === 3 ? (
                            <div className="w-8 h-8 bg-[#FB923C] border-2 border-black flex items-center justify-center">
                              <Medal size={18} strokeWidth={3} />
                            </div>
                          ) : (
                            <span className="font-black text-lg">{p.position}</span>
                          )}
                        </td>
                        
                        {/* Player */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 border-2 border-black flex items-center justify-center font-black ${
                                isYou ? "bg-white" : "bg-gray-100"
                              }`}
                            >
                              {p.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold uppercase break-words">
                              {p.name}
                              {isYou && (
                                <span className="ml-2 bg-black text-white px-2 py-0.5 text-xs font-black">
                                  YOU
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        
                        {/* Status */}
                        <td className="py-4 px-4 text-center">
                          {p.status === "completed" && (
                            <span className="inline-flex items-center gap-1 bg-[#4ADE80] border-2 border-black px-2 py-1 font-bold text-xs uppercase">
                              <CheckCircle size={14} strokeWidth={3} />
                              Done
                            </span>
                          )}
                          {p.status === "active" && (
                            <span className="inline-flex items-center gap-1 bg-[#22D3EE] border-2 border-black px-2 py-1 font-bold text-xs uppercase">
                              <Loader2 className="animate-spin" size={14} strokeWidth={3} />
                              Playing
                            </span>
                          )}
                          {p.status === "lobby" && (
                            <span className="inline-flex items-center gap-1 bg-gray-200 border-2 border-black px-2 py-1 font-bold text-xs uppercase">
                              <span className="w-2 h-2 bg-black animate-pulse" />
                              Lobby
                            </span>
                          )}
                        </td>
                        
                        {/* Score */}
                        <td className="py-4 px-4 text-right">
                          <span className="font-black text-xl">{p.score}</span>
                        </td>
                      </tr>
                    );
                  })}
                  {sortedLeaderboard.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-10 text-center font-bold uppercase text-gray-500 border-b-2 border-black"
                      >
                        No participants yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y-2 divide-black border-t-2 border-black">
              {sortedLeaderboard.length === 0 && (
                <div className="p-4 text-center font-bold uppercase text-gray-500">No participants yet.</div>
              )}
              {sortedLeaderboard.map((p) => {
                const isYou = p.id === userId;
                return (
                  <div
                    key={p.id || p.name}
                    className={`p-4 flex flex-col gap-3 ${isYou ? "bg-[#A78BFA]" : "bg-white"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 border-2 border-black flex items-center justify-center font-black bg-gray-100">
                          {p.position <= 3 ? <Medal size={20} strokeWidth={3} /> : <span className="text-lg">#{p.position}</span>}
                        </div>
                        <div>
                          <p className="font-black uppercase leading-tight break-words">{p.name}</p>
                          {isYou && <span className="inline-flex mt-1 bg-black text-white px-2 py-0.5 text-xs font-black">YOU</span>}
                        </div>
                      </div>
                      <span className="font-black text-xl">{p.score}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.status === "completed" && (
                        <span className="inline-flex items-center gap-1 bg-[#4ADE80] border-2 border-black px-2 py-1 font-bold text-xs uppercase">
                          <CheckCircle size={14} strokeWidth={3} />
                          Done
                        </span>
                      )}
                      {p.status === "active" && (
                        <span className="inline-flex items-center gap-1 bg-[#22D3EE] border-2 border-black px-2 py-1 font-bold text-xs uppercase">
                          <Loader2 className="animate-spin" size={14} strokeWidth={3} />
                          Playing
                        </span>
                      )}
                      {p.status === "lobby" && (
                        <span className="inline-flex items-center gap-1 bg-gray-200 border-2 border-black px-2 py-1 font-bold text-xs uppercase">
                          <span className="w-2 h-2 bg-black animate-pulse" />
                          Lobby
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side Panel (Stats) */}
          {!isHost && (
            <div className="space-y-4">
              {/* Your Performance */}
              <div className="border-2 border-black bg-[#A78BFA] p-5 shadow-[4px_4px_0px_0px_#000]">
                <h3 className="font-black text-lg uppercase mb-4 flex items-center gap-2">
                  <Zap size={20} strokeWidth={3} />
                  Your Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                    <span className="font-bold uppercase text-sm">Rank</span>
                    <span className="font-black text-2xl">
                      {yourStats?.position ? `#${yourStats.position}` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white border-2 border-black">
                    <span className="font-bold uppercase text-sm">Score</span>
                    <span className="font-black text-2xl">
                      {yourStats?.score || 0}
                    </span>
                  </div>
                </div>
                
                {/* Review Button - Only show when completed */}
                {isCompleted && (
                  <Button
                    onClick={fetchReview}
                    disabled={reviewLoading}
                    className="w-full mt-4 py-2.5 px-4 sm:py-3 sm:px-6 bg-[#FFD028] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none font-black uppercase text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    {reviewLoading ? (
                      <><Loader2 className="animate-spin" size={16} /> <span className="hidden xs:inline">Loading...</span><span className="xs:hidden">Load...</span></>
                    ) : (
                      <><FileText size={16} /> <span className="hidden xs:inline">Review Answers</span><span className="xs:hidden">Review</span></>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Review Section - Full Width Below */}
        {showReview && reviewData.length > 0 && (
          <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] overflow-hidden">
            <div 
              className="p-3 sm:p-4 border-b-2 border-black bg-[#FFD028] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 cursor-pointer"
              onClick={() => setShowReview(!showReview)}
            >
              <h3 className="font-black text-base sm:text-lg uppercase flex items-center gap-2">
                <FileText size={18} className="shrink-0" /> 
                <span className="hidden sm:inline">Your Answer Review</span>
                <span className="sm:hidden">Review</span>
              </h3>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="bg-white border-2 border-black px-2 sm:px-3 py-1 font-black text-xs sm:text-sm">
                  {reviewData.filter(q => q.is_correct).length}/{reviewData.length} Correct
                </span>
                {showReview ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[60vh] sm:max-h-[500px] overflow-y-auto">
              {reviewData.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`border-2 border-black p-3 sm:p-4 ${item.is_correct ? 'bg-green-50' : 'bg-red-50'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
                    <div className="flex items-start gap-2">
                      <span className="w-7 h-7 sm:w-8 sm:h-8 bg-black text-white flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base leading-snug">{item.question}</h4>
                    </div>
                    {item.is_correct ? (
                      <span className="self-start shrink-0 bg-[#4ADE80] border-2 border-black px-2 py-1 font-black text-xs uppercase flex items-center gap-1">
                        <CheckCircle size={12} className="sm:w-[14px] sm:h-[14px]" /> Correct
                      </span>
                    ) : (
                      <span className="self-start shrink-0 bg-[#F87171] border-2 border-black px-2 py-1 font-black text-xs uppercase flex items-center gap-1">
                        <XCircle size={12} className="sm:w-[14px] sm:h-[14px]" /> Wrong
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.options.map((option, optIdx) => {
                      const isCorrect = option === item.correct_answer;
                      const isSelected = option === item.selected_option;
                      
                      return (
                        <div
                          key={optIdx}
                          className={`p-2 border-2 border-black font-bold text-xs sm:text-sm flex items-center gap-2 ${
                            isCorrect 
                              ? 'bg-[#4ADE80]' 
                              : isSelected && !isCorrect
                                ? 'bg-[#F87171]'
                                : 'bg-white'
                          }`}
                        >
                          {isCorrect && <CheckCircle size={14} className="shrink-0" />}
                          {isSelected && !isCorrect && <XCircle size={14} className="shrink-0" />}
                          <span className={`break-words ${isCorrect || isSelected ? '' : 'ml-5 sm:ml-6'}`}>{option}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Explanation Section */}
                  {item.explanation && (
                    <div className="mt-3 border-t-2 border-black pt-3">
                      <button
                        onClick={() => setExpandedExplanations(prev => ({
                          ...prev,
                          [idx]: !prev[idx]
                        }))}
                        className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-2 border border-black transition-colors"
                      >
                        <span className="font-bold text-xs sm:text-sm uppercase">📖 Explanation</span>
                        {expandedExplanations[idx] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {expandedExplanations[idx] && (
                        <div className="mt-2 p-2 sm:p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                          <p className="text-xs sm:text-sm font-medium text-gray-800">{item.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaderBordPage;
