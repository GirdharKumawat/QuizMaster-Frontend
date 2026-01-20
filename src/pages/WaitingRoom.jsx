import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Copy, Users, Clock, HelpCircle, Zap, AlertTriangle, Home } from "lucide-react";
import { Button, toast } from "../components/UI/ui";
import { useAuth } from "../features/auth/useAuth";
import { useQuizSession } from "../features/quiz/useQuizSession";
import { useQuizWebSocket } from "../hooks/useQuizWebSocket";

function WaitingRoomPage() {
  const navigate = useNavigate();
  const { session_id } = useParams();

  const { authState } = useAuth();
  const { id: userId } = authState;

  const { quizSession, startQuizSession, getQuizDetails } =
    useQuizSession();
  const {
    status,
    participants,
    title,
    duration,
    host_id,
    question_count,
    playerStatus,
    isInitialState,
  } = quizSession;

  useQuizWebSocket(session_id);

  // Determine if current user is the host
  const isHost = host_id === userId;

  useEffect(() => {
    if (isInitialState) {
      getQuizDetails(session_id, userId);
    }
  }, [session_id, isInitialState]);

// TODO: playerStatus dependency ensures effect re-runs when status changes to trigger navigation
  useEffect(() => {
    if (playerStatus === "active" && !isHost) {
      toast.success({ title: "Quiz Started", detail: "Good luck!" });
      navigate(`/quiz/${session_id}`);
    }
    if (status === "completed" || playerStatus === "completed") {
      toast.info({ title: "Quiz Ended", detail: "Redirecting to leaderboard..." });
      navigate(`/leaderboard/${session_id}`);
    }

    // navigate to leaderboard if host starts the quiz
    if (status === "active" && isHost) {
      navigate(`/leaderboard/${session_id}`);
    }
  }, [isHost, session_id, status, playerStatus, navigate]);

  // --- HANDLERS ---
  const handleStart = async () => {
    if (isHost) {
      await startQuizSession(session_id);
      navigate(`/leaderboard/${session_id}`);
    } else if (status === "active" && !isHost) {
      navigate(`/quiz/${session_id}`);
    } else {
      toast.error({ title: "Permission Denied", detail: "Only the host can start the quiz" });
    }
  };

  const copyCode = () => {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(session_id)
        .then(() => {
          toast.success({ title: "Copied", detail: "Room code copied to clipboard" });
        })
        .catch(() => {
          fallbackCopy();
        });
    } else {
      // Fallback for IP addresses or older browsers
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    const textarea = document.createElement("textarea");
    textarea.value = session_id;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      toast.success({ title: "Copied", detail: "Room code copied to clipboard" });
    } catch (err) {
      toast.error({ title: "Failed", detail: "Could not copy code" });
    }
    document.body.removeChild(textarea);
  };

  // --- UI PREP ---
  if (isInitialState)
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <div className="border-2 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] animate-pulse">
          <span className="font-black text-xl uppercase">Loading Room...</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="border-2 border-black bg-[#FFD028] p-6 shadow-[8px_8px_0px_0px_#000]">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-4">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                {title || "Loading Quiz..."}
              </h1>

              {/* Info Badges */}
              <div className="flex flex-wrap gap-3">
                {/* Room Code */}
                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 bg-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all font-black   cursor-pointer"
                  title="Click to copy"
                >
                  <Copy size={16} strokeWidth={3} />
                  {session_id}
                </button>
                
                <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-2 font-bold">
                  <HelpCircle size={16} strokeWidth={3} />
                  {question_count || 0} Questions
                </div>
                
                <div className="flex items-center gap-2 bg-white border-2 border-black px-4 py-2 font-bold">
                  <Clock size={16} strokeWidth={3} />
                  {duration || 60}s / Q
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none font-black text-lg uppercase flex items-center gap-2"
              >
                <Home size={20} strokeWidth={3} />
                Home
              </Button>
              
              {isHost && (
                <Button
                variant="secondary"
                  onClick={handleStart}
                  className="px-8 py-3 bg-[#4ADE80] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none font-black text-lg uppercase flex items-center gap-2"
                >
                  <Play size={20} strokeWidth={3} />
                  Start Quiz
                </Button>
              )}
              
              {!isHost && status === "active" && playerStatus === "lobby" && (
                <Button
                  onClick={handleStart}
                  className="px-8 py-3 bg-[#4ADE80] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none font-black text-lg uppercase flex items-center gap-2"
                >
                  <Zap size={20} strokeWidth={3} />
                  Join Game
                </Button>
              )}
              
              {!isHost && status !== "active" && (
                <div className="px-6 py-3 bg-white border-2 border-black font-black uppercase text-sm flex items-center gap-2 animate-pulse">
                  <AlertTriangle size={18} strokeWidth={3} />
                  Waiting for host...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Players List */}
          <div className="lg:col-span-2 border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-lg uppercase flex items-center gap-2">
                <Users size={20} strokeWidth={3} />
                Lobby
                <span className="bg-black text-white px-2 py-0.5 text-sm">
                  {participants.length}
                </span>
              </h2>
            </div>

            <ul className="space-y-2 max-h-[400px] overflow-y-auto">
              {participants.map((p) => {
                const isMe = p.user_id === userId;
                return (
                  <li
                    key={p.user_id}
                    className={`flex items-center justify-between p-3 border-2 border-black transition-all ${
                      isMe
                        ? "bg-[#A78BFA] shadow-[4px_4px_0px_0px_#000]"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 border-2 border-black flex items-center justify-center text-sm font-black ${
                          isMe
                            ? "bg-white text-black"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {p.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold uppercase">
                        {p.name} {isMe && <span className="text-xs">(YOU)</span>}
                      </span>
                    </div>
                  </li>
                );
              })}

              {participants.length === 0 && (
                <li className="text-center py-10 border-2 border-dashed border-black font-bold uppercase text-gray-500">
                  Waiting for players to join...
                </li>
              )}
            </ul>
          </div>

          {/* Tips / Info Panel */}
          <div className="space-y-4">
            <div className="border-2 border-black bg-[#FB923C] p-5 shadow-[4px_4px_0px_0px_#000]">
              <h3 className="font-black text-lg uppercase mb-3 flex items-center gap-2">
                <Zap size={18} strokeWidth={3} />
                Instructions
              </h3>
              <ul className="space-y-2 font-bold text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-black text-white px-1.5 py-0.5 text-xs font-black">1</span>
                  Don't refresh the page once the game starts.
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-black text-white px-1.5 py-0.5 text-xs font-black">2</span>
                  Answer quickly to get more points.
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-black text-white px-1.5 py-0.5 text-xs font-black">3</span>
                  Host can end the quiz at any time.
                </li>
              </ul>
            </div>
            
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaitingRoomPage;
