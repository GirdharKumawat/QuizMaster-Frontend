import React from 'react';

const Logo = ({ 
  variant = 'full', // 'full' (icon + text) | 'icon' (just the mark)
  size = 'md',      // 'sm' | 'md' | 'lg'
  className = ''
}) => {
  
  // Size definitions for scaling
  const sizes = {
    sm: { container: 'h-10 px-3 gap-2', icon: 24, text: 'text-lg' },
    md: { container: 'h-14 px-4 gap-3', icon: 32, text: 'text-2xl' },
    lg: { container: 'h-20 px-6 gap-4', icon: 48, text: 'text-4xl' },
  };
  const s = sizes[size];

  // The chunky SVG Icon (Q with a crown)
  const QMark = ({ iconSize }) => (
    <svg 
      width={iconSize} 
      height={iconSize} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      // Important: Use thick strokes for brutalism
      className="stroke-black stroke-[4px]" 
    >
      {/* The Crown (Yellow fill) */}
      <path 
        d="M20 35L30 15L50 25L70 15L80 35H20Z" 
        fill="#FFD028" // Classic Yellow
        strokeLinejoin="round"
      />
      {/* The 'Q' Body (White fill) */}
      <path 
        d="M50 95C72.0914 95 90 77.0914 90 55C90 32.9086 72.0914 15 50 15C27.9086 15 10 32.9086 10 55C10 77.0914 27.9086 95 50 95Z" 
        fill="white"
      />
      {/* The 'Q' Inner hole (Purple fill to match bg) */}
      <circle cx="50" cy="55" r="15" fill="#8B5CF6" />
      {/* The 'Q' Tail (Pink fill) */}
      <rect 
        x="65" y="75" width="20" height="10" 
        transform="rotate(45 65 75)" 
        fill="#F472B6" 
      />
    </svg>
  );

  return (
    <div className={`
        inline-flex items-center font-black uppercase tracking-tighter
        bg-[#8B5CF6] text-white
        neo-border neo-shadow shape-pop
        select-none transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000]
        ${s.container}
        ${className}
    `}>
      <div className="relative z-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
         <QMark iconSize={s.icon} />
      </div>
      
      {variant === 'full' && (
        <span className={s.text}>
          Quiz<span className="text-[#FFD028]">Master</span>
        </span>
      )}
    </div>
  );
};

export default Logo;