import { Crown, FolderOpen, Hash, CheckCircle2 } from "lucide-react";
import Window from "../UI/Window";
import { Button } from "../UI/ui";

const HostedQuizzesWindow = ({ createdQuizzes, onNavigate, onCreateClick, onClose }) => {
      
    // sort the by status: ongoing first, completed last
    const sortedQuizzes = [...(createdQuizzes || [])].sort((a, b) => {
      if (a.status === b.status) return 0;
      if (a.status === "completed") return 1;
      return -1;
    });

  
  return (
    <Window title="Hosted Quizzes" icon={Crown} shadowColor="shadow-[#A78BFA]" baseColor="bg-[#F3E8FF]" onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[60vh] sm:max-h-none overflow-y-auto">
        {sortedQuizzes?.map(q => {
          const isCompleted = q.status === "completed";
          return (
            <button 
              key={q.quiz_id} 
              onClick={() => onNavigate(`/waiting/${q.session_id}`)} 
              className={`relative border-2 border-black p-3 sm:p-4 shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] sm:hover:shadow-none sm:hover:translate-x-[2px] sm:hover:translate-y-[2px] transition-all cursor-pointer group ${
                isCompleted 
                  ? "bg-gray-100 opacity-75" 
                  : "bg-white"
              }`}
            >
              {/* Completed Badge */}
              {isCompleted && (
                <div className="absolute -top-2 -right-2 bg-[#4ADE80] border-2 border-black p-1 shadow-[2px_2px_0px_0px_#000] rotate-12">
                  <CheckCircle2 size={14} className="text-black sm:w-4 sm:h-4" />
                </div>
              )}
              
              <div className="flex justify-between items-start mb-2 gap-2">
                <span className={`border-2 border-black text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 uppercase truncate max-w-[50%] ${
                  isCompleted 
                    ? "bg-gray-400 text-white" 
                    : "bg-[#A78BFA] text-white"
                }`}>
                  {q.topic || "General"}
                </span>
                {isCompleted ? (
                  <span className="text-[9px] sm:text-[10px] font-black bg-[#4ADE80] text-black px-1.5 sm:px-2 py-0.5 border border-black whitespace-nowrap">
                    COMPLETED
                  </span>
                ) : (
                  <Hash size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                )}
              </div>
              <h3 className={`text-base sm:text-xl font-black uppercase truncate ${isCompleted ? "line-through decoration-2" : ""}`}>
                {q.title}
              </h3>
              <div className="mt-3 sm:mt-4 flex justify-between items-end gap-2">
                <p className="font-mono text-[10px] sm:text-xs font-bold bg-yellow-200 px-1 border border-black truncate max-w-[60%]">
                  ID: {q.session_id}
                </p>
                <span className="text-[10px] sm:text-xs font-black uppercase text-gray-400 group-hover:text-black whitespace-nowrap">
                  {isCompleted ? "Results" : "Manage"} &rarr;
                </span>
              </div>
            </button>
          );
        })}
        {!sortedQuizzes?.length && (
          <div className="col-span-full text-center py-8 sm:py-12 opacity-60">
            <FolderOpen size={40} className="mx-auto mb-2 sm:w-12 sm:h-12"/>
            <p className="font-black text-lg sm:text-xl">NO HOSTED QUIZZES</p>
            <Button onClick={onCreateClick} className="mt-3 sm:mt-4 bg-[#A78BFA] text-sm sm:text-base">
              Create One
            </Button>
          </div>
        )}
      </div>
    </Window>
  );
};

export default HostedQuizzesWindow;
 