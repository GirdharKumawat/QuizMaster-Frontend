import { Crown, FolderOpen, Hash, CheckCircle2 } from "lucide-react";
import Window from "../UI/Window";
import { Button } from "../UI/ui";

const HostedQuizzesWindow = ({ createdQuizzes, onNavigate, onCreateClick, onClose }) => {
      
    // sort by status: ongoing first, completed last
    const sortedQuizzes = [...(createdQuizzes || [])].sort((a, b) => {
      if (a.status === b.status) return 0;
      if (a.status === "completed") return 1;
      return -1;
    });

  return (
    <Window title="Hosted Quizzes" icon={Crown} shadowColor="shadow-[#A78BFA]" baseColor="bg-[#F3E8FF]" onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sortedQuizzes?.map(q => {
          const isCompleted = q.status === "completed";
          return (
            <button 
              key={q.quiz_id} 
              onClick={() => onNavigate(`/waiting/${q.session_id}`)} 
              className={`relative text-left border-[1.5px] border-gray-900 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px] transition-all cursor-pointer group ${
                isCompleted 
                  ? "bg-gray-100 opacity-75" 
                  : "bg-white"
              }`}
            >
              {/* Completed Badge */}
              {isCompleted && (
                <div className="absolute -top-2 -right-2 bg-[#4ADE80] border-[1.5px] border-gray-900 p-1 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,0.5)] rotate-12">
                  <CheckCircle2 size={14} className="text-black" />
                </div>
              )}
              
              <div className="flex justify-between items-start mb-2 gap-2">
                <span className={`border-[1.5px] border-gray-900 text-xs font-semibold px-2 py-0.5 uppercase truncate max-w-[50%] ${
                  isCompleted 
                    ? "bg-gray-400 text-white" 
                    : "bg-[#A78BFA] text-white"
                }`}>
                  {q.topic || "General"}
                </span>
                {isCompleted ? (
                  <span className="text-xs font-bold bg-[#4ADE80] text-black px-2 py-0.5 border-[1.5px] border-gray-900 whitespace-nowrap">
                    COMPLETED
                  </span>
                ) : (
                  <Hash size={14} className="flex-shrink-0" />
                )}
              </div>
              <h3 className={`text-base font-bold uppercase truncate ${isCompleted ? "line-through decoration-2" : ""}`}>
                {q.title}
              </h3>
              <div className="mt-3 flex justify-between items-end gap-2">
                <p className="font-mono text-xs font-semibold bg-yellow-200 px-1.5 py-0.5 border-[1.5px] border-gray-900 truncate max-w-[60%]">
                  Code: {q.join_code || q.session_id}
                </p>
                <span className="text-xs font-bold uppercase text-gray-400 group-hover:text-black whitespace-nowrap">
                  {isCompleted ? "Results" : "Manage"} &rarr;
                </span>
              </div>
            </button>
          );
        })}
        {!sortedQuizzes?.length && (
          <div className="col-span-full text-center py-10 opacity-60">
            <FolderOpen size={40} className="mx-auto mb-3"/>
            <p className="font-bold text-lg uppercase">No Hosted Quizzes</p>
            <Button onClick={onCreateClick} className="mt-4 bg-[#A78BFA] text-sm">
              Create One
            </Button>
          </div>
        )}
      </div>
    </Window>
  );
};

export default HostedQuizzesWindow;
 