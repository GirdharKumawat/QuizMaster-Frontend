import React, { useEffect, useState } from "react";
import {
  DashboardWindow,
  HostedQuizzesWindow,
  EnrolledQuizzesWindow,
  HistoryWindow,
  CreateQuizWindow,
  JoinQuizWindow,
} from "../components/layout/Layout";
import DesktopIcon from "../components/layout/DesktopIcon";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Zap,
  PlusSquare,
  DoorOpen,
  Gamepad2,
  Trophy,
} from "lucide-react";
import { useQuiz } from "../features/quiz/useQuiz";
import { useQuizSession } from "../features/quiz/useQuizSession";
import { useAuth } from "../features/auth/useAuth";

 
const HomePage = () => {
  const navigate = useNavigate();

  // Logic
  const { quizState, getAllQuizzes } = useQuiz();
  const {resetSession} = useQuizSession();
  const { authState } = useAuth();
  const { username } = authState;
  const { createdQuizzes, enrolledQuizzes } = quizState;

  // Tabs - Show dashboard by default on large screens
  const [activeWindow, setActiveWindow] = useState(() => {
    return window.innerWidth >= 768 ? "home" : null;
  });
    
    

  useEffect(() => {
    resetSession();
    getAllQuizzes();
  }, []);

  // Filter Logic for Enrolled Quizzes as well as for created quizzes
  const activeEnrolled = enrolledQuizzes?.filter(q => q.status !== "completed") || [];
  const completedEnrolled = enrolledQuizzes?.filter(q => q.status === "completed") || [];
  const activeCreated = createdQuizzes?.filter(q => q.status !== "completed") || [];
  const completedCreated = createdQuizzes?.filter(q => q.status === "completed") || [];  


  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F0F2F5] font-sans overflow-hidden selection:bg-[#FFD028] selection:text-black">
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        {/* --- HEADER --- */}
        <div className="max-w-5xl  mb-4 text-center md:text-left">
          <div className="inline-block bg-[#FFD028] border-2 border-black px-6 py-2 shadow-[4px_4px_0px_0px_#000] mb-4 -rotate-1">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
              Welcomee, {username}!
            </h1>
          </div>
          <br />

          <p className="font-bold text-lg md:text-xl bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] inline-block max-w-2xl">
            The ultimate arena for knowledge warriors.
          </p>
        </div>

        {/* --- DYNAMIC CONTENT --- */}
        <div className="max-w-6xl min-h-[500px] flex flex-col md:flex-row gap-6">
          {/* Desktop Icons Sidebar - Hidden on small screens when window is open */}
          <div className={`shrink-0 ${activeWindow ? 'hidden md:block' : 'block'}`}>
            <div className="grid grid-cols-3 md:grid-cols-2 gap-4 transition-all duration-300">
              <DesktopIcon
                label="Home"
                icon={Gamepad2}
                color="bg-[#FFD028]"
                onClick={() => setActiveWindow("home")}
              />
              <DesktopIcon
                label="Hosted"
                icon={Crown}
                color="bg-[#A78BFA]"
                onClick={() => setActiveWindow("created")}
              />
              <DesktopIcon
                label="Enrolled"
                icon={Zap}
                color="bg-[#22D3EE]"
                onClick={() => setActiveWindow("enrolled")}
              />
              <DesktopIcon
                label="History"
                icon={Trophy}
                color="bg-[#F472B6]"
                onClick={() => setActiveWindow("history")}
              />
              <DesktopIcon
                label="Create"
                icon={PlusSquare}
                color="bg-[#FB923C]"
                onClick={() => setActiveWindow("create")}
              />
              <DesktopIcon
                label="Join"
                icon={DoorOpen}
                color="bg-[#4ADE80]"
                onClick={() => setActiveWindow("join")}
              />
            </div>
          </div>

          {/* Window Content Area */}
          <div className="flex-1 min-w-0 md:ms-20">
            {/* 1. HOME (Overview) */}
            {activeWindow === "home" && (
              <DashboardWindow
                username={username}
                createdQuizzes={createdQuizzes}
                enrolledQuizzes={enrolledQuizzes}
                onClose={() => setActiveWindow(null)}
              />
            )}

            {/* 2. HOSTED QUIZZES */}
            {activeWindow === "created" && (
              <HostedQuizzesWindow
                createdQuizzes={createdQuizzes}
                onNavigate={navigate}
                onCreateClick={() => setActiveWindow("create")}
                onClose={() => setActiveWindow(null)}
              />
            )}

            {/* 3. ENROLLED QUIZZES (Active) */}
            {activeWindow === "enrolled" && (
              <EnrolledQuizzesWindow
                activeEnrolled={activeEnrolled}
                onNavigate={navigate}
                onClose={() => setActiveWindow(null)}
              />
            )}

            {/* 4. HISTORY (Completed) */}
            {activeWindow === "history" && (
              <HistoryWindow 
                completedEnrolled={completedEnrolled}
                completedHosted={completedCreated}
                onNavigate={navigate}
                onClose={() => setActiveWindow(null)}
              />
            )}

            {/* 5. CREATE QUIZ */}
            {activeWindow === "create" && (
              <CreateQuizWindow
                onClose={() => setActiveWindow(null)}
              />
            )}

            {/* 6. JOIN QUIZ */}
            {activeWindow === "join" && (
              <JoinQuizWindow
                onClose={() => setActiveWindow(null)}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
