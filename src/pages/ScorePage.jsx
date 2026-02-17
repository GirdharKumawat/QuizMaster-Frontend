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
      <div className="max-w-lg w-full border-[1.5px] border-gray-900 bg-white p-8 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.6)] text-center space-y-6">
        <div className="text-3xl md:text-4xl font-black uppercase">Your Score</div>
        <div className="text-6xl font-bold">
          {score} / {total}
        </div>

        {isGuest ? (
          <Button
            onClick={() => navigate("/signup")}
            className="px-5 py-2.5 bg-[#FFD028] text-black border-[1.5px] border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-none font-bold uppercase"
          >
            Sign Up to Save
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-[#4ADE80] text-black border-[1.5px] border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-none font-bold uppercase"
          >
            Save to Leaderboard
          </Button>
        )}
      </div>
    </div>
  );
}

export default ScorePage;
