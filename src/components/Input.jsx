import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
const Input = ({ icon: Icon, type = 'text', placeholder, value, onChange, className = '' }) => {
     const [showPassword, setShowPassword] = useState(false);
    
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className="relative">
        <div className="absolute z-200 left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
          <Icon size={20} />
        </div>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 pr-12 py-4 bg-gray/30 backdrop-blur-sm border border-gray-400 rounded-xl placeholder-gray-600 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all ${className}`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    );
  };

export default Input;