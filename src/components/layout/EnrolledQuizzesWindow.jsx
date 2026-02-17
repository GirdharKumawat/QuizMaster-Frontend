import React from "react";
import { Zap, Clock } from "lucide-react";
import Window from "../UI/Window";

const EnrolledQuizzesWindow = ({ activeEnrolled, onNavigate, onClose }) => {
  return (
    <Window title="Enrolled Quizzes" icon={Zap} shadowColor="shadow-[#22D3EE]" baseColor="bg-[#ECFEFF]" onClose={onClose}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activeEnrolled.length > 0 ? activeEnrolled.map(q => (
          <button 
            key={q.quiz_id} 
            onClick={() => onNavigate(`/waiting/${q.session_id}`)} 
            className="text-left bg-white border-[1.5px] border-gray-900 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-black text-white flex items-center justify-center font-bold text-base border-[1.5px] border-transparent shrink-0">
                Q
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold uppercase leading-tight truncate">{q.title}</h3>
                <p className="text-xs font-medium mt-1 uppercase flex items-center gap-1 text-gray-500">
                  <Clock size={12}/> Waiting for Host
                </p>
              </div>
            </div>
          </button>
        )) : (
          <div className="col-span-full text-center py-10 opacity-60">
            <Zap size={40} className="mx-auto mb-3"/>
            <p className="font-bold text-lg uppercase">No Active Enrollments</p>
          </div>
        )}
      </div>
    </Window>
  );
};

export default EnrolledQuizzesWindow;
