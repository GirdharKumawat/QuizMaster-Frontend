import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Copy,
  Users,
  Clock,
  HelpCircle,
  Zap,
  AlertTriangle,
  Home,
} from "lucide-react";
import { Button, toast } from "../components/UI/ui";
import { useAuth } from "../features/auth/useAuth";
import { useQuizSession } from "../features/quiz/useQuizSession";
import { useQuizWebSocket } from "../hooks/useQuizWebSocket";

function WaitingRoomPage() {
  const navigate = useNavigate();
  const { session_id } = useParams();

  const { authState } = useAuth();
  const { id: userId } = authState;

  const { quizSession, startQuizSession, getQuizDetails } = useQuizSession();
  const {
    status,
    participants,
    title,
    duration,
    pointsPerCorrect,
    host_id,
    question_count,
    join_code,
    playerStatus,
    isInitialState,
    session_id: storedSessionId,
  } = quizSession;

  useQuizWebSocket(session_id);

  // Determine if current user is the host
  const isHost = host_id === userId;

  useEffect(() => {
    let isActive = true;

    const loadQuizDetails = async () => {
      if (!userId) return;

      // Fetch if initial state OR if session_id changed (navigated to different quiz)
      if (isInitialState || storedSessionId !== session_id) {
        const data = await getQuizDetails(session_id, userId);
        if (!data && isActive) {
          navigate("/404", { replace: true });
        }
      }
    };

    loadQuizDetails();

    return () => {
      isActive = false;
    };
  }, [session_id, isInitialState, storedSessionId, userId, navigate, getQuizDetails]);

  useEffect(() => {
    // Only run navigation logic when data is loaded for the CURRENT session
    if (isInitialState || storedSessionId !== session_id) {
      return; // Wait for correct data to load
    }

    if (playerStatus === "active" && !isHost) {
      toast.success({ title: "Quiz Started", detail: "Good luck!" });
      navigate(`/quiz/${session_id}`);
    }
    if (status === "completed" || playerStatus === "completed") {
      toast.info({
        title: "Quiz Ended",
        detail: "Redirecting to leaderboard...",
      });
      navigate(`/leaderboard/${session_id}`);
    }

    // navigate to leaderboard if host starts the quiz
    if (status === "active" && isHost) {
      navigate(`/leaderboard/${session_id}`);
    }
  }, [
    isHost,
    session_id,
    status,
    playerStatus,
    navigate,
    isInitialState,
    storedSessionId,
  ]);

  // --- HANDLERS ---
  const handleStart = async () => {
    if (isHost) {
      // check is there are participants before starting
      if (participants.length === 0) {
        toast.error({
          title: "No Participants",
          detail: "At least one participant is required to start the quiz",
        });
        return;
      }

      await startQuizSession(session_id);
      navigate(`/leaderboard/${session_id}`);
    } else if (status === "active" && !isHost) {
      navigate(`/quiz/${session_id}`);
    } else {
      toast.error({
        title: "Permission Denied",
        detail: "Only the host can start the quiz",
      });
    }
  };

  const copyCode = () => {
    const code = join_code
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          toast.success({
            title: "Copied",
            detail: "Room code copied to clipboard",
          });
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
    const code = join_code ;
    const textarea = document.createElement("textarea");
    textarea.value = code;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      toast.success({
        title: "Copied",
        detail: "Room code copied to clipboard",
      });
    } catch (err) {
      toast.error({ title: "Failed", detail: "Could not copy code" });
    }
    document.body.removeChild(textarea);
  };

  // --- UI PREP ---
  if (isInitialState)
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <div className="border-[1.5px] border-gray-900 bg-white p-8 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.6)] animate-pulse">
          <span className="font-bold text-xl uppercase">Loading Room...</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="border-[1.5px] border-gray-900 bg-[#FFD028] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-4">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
                {title || "Loading Quiz..."}
              </h1>

              {/* Info Badges */}
              <div className="flex flex-wrap gap-3">
                {/* Room Code */}
                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 bg-white border-[1.5px] border-gray-900 px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold   cursor-pointer"
                  title="Click to copy"
                >
                  <Copy size={15} strokeWidth={2.5} />
                  {join_code }
                </button>

                <div className="flex items-center gap-2 bg-white border-[1.5px] border-gray-900 px-4 py-2 font-semibold">
                  <HelpCircle size={15} strokeWidth={2.5} />
                  {question_count || 0} Questions
                </div>

                <div className="flex items-center gap-2 bg-white border-[1.5px] border-gray-900 px-4 py-2 font-semibold">
                  <Clock size={15} strokeWidth={2.5} />
                  {/* dispa */}
                  {duration}min
                </div>
                <div className="flex items-center gap-2 bg-white border-[1.5px] border-gray-900 px-4 py-2 font-semibold">
                  <Zap size={15} strokeWidth={2.5} />
                  {pointsPerCorrect || 1} Pt(s) / Correct
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-white text-black border-[1.5px] border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-none font-bold text-lg uppercase flex items-center gap-2"
              >
                <Home size={18} strokeWidth={2.5} />
                Home
              </Button>

              {isHost && (
                <Button
                  variant="secondary"
                  onClick={handleStart}
                  className="px-8 py-3 bg-[#4ADE80] text-black border-[1.5px] border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-none font-bold text-lg uppercase flex items-center gap-2"
                >
                  <Play size={18} strokeWidth={2.5} />
                  Start Quiz
                </Button>
              )}

              {!isHost && status === "active" && playerStatus === "lobby" && (
                <Button
                  onClick={handleStart}
                  className="px-8 py-3 bg-[#4ADE80] text-black border-[1.5px] border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-none font-bold text-lg uppercase flex items-center gap-2"
                >
                  <Zap size={18} strokeWidth={2.5} />
                  Join Competition
                </Button>
              )}

              {!isHost && status !== "active" && (
                <div className="px-6 py-3 bg-white border-[1.5px] border-gray-900 font-bold uppercase text-sm flex items-center gap-2 animate-pulse">
                  <AlertTriangle size={16} strokeWidth={2.5} />
                  Waiting for host...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Participants List */}
          <div className="lg:col-span-2 border-[1.5px] border-gray-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg uppercase flex items-center gap-2">
                <Users size={18} strokeWidth={2.5} />
                Lobby
                <span className="bg-black text-white px-2 py-0.5 text-sm font-semibold">
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
                    className={`flex items-center justify-between p-3 border-[1.5px] border-gray-900 transition-all ${
                      isMe
                        ? "bg-[#A78BFA] shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 border-[1.5px] border-gray-900 flex items-center justify-center text-sm font-bold ${
                          isMe
                            ? "bg-white text-black"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {p.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold uppercase">
                        {p.name}{" "}
                        {isMe && <span className="text-xs">(YOU)</span>}
                      </span>
                    </div>
                  </li>
                );
              })}

              {participants.length === 0 && (
                <li className="text-center py-10 border-2 border-dashed border-gray-400 font-semibold uppercase text-gray-500">
                  Waiting for participants to join...
                </li>
              )}
            </ul>
          </div>

          {/* Tips / Info Panel */}
          <div className="space-y-4">
            <div className="border-[1.5px] border-gray-900 bg-[#FB923C] p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
              <h3 className="font-bold text-lg uppercase mb-3 flex items-center gap-2">
                <Zap size={16} strokeWidth={2.5} />
                Instructions
              </h3>
              <ul className="space-y-2 font-medium text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-black text-white px-1.5 py-0.5 text-xs font-bold">
                    1
                  </span>
                  Don't refresh the page once the competition starts.
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-black text-white px-1.5 py-0.5 text-xs font-bold">
                    2
                  </span>
                  Answer quickly to get more points.
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-black text-white px-1.5 py-0.5 text-xs font-bold">
                    3
                  </span>
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
