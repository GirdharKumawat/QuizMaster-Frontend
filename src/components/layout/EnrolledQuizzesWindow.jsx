import React from "react";
import { Zap, Clock } from "lucide-react";
import Window from "../UI/Window";

const EnrolledQuizzesWindow = ({ activeEnrolled, onNavigate, onClose }) => {
  return (
    <Window title="Enrolled Quizzes" icon={Zap} shadowColor="shadow-[#22D3EE]" baseColor="bg-[#ECFEFF]" onClose={onClose}>
      <div className="grid md:grid-cols-2 gap-4">
        {activeEnrolled.length > 0 ? activeEnrolled.map(q => (
          <div 
            key={q.quiz_id} 
            onClick={() => onNavigate(`/waiting/${q.session_id}`)} 
            className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000] hover:bg-[#22D3EE] transition-colors cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-2xl border-2 border-transparent">
                Q
              </div>
              <div>
                <h3 className="text-lg font-black uppercase leading-none">{q.title}</h3>
                <p className="text-xs font-bold mt-1 uppercase flex items-center gap-1">
                  <Clock size={12}/> Waiting for Host
                </p>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-12 opacity-60">
            <Zap size={48} className="mx-auto mb-2"/>
            <p className="font-black text-xl">NO ACTIVE ENROLLMENTS</p>
          </div>
        )}
      </div>
    </Window>
  );
};

export default EnrolledQuizzesWindow;
