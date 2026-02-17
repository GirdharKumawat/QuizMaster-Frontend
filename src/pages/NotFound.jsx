import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/UI/ui";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6">
      <div className="max-w-lg w-full border-[1.5px] border-gray-900 bg-white p-8 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.6)] text-center space-y-6">
        <div className="text-6xl font-black uppercase tracking-tighter">404</div>
        <p className="text-lg font-semibold text-gray-700">
          This session does not exist or has ended.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-[#FFD028] text-black border-[1.5px] border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-none font-bold uppercase"
          >
            Go Home
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-white text-black border-[1.5px] border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-none font-bold uppercase"
          >
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
