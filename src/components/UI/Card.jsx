import React, { useState, useEffect } from "react";
import { X, Square } from "lucide-react";

const Card = ({
  title,
  styleType = "classic", // pop | classic | window
  color = "bg-white",
  className = "",
  animated = false,
  onClose,
  children,
  ...props
}) => {
  const [animate, setAnimate] = useState(!animated);
  const isPop = styleType === "pop";
  const isWindow = styleType === "window";

  useEffect(() => {
    if (animated) {
      requestAnimationFrame(() => setAnimate(true));
    }
  }, [animated]);

  // Window mode - full app window style
  if (isWindow) {
    return (
      <div 
        className={`
          h-full w-full flex flex-col
          border-2 border-black rounded-xl overflow-hidden
          shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
          bg-white
          transition-all duration-500
          ${animated ? (animate ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10') : ''}
          ${className}
        `}
        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        {...props}
      >
        {/* Title Bar (Mac Style) */}
        <div className={`flex items-center justify-between px-4 py-3 border-b-2 border-black ${color}`}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <button 
                onClick={onClose} 
                className="w-3 h-3 rounded-full bg-[#FF6B6B] border border-black hover:bg-red-600 group flex justify-center items-center"
              >
                <X size={8} className="opacity-0 group-hover:opacity-100"/>
              </button>
              <div className="w-3 h-3 rounded-full bg-[#FFD028] border border-black" />
              <div className="w-3 h-3 rounded-full bg-[#34D399] border border-black" />
            </div>
            <span className="font-black text-sm uppercase tracking-wide ml-2 opacity-80">{title}</span>
          </div>
          <div className="flex gap-2">
            <Square size={16} className="opacity-50" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          {/* Background Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
          />
          <div className="relative z-10 h-full">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Standard card modes (pop / classic)
  const baseClasses = `
    relative overflow-hidden p-6 border-2 border-black
    ${isPop ? "rounded-2xl" : "rounded-xl"}
    bg-white 
    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
  `;

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {title && (
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
          <h2 className="text-xl font-black uppercase tracking-tight text-black">
            {title}
          </h2>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-400 border-2 border-black"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-black"></div>
            <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-black"></div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;