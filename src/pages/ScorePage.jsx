import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/UI/ui";
import { useAuth } from "../features/auth/useAuth";

function ScorePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authState } = useAuth();
  const { role } = authState;

  const score = location.state?.score ?? 0;
  const total = location.state?.total ?? 0;
  const isGuest = role === "guest";

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6">
      <div className="max-w-lg w-full border-2 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] text-center space-y-6">
        <div className="text-3xl md:text-4xl font-black uppercase">Your Score</div>
        <div className="text-6xl font-black">
          {score} / {total}
        </div>

        {isGuest ? (
          <Button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 bg-[#FFD028] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none font-black uppercase"
          >
            Sign Up to Save
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-[#4ADE80] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none font-black uppercase"
          >
            Save to Leaderboard
          </Button>
        )}
      </div>
    </div>
  );
}

export default ScorePage;
