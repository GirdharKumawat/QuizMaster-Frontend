import React, { useEffect } from "react";
import { X, AlertTriangle, CheckCircle, Info } from "lucide-react";

/**
 * NEO-BRUTALIST POPUP (MODAL)
 * * Props:
 * - isOpen: boolean (control visibility)
 * - onClose: function (handle closing)
 * - variant: 'info' | 'danger' | 'success'
 * - title: string
 * - message: string (or children)
 * - onConfirm: function (optional, for action button)
 * - confirmText: string (button label)
 */
const Popup = ({
  isOpen,
  onClose,
  variant = "info",
  title = "Notification",
  message = "This is a popup message.",
  onConfirm,
  confirmText = "Okay",
  children
}) => {
  
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // --- STYLES CONFIGURATION ---
  const styles = {
    info: {
      borderColor: "border-black",
      headerBg: "bg-[#A78BFA]", // Purple
      icon: <Info className="text-black" size={28} />,
      buttonBg: "bg-black text-white hover:bg-gray-800",
      shadow: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    },
    danger: {
      borderColor: "border-black",
      headerBg: "bg-[#FF6B6B]", // Red
      icon: <AlertTriangle className="text-black" size={28} />,
      buttonBg: "bg-[#FF6B6B] text-black border-2 border-black hover:bg-red-500",
      shadow: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    },
    success: {
      borderColor: "border-black",
      headerBg: "bg-[#4ADE80]", // Green
      icon: <CheckCircle className="text-black" size={28} />,
      buttonBg: "bg-[#4ADE80] text-black border-2 border-black hover:bg-green-400",
      shadow: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    },
  };

  const currentStyle = styles[variant];

  return (
    // OVERLAY
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      
      {/* MODAL CONTAINER */}
      <div 
        className={`
          relative w-full max-w-md bg-white 
          border-2 border-black 
          ${currentStyle.shadow}
          animate-[scaleIn_0.2s_ease-out]
        `}
      >
        
        {/* HEADER BAR */}
        <div className={`flex items-center justify-between p-4 border-b-2 border-black ${currentStyle.headerBg}`}>
          <div className="flex items-center gap-3">
            {currentStyle.icon}
            <h2 className="text-xl font-black uppercase tracking-tight">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 bg-white border-2 border-black hover:bg-gray-100 transition-transform active:translate-y-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="p-6">
          <div className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
            {children || message}
          </div>

          {/* ACTIONS FOOTER */}
          <div className="flex gap-4 justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 font-bold border-2 border-black bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all"
            >
              Cancel
            </button>
            
            {onConfirm && (
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-6 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all ${currentStyle.buttonBg}`}
              >
                {confirmText}
              </button>
            )}
          </div>
        </div>

        {/* DECORATIVE CORNER (The "Tape" or "Sticker" look) */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-black"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-black"></div>

      </div>
    </div>
  );
};


export const PopupDemo = () => {
  const [openType, setOpenType] = React.useState(null);

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-10 flex flex-col items-center gap-8 font-sans">
      <h1 className="text-3xl font-black uppercase">Popup System</h1>

      <div className="flex flex-wrap gap-4 justify-center">
        {/* BUTTON 1: INFO */}
        <button 
          onClick={() => setOpenType('info')}
          className="px-6 py-3 bg-[#A78BFA] border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
        >
          Open Info
        </button>

        {/* BUTTON 2: DANGER */}
        <button 
          onClick={() => setOpenType('danger')}
          className="px-6 py-3 bg-[#FF6B6B] border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
        >
          Open Danger
        </button>

        {/* BUTTON 3: SUCCESS */}
        <button 
          onClick={() => setOpenType('success')}
          className="px-6 py-3 bg-[#4ADE80] border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
        >
          Open Success
        </button>
      </div>

      {/* RENDER THE POPUPS BASED ON STATE */}
      <Popup 
        isOpen={openType === 'info'} 
        onClose={() => setOpenType(null)}
        variant="info"
        title="Did you know?"
        message="This is a standard popup. Use it for hints, tips, or general information about the quiz."
        onConfirm={() => console.log("Info Confirmed")}
        confirmText="Got it"
      />

      <Popup 
        isOpen={openType === 'danger'} 
        onClose={() => setOpenType(null)}
        variant="danger"
        title="Quit Quiz?"
        message="Are you sure you want to leave? All your progress in this session will be lost permanently."
        onConfirm={() => console.log("Quit Confirmed")}
        confirmText="Yes, Quit"
      />

      <Popup 
        isOpen={openType === 'success'} 
        onClose={() => setOpenType(null)}
        variant="success"
        title="Level Complete!"
        onConfirm={() => console.log("Next Level")}
        confirmText="Next Level"
      >
        {/* Example of passing custom children instead of just a string message */}
        <div className="text-center">
          <div className="text-4xl mb-2">⭐⭐⭐</div>
          <p>You scored <span className="font-black">1,500 points</span>!</p>
          <p className="text-sm opacity-60">New high score!</p>
        </div>
      </Popup>

    </div>
  );
};

export default PopupDemo;