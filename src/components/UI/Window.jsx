import React from "react";
import { Star, X } from "lucide-react";

const Window = ({ 
  title, 
  children, 
  baseColor = "bg-white",
  shadowColor = "shadow-black", 
  borderColor = "border-black", 
  icon: Icon, 
  onClose 
}) => {
  return (
    <div className={`
      w-full h-full flex flex-col ${baseColor}
      border-[1.5px] ${borderColor}
      ${shadowColor} 
      shadow-[3px_3px_0px_0px_var(--tw-shadow-color),5px_5px_0px_0px_rgba(0,0,0,0.7)]
      transition-all duration-300 animate-in fade-in slide-in-from-bottom-4
    `}>
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2.5 border-b-[1.5px] border-gray-900 bg-white/50 select-none">
          <div className="flex items-center gap-2.5">
             <div className="p-1.5 bg-black text-white border-[1.5px] border-transparent">
                {Icon ? <Icon size={15} /> : <Star size={15} />}
             </div>
             <h2 className="text-base md:text-lg font-bold uppercase tracking-tight">{title}</h2>
          </div>
          {onClose && (
            <button 
                onClick={onClose}
                className="group p-1.5 bg-white border-[1.5px] border-gray-900 hover:bg-[#FF6B6B] hover:text-white transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.7)]"
            >
                <X size={16} strokeWidth={2.5} />
            </button>
          )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 overflow-y-auto custom-scrollbar flex-1 relative">
         <div className="relative z-10 h-full">
            {children}
         </div>
      </div>
    </div>
  );
};
export default Window;