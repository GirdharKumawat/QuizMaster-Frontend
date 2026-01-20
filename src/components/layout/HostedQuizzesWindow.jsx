import React from "react";
import { Crown, FolderOpen, Hash, CheckCircle2 } from "lucide-react";
import Window from "../UI/Window";
import { Button } from "../UI/ui";

const HostedQuizzesWindow = ({ createdQuizzes, onNavigate, onCreateClick, onClose }) => {
  
  
  return (
    <Window title="Hosted Quizzes" icon={Crown} shadowColor="shadow-[#A78BFA]" baseColor="bg-[#F3E8FF]" onClose={onClose}>
      <div className="grid md:grid-cols-2 gap-4">
        {createdQuizzes?.map(q => {
          const isCompleted = q.status === "completed";
          return (
            <div 
              key={q.quiz_id} 
              onClick={() => onNavigate(`/waiting/${q.session_id}`)} 
              className={`relative border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer group ${
                isCompleted 
                  ? "bg-gray-100 opacity-75" 
                  : "bg-white"
              }`}
            >
              {/* Completed Badge */}
              {isCompleted && (
                <div className="absolute -top-2 -right-2 bg-[#4ADE80] border-2 border-black p-1 shadow-[2px_2px_0px_0px_#000] rotate-12">
                  <CheckCircle2 size={16} className="text-black" />
                </div>
              )}
              
              <div className="flex justify-between items-start mb-2">
                <span className={`border-2 border-black text-[10px] font-bold px-2 py-0.5 uppercase ${
                  isCompleted 
                    ? "bg-gray-400 text-white" 
                    : "bg-[#A78BFA] text-white"
                }`}>
                  {q.topic || "General"}
                </span>
                {isCompleted ? (
                  <span className="text-[10px] font-black bg-[#4ADE80] text-black px-2 py-0.5 border border-black">
                    COMPLETED
                  </span>
                ) : (
                  <Hash size={16} />
                )}
              </div>
              <h3 className={`text-xl font-black uppercase truncate ${isCompleted ? "line-through decoration-2" : ""}`}>
                {q.title}
              </h3>
              <div className="mt-4 flex justify-between items-end">
                <p className="font-mono text-xs font-bold bg-yellow-200 px-1 border border-black">
                  ID: {q.session_id}
                </p>
                <span className="text-xs font-black uppercase text-gray-400 group-hover:text-black">
                  {isCompleted ? "Results" : "Manage"} &rarr;
                </span>
              </div>
            </div>
          );
        })}
        {!createdQuizzes?.length && (
          <div className="col-span-full text-center py-12 opacity-60">
            <FolderOpen size={48} className="mx-auto mb-2"/>
            <p className="font-black text-xl">NO HOSTED QUIZZES</p>
            <Button onClick={onCreateClick} className="mt-4 bg-[#A78BFA]">
              Create One
            </Button>
          </div>
        )}
      </div>
    </Window>
  );
};

export default HostedQuizzesWindow;
