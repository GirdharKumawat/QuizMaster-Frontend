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
      <div className="max-w-md mx-auto py-8 space-y-6">
        
        {/* Main Card */}
        <Card className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-center mb-6">
            <h2 className="font-black text-2xl uppercase">Enter Room Code</h2>
            <p className="text-gray-600 text-sm mt-1">Ask the host for the 6-character code</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <Input
                className="w-full border-4 border-black p-2 font-black text-sm text-center tracking-[0.04em] focus:shadow-[4px_4px_0px_0px_#4ADE80] transition-all placeholder:text-gray-300 placeholder:tracking-normal placeholder:text-sm"
                placeholder="696cfae9dsdweffdgf8f336284185d"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value);
                  setError("");
                }}
                
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-2 font-bold text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || roomCode.length < 3}
              className="w-full py-4 bg-[#4ADE80] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none font-black text-xl uppercase disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_#000] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
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

        {/* Tips Card */}
        <Card className="border-2 border-black bg-yellow-50 p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-black text-sm uppercase mb-1">Tips</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Room codes are 6 characters</li>
                <li>• Codes are not case-sensitive</li>
                <li>• Make sure the quiz hasn't started yet</li>
              </ul>
            </div>
          </div>
        </Card>

      </div>
    </Window>
  );
};

export default JoinQuizWindow;
