import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Trophy, Home, Medal, Loader2, CheckCircle } from "lucide-react";
import { Card, Button } from "../components/ui";
import { useAuth } from "../features/auth/useAuth";
import { useQuizSession } from "../features/quiz/useQuizSession";
import { useQuizWebSocket } from "../hooks/useQuizWebSocket";

function LeaderBordPage() {
  const { session_id } = useParams();
  const navigate = useNavigate();

  const { authState } = useAuth();
  const { id: userId } = authState;

  const { quizSession, getQuizDetails ,endQuizSession, resetSession } = useQuizSession();
  const { title, status, host_id, isInitialState,participants } = quizSession;
  // Connect to WebSocket for real-time leaderboard updates
  useQuizWebSocket(session_id);


  // Determine if current user is the host
  const isHost = host_id === userId;

  const isLoading = isInitialState;

  useEffect(() => {
    if(isInitialState) {
      getQuizDetails(session_id,userId);
    }
  }, [session_id, isInitialState]);

  
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

//  handle  Dashboard navigation
  const handleDashboardNavigation = () => {
    resetSession();
    navigate("/");
  }

  const handleEndQuizSession = async () => {
    await endQuizSession(session_id);
    handleDashboardNavigation();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8 overflow-hidden">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.05),transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg ring-4 ring-white/70">
                <Trophy size={28} />
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Leaderboard
              </span>
            </h1>
            <p className="text-sm text-gray-500 font-mono ml-1">
              {title || "Quiz Session"}
            </p>
             
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={handleDashboardNavigation}
              className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"
            >
              <Home size={18} className="mr-2" />
              Dashboard
            </Button>
            {isHost && status==="active" && (<Button
              variant="destructive"
              onClick={handleEndQuizSession}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white border border-red-700 shadow-sm"
            >
              End Quiz
            </Button>)}
          </div>
            {/* a button for ending the quiz */}

        </header>

        <div className="grid gap-8 md:grid-cols-3 items-start">
          {/* Main Table */}
          <Card className="p-0 md:col-span-2 overflow-hidden border-0 shadow-xl shadow-purple-100/50 ring-1 ring-gray-100">
            <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 text-lg">Rankings</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                {participants.length > 0 ? "Live Updates" : "Final"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50/50">
                  <tr className="text-left text-gray-500">
                    <th className="py-3 px-6 font-medium w-16">#</th>
                    <th className="py-3 px-6 font-medium">Player</th>
                    <th className="py-3 px-6 font-medium text-center">
                      Status
                    </th>
                    <th className="py-3 px-6 font-medium text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedLeaderboard.map((p) => {
                    const isYou = p.id === userId;
                    return (
                      <tr
                        key={p.id || p.name}
                        className={`transition-colors ${
                          isYou
                            ? "bg-purple-50/60"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <td className="py-4 px-6 font-bold text-gray-400">
                          {p.position === 1 ? (
                            <Medal className="text-yellow-500" size={20} />
                          ) : p.position === 2 ? (
                            <Medal className="text-gray-400" size={20} />
                          ) : p.position === 3 ? (
                            <Medal className="text-amber-600" size={20} />
                          ) : (
                            p.position
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                isYou
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {p.name.charAt(0).toUpperCase()}
                            </div>
                            <span
                              className={`font-medium ${
                                isYou ? "text-purple-900" : "text-gray-700"
                              }`}
                            >
                              {p.name}
                              {isYou && (
                                <span className="ml-2 text-[10px] bg-purple-200 text-purple-700 px-1.5 py-0.5 rounded-full">
                                  YOU
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                            {/* check for completed || active || lobby */}
                            {p.status === "completed" && (
                                <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                                    <CheckCircle size={16} />
                                    Completed
                                </span>)}
                            {p.status === "active" && (
                                <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                                    <Loader2 className="animate-spin" size={16} />
                                    Active
                                </span>)}
                            {p.status === "lobby" && (
                                <span className="inline-flex items-center gap-1 text-gray-500 font-medium">
                                    <span className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" />
                                    In Lobby
                                </span>
                            )}
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-gray-800">
                          {p.score}
                        </td>
                      </tr>
                    );
                  })}
                  {sortedLeaderboard.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-8 text-center text-gray-400 italic"
                      >
                        No participants yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Side Panel (Stats) */}
          {!isHost && (
            <div className="space-y-6">
              <Card className="p-6 bg-white shadow-lg shadow-indigo-100/50 border-0 ring-1 ring-gray-100">
                <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-purple-500 rounded-full" />
                  Your Performance
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-sm">Rank</span>
                    <span className="font-bold text-gray-800 text-lg">
                      {yourStats?.position ? `#${yourStats.position}` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-sm">Score</span>
                    <span className="font-bold text-purple-600 text-lg">
                      {yourStats?.score || 0}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-5 text-xs text-gray-500 bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                <p className="mb-2 font-semibold text-gray-700">What's Next?</p>
                <p className="leading-relaxed">
                  Wait for the host to restart, or head back to the dashboard to
                  join a new room.
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaderBordPage;
