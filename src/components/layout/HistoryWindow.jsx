import React from "react";
import { Trophy, Crown, Zap, CheckCircle2 } from "lucide-react";
import Window from "../UI/Window";

const CompletedQuizCard = ({ quiz, type, onNavigate }) => (
  <div 
    key={quiz.quiz_id || quiz._id} 
    onClick={() => onNavigate?.(`/waiting/${quiz.session_id}`)}
    className="bg-white border-2 border-black p-4 flex justify-between items-center shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer group"
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 flex items-center justify-center border-2 border-black ${type === 'hosted' ? 'bg-[#A78BFA]' : 'bg-[#22D3EE]'}`}>
        {type === 'hosted' ? <Crown size={20} /> : <Zap size={20} />}
      </div>
      <div>
        <h3 className="font-black uppercase text-lg group-hover:text-[#F472B6] transition-colors">{quiz.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold bg-[#4ADE80] text-black px-2 py-0.5 border border-black flex items-center gap-1">
            <CheckCircle2 size={10} /> COMPLETED
          </span>
          <span className="text-[10px] font-bold text-gray-500 uppercase">
            {type === 'hosted' ? 'You Hosted' : 'You Played'}
          </span>
        </div>
      </div>
    </div>
    <div className="text-right">
      <span className="text-xs font-black uppercase text-gray-400 group-hover:text-black">View Results &rarr;</span>
    </div>
  </div>
);

const HistoryWindow = ({ completedEnrolled = [], completedHosted = [], onNavigate, onClose }) => {
  const hasHistory = completedEnrolled.length > 0 || completedHosted.length > 0;

  return (
    <Window title="History" icon={Trophy} shadowColor="shadow-[#F472B6]" baseColor="bg-[#FCE7F3]" onClose={onClose}>
      <div className="space-y-6">
        {/* Completed Hosted Quizzes */}
        {completedHosted.length > 0 && (
          <div>
            <h3 className="font-black text-sm uppercase mb-3 flex items-center gap-2 bg-[#A78BFA] text-black px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <Crown size={16} /> Completed Hosted ({completedHosted.length})
            </h3>
            <div className="space-y-3">
              {completedHosted.map(q => (
                <CompletedQuizCard key={q.quiz_id || q._id} quiz={q} type="hosted" onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Enrolled Quizzes */}
        {completedEnrolled.length > 0 && (
          <div>
            <h3 className="font-black text-sm uppercase mb-3 flex items-center gap-2 bg-[#22D3EE] text-black px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <Zap size={16} /> Completed Played ({completedEnrolled.length})
            </h3>
            <div className="space-y-3">
              {completedEnrolled.map(q => (
                <CompletedQuizCard key={q.quiz_id || q._id} quiz={q} type="enrolled" onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasHistory && (
          <div className="text-center py-12 opacity-60">
            <Trophy size={48} className="mx-auto mb-2"/>
            <p className="font-black text-xl">NO COMPLETED GAMES</p>
            <p className="font-bold text-sm text-gray-500 mt-2">Complete some quizzes to see your history!</p>
          </div>
        )}
      </div>
    </Window>
  );
};

export default HistoryWindow;
