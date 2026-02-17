import React from "react";
import { Home, Trophy, Zap, Crown, Clock, Target } from "lucide-react";
import Window from "../UI/Window";
import { useNavigate } from "react-router-dom";

const getDiffColor = (diff) => {
  switch(diff) {
    case 'easy': return 'bg-[#4ADE80]';
    case 'medium': return 'bg-[#FFD028]';
    case 'hard': return 'bg-[#F87171]';
    default: return 'bg-gray-300';
  }
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`${color} border-[1.5px] border-gray-900 p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] flex items-center gap-3 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all`}>
    <div className="w-9 h-9 bg-white border-[1.5px] border-gray-900 flex items-center justify-center">
      <Icon size={16} strokeWidth={2} />
    </div>
    <div>
      <p className="text-xl font-bold leading-none">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wide opacity-70 mt-0.5">{label}</p>
    </div>
  </div>
);

const DashboardWindow = ({ username, createdQuizzes, enrolledQuizzes, onClose }) => {

  const navigate = useNavigate();
  const completedQuizzes = enrolledQuizzes?.filter(q => q.status === 'completed') || [];
  const activeQuizzes = enrolledQuizzes?.filter(q => q.status !== 'completed') || [];
  
  // Get recent quizzes (last 3)
  const recentHosted = createdQuizzes?.slice(0, 3) || [];
  const recentEnrolled = activeQuizzes?.slice(0, 3) || [];

  return (
    <Window title="Dashboard" icon={Home} shadowColor="shadow-[#FFD028]" baseColor="bg-[#FFFBEB]" onClose={onClose}>
      <div className="space-y-5">

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Crown} label="Hosted" value={createdQuizzes?.length || 0} color="bg-[#A78BFA]" />
          <StatCard icon={Zap} label="Active" value={activeQuizzes.length} color="bg-[#22D3EE]" />
          <StatCard icon={Trophy} label="Completed" value={completedQuizzes.length} color="bg-[#4ADE80]" />
          <StatCard icon={Target} label="Total Played" value={enrolledQuizzes?.length || 0} color="bg-[#F472B6]" />
        </div>

        {/* Recent Activity Section */}
        <div className="space-y-4">
          {/* Recently Hosted */}
          <div className="border-[1.5px] border-gray-900 bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
            <h3 className="font-bold text-xs uppercase tracking-wide mb-3 flex items-center gap-2">
              <Crown size={14} className="text-[#A78BFA]" /> Your Recent Quizzes
            </h3>
            {recentHosted.length > 0 ? (
              <div className="space-y-2">
                {recentHosted.map((quiz, idx) => (
                  <button key={quiz._id || idx} className="w-full flex items-center justify-between p-2.5 border-[1.5px] border-gray-900 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
                   onClick={() => navigate(`/waiting/${quiz.session_id}`)}>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#A78BFA] border-[1.5px] border-gray-900 flex items-center justify-center text-xs font-bold text-white">{idx + 1}</span>
                      <span className="font-semibold text-sm truncate max-w-[180px]">{quiz.title}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 border-[1.5px] border-gray-900 ${getDiffColor(quiz.difficulty)}`}>
                      {quiz.difficulty?.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 font-medium text-sm text-center py-4">No quizzes created yet. Start hosting!</p>
            )}
          </div>

          {/* Active Enrollments */}
          <div className="border-[1.5px] border-gray-900 bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
            <h3 className="font-bold text-xs uppercase tracking-wide mb-3 flex items-center gap-2">
              <Zap size={14} className="text-[#22D3EE]" /> Active Quizzes
            </h3>
            {recentEnrolled.length > 0 ? (
              <div className="space-y-2">
                {recentEnrolled.map((quiz, idx) => (
                  <button key={quiz._id || idx}
                   onClick={() => navigate(`/waiting/${quiz.session_id}`)} 
                  className="w-full flex items-center justify-between p-2.5 border-[1.5px] border-gray-900 bg-cyan-50 hover:bg-cyan-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#22D3EE] border-[1.5px] border-gray-900 flex items-center justify-center text-xs font-bold text-white">{idx + 1}</span>
                      <span className="font-semibold text-sm truncate max-w-[180px]">{quiz.title}</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 border-[1.5px] border-gray-900 bg-white flex items-center gap-1">
                      <Clock size={12} /> {quiz.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 font-medium text-sm text-center py-4">No active quizzes. Join one now!</p>
            )}
          </div>
        </div>
      </div>
    </Window>
  );
};

export default DashboardWindow;
