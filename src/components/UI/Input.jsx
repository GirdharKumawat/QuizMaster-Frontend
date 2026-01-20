import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ 
  label, 
  icon: Icon, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  styleType = 'classic', // pop | classic
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  
  const shapeClass = styleType === 'classic' ? '' : 'rounded-xl';

  return (
    <div className={`mb-4 w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-bold mb-1.5 uppercase tracking-wide text-black">
          {label}
        </label>
      )}

      <div className="relative group">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black pointer-events-none z-10">
            <Icon size={20} strokeWidth={2.5} />
          </div>
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full bg-white text-black font-bold 
            neo-border neo-shadow
            p-2
            text-center
            ${Icon ? 'pl-12' : 'pl-4'} 
            ${shapeClass}
            focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none 
            placeholder:text-gray-400 placeholder:font-medium
            transition-all
          `}
          {...props}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-[#8B5CF6] transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;