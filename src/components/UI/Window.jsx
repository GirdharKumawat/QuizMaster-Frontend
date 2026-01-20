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
      border-2 ${borderColor}
      ${shadowColor} 
      shadow-[6px_6px_0px_0px_var(--tw-shadow-color),10px_10px_0px_0px_#000]
      transition-all duration-300 animate-in fade-in slide-in-from-bottom-4
    `}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b-2 border-black bg-white/50 select-none">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-black text-white border-2 border-transparent shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                {Icon ? <Icon size={20} /> : <Star size={20} />}
             </div>
             <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">{title}</h2>
          </div>
          {onClose && (
            <button 
                onClick={onClose}
                className="group p-2 bg-white border-2 border-black hover:bg-[#FF6B6B] hover:text-white transition-all active:translate-y-1 shadow-[2px_2px_0px_0px_#000]"
            >
                <X size={24} strokeWidth={3} />
            </button>
          )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1 relative">
         <div className="relative z-10 h-full">
            {children}
         </div>
      </div>
    </div>
  );
};
export default Window;