import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
const Input = ({ icon: Icon, type = 'text', placeholder, value, onChange, className = '' }) => {
     const [showPassword, setShowPassword] = useState(false);
    
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className="relative">
        <div className="absolute z-200 left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
          <Icon size={20} />
        </div>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 pr-12 py-4 bg-white/90 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${className}`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    );
  };

export default Input;