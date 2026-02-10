import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/UI/ui";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6">
      <div className="max-w-lg w-full border-2 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] text-center space-y-6">
        <div className="text-6xl font-black uppercase tracking-tighter">404</div>
        <p className="text-lg font-bold text-gray-700">
          This session does not exist or has ended.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#FFD028] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none font-black uppercase"
          >
            Go Home
          </Button>
          <Button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none font-black uppercase"
          >
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
