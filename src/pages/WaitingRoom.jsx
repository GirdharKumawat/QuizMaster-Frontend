import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button } from "../components/ui";
import { useAuth } from "../features/auth/useAuth";
import { useQuiz } from "../features/quiz/useQuiz";
import { useQuizGame } from "../features/quiz/useQuizGame"; // Import the hook
import { toast } from "sonner";

function WaitingRoomPage() {
  const { session_id } = useParams();
  const navigate = useNavigate();

  // 1. Global State (User & Quiz Lists)
  const { authState, fetchUser } = useAuth();
  const { quizState, getCreatedQuizzes, getEnrolledQuizzes } = useQuiz();
  
 
  // --- INITIALIZATION ---
  const { id: userId } = authState;
  const createdQuizzes = quizState.createdQuizzes || [];
  const enrolledQuizzes = quizState.enrolledQuizzes || [];

  // Find the quiz object from Redux state
  const currentQuiz = [...createdQuizzes, ...enrolledQuizzes].find(q => q.session_id === session_id) || {};
  const isHost = currentQuiz.host_id === userId;
  
   // 2. Game Logic Hook (Sockets & Actions)
  const { startQuiz, participants, setInitialParticipants } = useQuizGame( session_id,isHost, currentQuiz.quiz_id );
  
  
  useEffect(() => {
    // Ensure User is loaded
    if (!userId) fetchUser();

    // Ensure Quiz Data is loaded (Handle Refresh)
    if (!currentQuiz.quiz_id && quizState.canTry) {
        getCreatedQuizzes();
        getEnrolledQuizzes();
    }

    // Set initial participants list from the stored quiz data
    if (currentQuiz.participants) {
        setInitialParticipants(currentQuiz.participants);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session_id, currentQuiz.quiz_id]); 
  // Note: We depend on _id to trigger once the quiz loads

  // --- HANDLERS ---
  const handleStart = async () => {
    if (isHost) {
        await startQuiz();
    }else if((currentQuiz.status==="active"))
    {
        toast.success("Quiz Already Started! Redirecting...");
        navigate(`/quiz/${session_id}`);
    }
    
    else {
        toast.error("Only the host can start the quiz.");
    }
  };

  const copyCode = () => {
      navigator.clipboard.writeText(session_id);
      toast.success("Room code copied!");
  };

  // --- UI PREP ---
  if (!currentQuiz.quiz_id && quizState.loading) return <div className="p-10 text-center">Loading Room...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-6">
        
        {/* Header Card */}
        <Card className="p-6 bg-white border-purple-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
              {/* Optional Background Decor */}
              <div className="w-32 h-32 bg-purple-600 rounded-full blur-3xl"></div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-800">
                {currentQuiz.title || "Loading Quiz..."}
              </h1>
              
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                <button 
                    onClick={copyCode}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors font-mono cursor-pointer"
                    title="Click to copy"
                >
                  Code: {session_id}
                </button>
                <span className="bg-gray-50 px-3 py-1 rounded-md border border-gray-100">
                  {currentQuiz.question_count || 0} Questions
                </span>
                <span className="bg-gray-50 px-3 py-1 rounded-md border border-gray-100">
                  {currentQuiz.duration || 60}s / Q
                </span>
              </div>
            </div>

            {/* Start Button (Host Only) */}
            {(isHost ||currentQuiz.status==="active")&& (
                <Button 
                    variant="primary" 
                    className="px-8 py-2 shadow-lg shadow-purple-200"
                    onClick={handleStart}
                >
                    Start Quiz
                </Button>
            )}
            {(!isHost && currentQuiz.status!=="active") && (
                <div className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium animate-pulse border border-yellow-100">
                    Waiting for host to start...
                </div>
            )}
          </div>
        </Card>

        {/* Players List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-5 lg:col-span-2 bg-white border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Lobby Participants <span className="text-gray-400">({participants.length})</span>
              </h2>
            </div>
            
            <ul className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              {participants.map((p) => {
                  const isMe = p.user_id === userId;
                  return (
                    <li
                      key={p.user_id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isMe 
                        ? "bg-purple-50 border-purple-200 shadow-sm" 
                        : "bg-white border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isMe ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                            {p.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className={`font-medium ${isMe ? "text-purple-700" : "text-gray-700"}`}>
                            {p.name} {isMe && "(You)"}
                        </span>
                      </div>
                    </li>
                  );
              })}
              
              {participants.length === 0 && (
                 <li className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
                    Waiting for players to join...
                 </li>
              )}
            </ul>
          </Card>

          {/* Tips / Info Panel */}
          <div className="space-y-4">
             <Card className="p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                <h3 className="font-semibold mb-2">Instructions</h3>
                <ul className="text-sm space-y-2 opacity-90 list-disc list-inside">
                    <li>Don't refresh the page once the game starts.</li>
                    <li>Answer quickly to get more points.</li>
                    <li>Host can end the quiz at any time.</li>
                </ul>
             </Card>
          </div>
        </div>

      </div>
    </div>
  );
}

export default WaitingRoomPage;