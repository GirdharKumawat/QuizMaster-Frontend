import React, { useState } from "react";
import { LogIn, Lightbulb, Loader2 } from "lucide-react";
import Window from "../UI/Window";
import { Input, Button, Card } from "../UI/ui";
import { useQuiz } from "../../features/quiz/useQuiz";
import { useNavigate } from "react-router-dom";

const JoinQuizWindow = ({ onClose }) => {
  const navigate = useNavigate();
  const { joinQuiz } = useQuiz();

  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e) => {
    e?.preventDefault();
    
    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await joinQuiz(roomCode.trim());
      if (result) {
        navigate(`/waiting/${result.session_id}`);
      }
    } catch (err) {
      setError(err?.message || "Failed to join quiz. Check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Window title="Join Quiz" icon={LogIn} shadowColor="shadow-[#4ADE80]" baseColor="bg-[#DCFCE7]" onClose={onClose}>
      <div className="max-w-md mx-auto py-6 space-y-5">
        
        {/* Main Card */}
        <Card className="border-2 border-black bg-white p-5 shadow-[3px_3px_0px_0px_#000]">
          <div className="text-center mb-5">
            <h2 className="font-black text-lg uppercase">Enter Room Code</h2>
            <p className="text-gray-500 text-xs font-bold mt-1">Ask the host for the room code</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <Input
                className="w-full border-2 border-black p-2.5 font-black text-sm text-center tracking-[0.04em] focus:shadow-[3px_3px_0px_0px_#4ADE80] transition-all placeholder:text-gray-300 placeholder:tracking-normal placeholder:text-sm"
                placeholder="Enter room code here..."
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value);
                  setError("");
                }}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-black text-red-700 px-3 py-2 font-bold text-xs">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || roomCode.length < 3}
              className="w-full py-3 bg-[#4ADE80] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-none font-black text-base uppercase disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[3px_3px_0px_0px_#000] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={24} />
                  Joining...
                </span>
              ) : (
                "Join Quiz"
              )}
            </Button>
          </form>
        </Card>

       

      </div>
    </Window>
  );
};

export default JoinQuizWindow;
