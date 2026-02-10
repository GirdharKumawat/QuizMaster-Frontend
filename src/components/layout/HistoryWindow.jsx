import React from "react";
import { Trophy, Crown, Zap, CheckCircle2 } from "lucide-react";
import Window from "../UI/Window";

const CompletedQuizCard = ({ quiz, type, onNavigate }) => (
  <button 
    key={quiz.quiz_id || quiz._id} 
    onClick={() => onNavigate?.(`/waiting/${quiz.session_id}`)}
    className="w-full text-left bg-white border-2 border-black p-4 flex justify-between items-center shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer group"
  >
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-10 h-10 flex items-center justify-center border-2 border-black shrink-0 ${type === 'hosted' ? 'bg-[#A78BFA]' : 'bg-[#22D3EE]'}`}>
        {type === 'hosted' ? <Crown size={18} /> : <Zap size={18} />}
      </div>
      <div className="min-w-0">
        <h3 className="font-black uppercase text-base truncate group-hover:text-[#F472B6] transition-colors">{quiz.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-bold bg-[#4ADE80] text-black px-2 py-0.5 border-2 border-black flex items-center gap-1">
            <CheckCircle2 size={10} /> COMPLETED
          </span>
          <span className="text-xs font-bold text-gray-500 uppercase">
            {type === 'hosted' ? 'You Hosted' : 'You Played'}
          </span>
        </div>
      </div>
    </div>
    <span className="text-xs font-black uppercase text-gray-400 group-hover:text-black whitespace-nowrap ml-2">View &rarr;</span>
  </button>
);

const HistoryWindow = ({ completedEnrolled = [], completedHosted = [], onNavigate, onClose }) => {
  const hasHistory = completedEnrolled.length > 0 || completedHosted.length > 0;

  return (
    <Window title="History" icon={Trophy} shadowColor="shadow-[#F472B6]" baseColor="bg-[#FCE7F3]" onClose={onClose}>
      <div className="space-y-5">
        {/* Completed Hosted Quizzes */}
        {completedHosted.length > 0 && (
          <div>
            <h3 className="font-black text-xs uppercase tracking-wide mb-3 flex items-center gap-2 bg-[#A78BFA] text-black px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <Crown size={14} /> Hosted ({completedHosted.length})
            </h3>
            <div className="space-y-2">
              {completedHosted.map(q => (
                <CompletedQuizCard key={q.quiz_id || q._id} quiz={q} type="hosted" onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Enrolled Quizzes */}
        {completedEnrolled.length > 0 && (
          <div>
            <h3 className="font-black text-xs uppercase tracking-wide mb-3 flex items-center gap-2 bg-[#22D3EE] text-black px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <Zap size={14} /> Played ({completedEnrolled.length})
            </h3>
            <div className="space-y-2">
              {completedEnrolled.map(q => (
                <CompletedQuizCard key={q.quiz_id || q._id} quiz={q} type="enrolled" onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasHistory && (
          <div className="text-center py-10 opacity-60">
            <Trophy size={40} className="mx-auto mb-3"/>
            <p className="font-black text-lg uppercase">No Completed Games</p>
            <p className="font-bold text-sm text-gray-400 mt-2">Complete some quizzes to see your history!</p>
          </div>
        )}
      </div>
    </Window>
  );
};

export default HistoryWindow;
