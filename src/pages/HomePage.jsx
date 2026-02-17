import React, { useEffect, useState } from "react";
import {
  DashboardWindow,
  HostedQuizzesWindow,
  EnrolledQuizzesWindow,
  HistoryWindow,
  CreateQuizWindow,
  JoinQuizWindow,
} from "../components/layout/Layout";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Zap,
  PlusSquare,
  DoorOpen,
  Gamepad2,
  Trophy,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useQuiz } from "../features/quiz/useQuiz";
import { useQuizSession } from "../features/quiz/useQuizSession";
import { useAuth } from "../features/auth/useAuth";

const navItems = [
  { id: "home", label: "Dashboard", icon: Gamepad2, color: "bg-[#FFD028]", activeRing: "ring-[#FFD028]" },
  { id: "created", label: "Hosted", icon: Crown, color: "bg-[#A78BFA]", activeRing: "ring-[#A78BFA]" },
  { id: "enrolled", label: "Enrolled", icon: Zap, color: "bg-[#22D3EE]", activeRing: "ring-[#22D3EE]" },
  { id: "history", label: "History", icon: Trophy, color: "bg-[#F472B6]", activeRing: "ring-[#F472B6]" },
  { id: "create", label: "Create", icon: PlusSquare, color: "bg-[#FB923C]", activeRing: "ring-[#FB923C]" },
  { id: "join", label: "Join", icon: DoorOpen, color: "bg-[#4ADE80]", activeRing: "ring-[#4ADE80]" },
];

const HomePage = () => {
  const navigate = useNavigate();

  const { quizState, getAllQuizzes } = useQuiz();
  const { resetSession } = useQuizSession();
  const { authState, logoutUser } = useAuth();
  const { username } = authState;
  const { createdQuizzes, enrolledQuizzes } = quizState;

  const [activeWindow, setActiveWindow] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    resetSession();
    getAllQuizzes();
  }, []);

  // Filter Logic
  const activeEnrolled = enrolledQuizzes?.filter(q => q.status !== "completed") || [];
  const completedEnrolled = enrolledQuizzes?.filter(q => q.status === "completed") || [];
  const completedCreated = createdQuizzes?.filter(q => q.status === "completed") || [];

  const handleNavClick = (id) => {
    setActiveWindow(id);
    setSidebarOpen(false);
  };

  const activeItem = navItems.find(n => n.id === activeWindow);

  return (
    <div className="flex h-screen bg-[#F0F2F5] font-sans overflow-hidden selection:bg-[#FFD028] selection:text-black">

      {/* ========== SIDEBAR ========== */}
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 md:w-72 flex flex-col
          bg-white border-r-[1.5px] border-gray-900
          shadow-[2px_0px_0px_0px_rgba(0,0,0,0.5)]
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b-[1.5px] border-gray-900">
          <div className="bg-[#FFD028] border-[1.5px] border-gray-900 px-3 py-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] -rotate-1">
            <p className="text-xs font-medium uppercase tracking-wide opacity-60">Welcome</p>
            <h2 className="text-base font-bold uppercase tracking-tight truncate">{username}</h2>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {navItems.map(({ id, label, icon: Icon, color, activeRing }) => {
            const isActive = activeWindow === id;
            return (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5
                  border-[1.5px] border-gray-900 font-semibold text-sm uppercase tracking-wide
                  transition-all duration-200 text-left
                  ${isActive
                    ? `${color} shadow-none translate-x-[1.5px] translate-y-[1.5px] ring-2 ${activeRing} ring-offset-1`
                    : "bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)]"
                  }
                `}
              >
                <div className={`w-7 h-7 flex items-center justify-center border-[1.5px] border-gray-900 ${isActive ? "bg-white" : color}`}>
                  <Icon size={14} strokeWidth={2} />
                </div>
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t-[1.5px] border-gray-900">
          <button
            onClick={logoutUser}
            className="
              w-full flex items-center gap-3 px-3 py-2.5
              bg-[#FF6B6B] border-[1.5px] border-gray-900 font-semibold text-sm uppercase tracking-wide
              shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px]
              transition-all active:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px]
            "
          >
            <div className="w-7 h-7 flex items-center justify-center border-[1.5px] border-gray-900 bg-white">
              <LogOut size={14} strokeWidth={2} />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 md:px-8 py-2.5 border-b-[1.5px] border-gray-900 bg-white shrink-0">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 border-[1.5px] border-gray-900 bg-[#FFD028] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] active:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] transition-all"
          >
            <Menu size={18} strokeWidth={2} />
          </button>

          {/* Breadcrumb / Page Title */}
          <div className="flex items-center gap-2">
            {activeItem && (
              <>
                <div className={`w-6 h-6 ${activeItem.color} border-[1.5px] border-gray-900 flex items-center justify-center`}>
                  <activeItem.icon size={13} strokeWidth={2} />
                </div>
                <h1 className="text-base font-bold uppercase tracking-tight">
                  {activeItem.label}
                </h1>
              </>
            )}
          </div>

          {/* Tagline */}
          <p className="hidden lg:block font-semibold text-xs bg-[#F0F2F5] border-[1.5px] border-gray-900 px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
            The ultimate arena for knowledge warriors
          </p>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto h-full">
            {activeWindow === "home" && (
              <DashboardWindow
                username={username}
                createdQuizzes={createdQuizzes}
                enrolledQuizzes={enrolledQuizzes}
                onClose={() => setActiveWindow("home")}
              />
            )}

            {activeWindow === "created" && (
              <HostedQuizzesWindow
                createdQuizzes={createdQuizzes}
                onNavigate={navigate}
                onCreateClick={() => setActiveWindow("create")}
                onClose={() => setActiveWindow("home")}
              />
            )}

            {activeWindow === "enrolled" && (
              <EnrolledQuizzesWindow
                activeEnrolled={activeEnrolled}
                onNavigate={navigate}
                onClose={() => setActiveWindow("home")}
              />
            )}

            {activeWindow === "history" && (
              <HistoryWindow
                completedEnrolled={completedEnrolled}
                completedHosted={completedCreated}
                onNavigate={navigate}
                onClose={() => setActiveWindow("home")}
              />
            )}

            {activeWindow === "create" && (
              <CreateQuizWindow
                onClose={() => setActiveWindow("home")}
              />
            )}

            {activeWindow === "join" && (
              <JoinQuizWindow
                onClose={() => setActiveWindow("home")}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
