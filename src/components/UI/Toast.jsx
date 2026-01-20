import React, { useState, useEffect } from "react";
import { X, Check, AlertTriangle, Info, Loader2 } from "lucide-react";

// --- 1. THE EVENT BUS (Logic) ---
const toastParams = {
  listeners: [],
  notify(event) {
    this.listeners.forEach((l) => l(event));
  },
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },
};

// --- 2. EXPORTED TRIGGERS ---
export const toast = {
  success: (msg) => trigger(msg, "success"),
  error: (msg) => trigger(msg, "error"),
  loading: (msg) => trigger(msg, "loading"),
  info: (msg) => trigger(msg, "info"),
  dismiss: (id) => trigger(null, "dismiss", id),
  promise: async (promise, messages) => {
    const id = toast.loading(messages.loading);
    try {
      const result = await promise;
      toast.dismiss(id);
      toast.success(messages.success);
      return result;
    } catch (error) {
      toast.dismiss(id);
      toast.error(messages.error);
      throw error;
    }
  },
};

const trigger = (message, type, id = null) => {
  const newId = id || Date.now() + Math.random();
  toastParams.notify({ id: newId, type, message });
  return newId;
};

// --- 3. THE TOASTER COMPONENT ---
export const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return toastParams.subscribe((event) => {
      // If "dismiss" is called, we don't delete immediately.
      // We mark it as 'closing' so the animation can play first.
      if (event.type === "dismiss") {
        setToasts((prev) =>
          prev.map((t) => (t.id === event.id ? { ...t, isClosing: true } : t))
        );
        return;
      }

      // Add new toast
      setToasts((prev) => [...prev, { ...event, isClosing: false }]);
    });
  }, []);

  // This function actually removes it from the array AFTER animation
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to trigger the close animation from inside the item (auto-close)
  const markAsClosing = (id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isClosing: true } : t))
    );
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col items-end gap-4 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem 
          key={t.id} 
          {...t} 
          onClose={() => markAsClosing(t.id)} 
          onRemove={() => removeToast(t.id)} 
        />
      ))}
    </div>
  );
};

// --- 4. INDIVIDUAL TOAST ITEM ---
const ToastItem = ({ id, type, message, isClosing, onClose, onRemove }) => {
  const styles = {
    success: { bg: "bg-[#4ADE80]", icon: <Check strokeWidth={3} /> },
    error: { bg: "bg-[#FF6B6B]", icon: <X strokeWidth={3} /> },
    loading: { bg: "bg-[#FFD93D]", icon: <Loader2 className="animate-spin" /> },
    info: { bg: "bg-[#e2b13f]", icon: <Info strokeWidth={3} /> },
  };

  const style = styles[type] || styles.info;

  // Auto-close timer
  useEffect(() => {
    if (type !== "loading") {
      const timer = setTimeout(() => {
        onClose(); // Trigger the closing animation
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  // When animation finishes, if it was closing, remove it completely
  const handleAnimationEnd = () => {
    if (isClosing) {
      onRemove();
    }
  };

  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      className={`
        pointer-events-auto
        flex items-center gap-3 px-5 py-4
        min-w-[300px] max-w-sm
        border-2 border-black 
        ${style.bg}
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        /* Animation Classes */
        ${isClosing ? "animate-slide-out-right" : "animate-slide-in-right"}
      `}
    >
      <div className="text-black">{style.icon}</div>
      <div className="flex-1">
        <p className="text-l text-black font-medium">
          {typeof message === 'string' ? message : message?.title || ''}
        </p>
        {typeof message === 'object' && message?.detail && (
          <p className="text-sm text-black mt-1">{message.detail}</p>
        )}
      </div>

      {/* Close button (optional) */}
      <button onClick={onClose} className="ml-auto text-black opacity-60 hover:opacity-100">
        <X size={16} />
      </button>

      {/* INJECTED STYLES FOR ANIMATION (No external CSS file needed) */}
      <style>{`
        .animate-slide-in-right {
          animation: slideInRight 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-slide-out-right {
          animation: slideOutRight 0.5s ease-in forwards;
        }

        @keyframes slideInRight {
          0% { transform: translateX(120%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOutRight {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(120%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};