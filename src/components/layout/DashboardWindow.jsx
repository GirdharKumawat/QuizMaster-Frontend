import React from "react";
import { Home, Trophy, Zap, Crown, TrendingUp, Clock, Target } from "lucide-react";
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

const StatCard = ({ icon: Icon,  label,value, color, }) => (
  <div className={`${color} border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000] flex items-center gap-3 hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all`}>
    <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center">
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <div>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wide opacity-80">{label}</p>
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
    <Window title="Dashboard Overview" icon={Home} shadowColor="shadow-[#FFD028]" baseColor="bg-[#FFFBEB]" onClose={onClose}>
      <div className="space-y-6">
        {/* Welcome Banner */}
        

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2  gap-4">
          <StatCard icon={Crown} label="Hosted" value={createdQuizzes?.length || 0} color="bg-[#A78BFA]" />
          <StatCard icon={Zap} label="Active" value={activeQuizzes.length} color="bg-[#22D3EE]" />
          <StatCard icon={Trophy} label="Completed" value={completedQuizzes.length} color="bg-[#4ADE80]" />
          <StatCard icon={Target} label="Total Played" value={enrolledQuizzes?.length || 0} color="bg-[#F472B6]" />
        </div>

        {/* Recent Activity Section */}
        <div className="grid md:grid-cols-1 gap-4">
          {/* Recently Hosted */}
          <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
            <h3 className="font-black text-sm uppercase mb-3 flex items-center gap-2">
              <Crown size={16} className="text-[#A78BFA]" /> Your Recent Quizzes
            </h3>
            {recentHosted.length > 0 ? (
              <div className="space-y-2">
                {recentHosted.map((quiz, idx) => (
                  <button key={quiz._id || idx} className="flex items-center justify-between p-2 border-2 border-black bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
                   onClick={() => navigate(`/waiting/${quiz.session_id}`)}>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#A78BFA] border border-black flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                      <span className="font-bold text-sm truncate max-w-[150px]">{quiz.title}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 border border-black ${getDiffColor(quiz.difficulty)}`}>
                      {quiz.difficulty?.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 font-bold text-sm text-center py-4">No quizzes created yet. Start hosting!</p>
            )}
          </div>

          {/* Active Enrollments */}
          <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
            <h3 className="font-black text-sm uppercase mb-3 flex items-center gap-2">
              <Zap size={16} className="text-[#22D3EE]" /> Active Quizzes
            </h3>
            {recentEnrolled.length > 0 ? (
              <div className="space-y-2">
                {recentEnrolled.map((quiz, idx) => (
                  <button key={quiz._id || idx}
                   onClick={() => navigate(`/waiting/${quiz.session_id}`)} 
                  className="flex items-center justify-between p-2 border-2 border-black bg-cyan-50 hover:bg-cyan-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#22D3EE] border border-black flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                      <span className="font-bold text-sm truncate max-w-[150px]">{quiz.title}</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 border border-black bg-white flex items-center gap-1">
                      <Clock size={12} /> {quiz.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 font-bold text-sm text-center py-4">No active quizzes. Join one now!</p>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="border-2 border-black bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] p-4 shadow-[4px_4px_0px_0px_#000]">
          <h3 className="font-black text-sm uppercase mb-2 flex items-center gap-2">
            <TrendingUp size={16} /> Pro Tips
          </h3>
          <ul className="text-sm font-bold space-y-1">
            <li>💡 Create quizzes with varied difficulty to engage all players</li>
            <li>🎯 Join quizzes early to secure your spot</li>
            <li>🏆 Check the leaderboard after each quiz to see your ranking</li>
          </ul>
        </div>
      </div>
    </Window>
  );
};

export default DashboardWindow;
