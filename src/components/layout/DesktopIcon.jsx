import React from 'react';

const DesktopIcon = ({ label, icon: Icon, color, onClick }) => (
  
  <button
    onClick={onClick}
    className="group flex flex-col items-center gap-3 p-4 transition-transform hover:-translate-y-2 focus:outline-none"
  >
    <div
      className={`
      w-20 h-20 md:w-24 md:h-24 flex items-center justify-center 
      ${color} border-[1.5px] border-gray-900 rounded-2xl
      shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] 
      group-hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,0.8)] group-hover:scale-105
      transition-all duration-300
    `}
    >
      <Icon size={36} strokeWidth={2.5} className="text-black" />
    </div>
    <span className="font-bold text-sm md:text-base uppercase tracking-wider bg-white border-[1.5px] border-gray-900 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
      {label}
    </span>
  </button>
);

export default DesktopIcon;