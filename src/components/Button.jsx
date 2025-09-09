const Button = ({ children, variant = 'primary', onClick, disabled = false, className = '' }) => {
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-white text-gray-800 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 shadow-sm',
    outline: 'bg-transparent border border-purple-500 text-purple-600 hover:bg-purple-50',
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