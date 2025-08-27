 const Button = ({ children, variant = 'primary', onClick, disabled = false, className = '' }) => {
    // const variants = {
    //   primary: 'bg-accentPurple  text-black to-teal-400 text-white shadow-lg hover:shadow-pastelBlue-500/25',
    //   secondary: 'bg-lightGrey text-gray-800 hover:bg-white/50',
    // };

      const variants = {
      primary: 'bg-gradient-to-r from-purple-500 to-teal-400 text-white shadow-lg hover:shadow-purple-500/25',
      secondary: 'bg-pastelBlue text-gray-800 hover:bg-white/50 border border-gray-300',
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-6 py-3 cursor-pointer  rounded-xl font-medium transition-all duration-300 backdrop-blur-sm ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${className}`}
      >
        {children}
      </button>
    );
  };

export default Button;