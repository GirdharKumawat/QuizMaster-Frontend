import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const NeoModal = ({ isOpen, onClose, title, children, color = "bg-white" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
      // Wait for animation to finish before hiding from DOM
      const timer = setTimeout(() => setIsVisible(false), 300); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with Fade */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />

      {/* Modal Content with Pop Animation */}
      <div 
        className={`
          relative w-full max-w-lg transform transition-all duration-300 ease-out
          ${isAnimating ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'}
          ${color} border-[1.5px] border-gray-900 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.6)] rounded-xl overflow-hidden
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-[1.5px] border-gray-900 bg-white/50">
          <h2 className="text-xl font-bold uppercase tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-black hover:text-white border-[1.5px] border-transparent hover:border-gray-900 rounded transition-all"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default NeoModal;