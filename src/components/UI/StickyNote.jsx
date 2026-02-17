import React from 'react';

const StickyNote = ({ children, className = '', rotate = 'rotate-3' }) => {
  return (
    <div className={`
      relative
      bg-[#FFD028] text-black 
      p-6 w-full max-w-[250px]
      border-[1.5px] border-gray-900
      shadow-[5px_5px_0px_0px_rgba(0,0,0,0.7)]
      flex flex-col items-center justify-center text-center
      transform ${rotate}
      transition-all duration-300 hover:scale-105 hover:rotate-0 hover:z-20
      ${className}
    `}>
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
        <div className="relative">
            <div className="absolute top-2 left-1 w-6 h-6 bg-black/20 rounded-full blur-[1px]"></div>
            <div className="relative w-6 h-6 bg-red-500 rounded-full border-[1.5px] border-gray-900 shadow-[inset_3px_3px_0px_rgba(255,255,255,0.3),inset_-2px_-2px_0px_rgba(0,0,0,0.1)]">
                <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
            </div>
        </div>
      </div>
      <div className="font-bold font-handwriting relative z-0">
        {children}
      </div>
    </div>
  );
};

export default StickyNote;