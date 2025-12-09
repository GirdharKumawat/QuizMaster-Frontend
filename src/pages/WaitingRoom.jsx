import { useEffect } from "react";
import { Card, Button } from "../components/ui";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { useQuiz } from "../features/quiz/useQuiz";
import { toast } from "sonner";

function WaitingRoomPage() {
  const { quizid } = useParams();
  const { quizState, getCretedQuizzes, getEnrolledQuizzes, startQuiz } =
    useQuiz();
  const { authState, fetchUser } = useAuth();
  const { id, username } = authState;

  const hostUserId = authState.id; // id of logged-in user
  if (!hostUserId) {
    fetchUser();
  }
  const enrolledQuizzes = quizState.enrolledQuizzes || [];
  const createdQuizzes = quizState.createdQuizzes || [];

  const quizzes = [...createdQuizzes, ...enrolledQuizzes];
  useEffect(() => {
    if (!createdQuizzes.length && quizState.canTry) {
      getCretedQuizzes();
    }

    if (!enrolledQuizzes.length && quizState.canTry) {
      getEnrolledQuizzes();
    }

    if (!id || !username) {
      fetchUser(id);
    }
  }, [quizzes]);

  const currQuiz = quizzes.find((q) => q._id === quizid) || {};

  const participantsRaw = currQuiz.participants || [];
  const participants = participantsRaw.map((p) => ({
    id: p.user_id,
    name: p.username,
    score: p.score,
    joinedAt: p.joinedAt,
  }));

  const isHost = hostUserId === currQuiz.host_id;
  const status = currQuiz.status;

  const canStart = status === "waiting" && participants.length > 0;
  const canJoin = !isHost && status === "in_progress";
  const navigate = useNavigate();

  const onStart = async () => {
    if (isHost) {
      const result = await startQuiz(quizid);
      if (result) {
        navigate(`/leaderboard/${quizid}`);
      } else {
        console.error("startQuiz function is not available.");
      }
    } else {
      if (canJoin) {
        navigate(`/quiz/${quizid}`);
      }else{
        toast.error("quiz cannot be started right now.");
      }
    }
  };

  const settings = {
    title:
      currQuiz.title ||
      currQuiz.quizTitle ||
      currQuiz.quizze?.title ||
      "Untitled Quiz",
    code: quizid,
    questionCount:
      currQuiz.questionCount ||
      currQuiz.questions?.length ||
      currQuiz.quizze?.questions?.length ||
      0,
    timePerQuestion: currQuiz.timePerQuestion || currQuiz.duration || 20,
    autoStart: currQuiz.autoStart || false,
  };
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-6">
        {/* Header / Room Summary */}
        <Card className="p-5 md:p-7 bg-gradient-to-br from-white to-purple-50/60 backdrop-blur border border-purple-100/60 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                {settings.title}
              </h1>
              <div className="flex flex-wrap gap-2 text-xs md:text-sm text-gray-600">
                <span className="flex items-center gap-1 bg-white rounded-md px-2 py-1 shadow-sm border border-gray-200 font-mono">
                  Code: {settings.code}
                </span>
                <span className="bg-white rounded-md px-2 py-1 shadow-sm border border-gray-200">
                  {settings.questionCount} Questions
                </span>
                <span className="bg-white rounded-md px-2 py-1 shadow-sm border border-gray-200">
                  {settings.timePerQuestion}s / Q
                </span>
                <span className="bg-white rounded-md px-2 py-1 shadow-sm border border-gray-200">
                  {settings.autoStart ? "Auto Start" : "Manual Start"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start">
              <Button variant="primary" className="px-6 cursor-pointer " onClick={onStart}>
                Start Quiz
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Players List */}
          <Card className="p-5 lg:col-span-2 bg-white/70 border border-gray-200/70 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Players{" "}
                <span className="text-gray-400 font-normal">
                  ({participants.length})
                </span>
              </h2>
              <div className="flex gap-2 text-xs text-gray-500"></div>
            </div>
            <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {participants.map((p) => (
                <li
                  key={p.id || p.name}
                  // if curr p is user itself, highlight
                  className={`group flex items-center justify-between p-3 ${
                    p.id === id ? "bg-purple-600 text-white" : "bg-white/90"
                  } rounded-xl border border-gray-200  transition-colors shadow-sm`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          p.id === id ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {p.name}
                      </span>
                      {p.id === id && (
                        <span
                          className={`${
                            p.id === id
                              ? "text-white opacity-80"
                              : "text-gray-500"
                          } text-sm`}
                        >
                          {"(You)"}
                        </span>
                      )}
                    </div>
                  </div>
                  {isHost && !p.isHost && (
                    <button
                      type="button"
                      onClick={() => console.log("kick", p.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      aria-label={`Remove ${p.name}`}
                    >
                      <X size={16} />
                    </button>
                  )}
                </li>
              ))}
              {participants.length === 0 && (
                <li className="text-center text-gray-500 py-10 bg-white/60 rounded-xl border border-dashed border-gray-300">
                  Waiting for players to join…
                </li>
              )}
            </ul>
          </Card>

          {/* Side Panel */}
          {/* <div className="space-y-6">
            <Card className="p-5 bg-white/70 border border-gray-200/70 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Lobby Status</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {status === "waiting" && (
                  <p>Waiting for host to start the game.</p>
                )}
                {status === "counting_down" && (
                  <p>
                    Game starting in{" "}
                    <span className="font-semibold text-gray-800">
                      {countdown}s
                    </span>
                    .
                  </p>
                )}
                {status === "active" && <p>The quiz has started.</p>}
                <p className="text-xs text-gray-400 pt-2 border-t">
                  You will automatically enter the quiz when it starts.
                </p>
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 30%, white, transparent 60%)",
                }}
              />
              <div className="relative space-y-3">
                <h3 className="font-semibold tracking-wide text-sm uppercase opacity-80">
                  Quick Tips
                </h3>
                <ul className="text-xs leading-relaxed space-y-1.5">
                  <li>Share the room code with friends to join.</li>
                  <li>Host can remove idle players anytime.</li>
                  <li>Everyone sees the first question at the same time.</li>
                  <li>Stay on this tab for best experience.</li>
                </ul>
              </div>
            </Card>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default WaitingRoomPage;
