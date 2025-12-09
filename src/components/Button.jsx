const Button = ({ children, variant = 'primary', onClick, disabled = false, className = '' }) => {
  const variants = {
    // Primary stays white on strong purple for good contrast
    primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md',
    // Make secondary text darker for better contrast on white backgrounds
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 shadow-sm',
    // Slightly darker purple for outline text
    outline: 'bg-transparent border border-purple-500 text-purple-700 hover:bg-purple-50',
    // Subtle variant uses darker body text
    subtle: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;