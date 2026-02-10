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
      shadow-[4px_4px_0px_0px_var(--tw-shadow-color),8px_8px_0px_0px_#000]
      transition-all duration-300 animate-in fade-in slide-in-from-bottom-4
    `}>
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b-2 border-black bg-white/50 select-none">
          <div className="flex items-center gap-2.5">
             <div className="p-1.5 bg-black text-white border-2 border-transparent">
                {Icon ? <Icon size={16} /> : <Star size={16} />}
             </div>
             <h2 className="text-base md:text-lg font-black uppercase tracking-tight">{title}</h2>
          </div>
          {onClose && (
            <button 
                onClick={onClose}
                className="group p-1.5 bg-white border-2 border-black hover:bg-[#FF6B6B] hover:text-white transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000]"
            >
                <X size={18} strokeWidth={3} />
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