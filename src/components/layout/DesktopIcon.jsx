import React from 'react';

const DesktopIcon = ({ label, icon: Icon, color, onClick }) => (
  
  <button
    onClick={onClick}
    className="group flex flex-col items-center gap-3 p-4 transition-transform hover:-translate-y-2 focus:outline-none"
  >
    <div
      className={`
      w-20 h-20 md:w-24 md:h-24 flex items-center justify-center 
      ${color} border-2 border-black rounded-2xl
      shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
      group-hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105
      transition-all duration-300
    `}
    >
      <Icon size={40} strokeWidth={2.5} className="text-black" />
    </div>
    <span className="font-black text-sm md:text-base uppercase tracking-wider bg-white border-2 border-black px-3 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      {label}
    </span>
  </button>
);

export default DesktopIcon;