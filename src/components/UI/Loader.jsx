const Loader = ({ variant = "spinner", size = "md", className = "" }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4",
  };

  if (variant === "spinner") {
    return (
      <div
        className={`
            rounded-full 
            border-black border-t-transparent border-l-transparent 
            bg-transparent
            animate-spin 
            ${sizes[size]} 
            ${className}
        `}
      />
    );
  }

  if (variant === "bouncing") {
    const duration = "0.5s";

    const getStyle = (delayFactor) => ({
      animationDuration: duration,
      animationDelay: `calc(${duration} * ${delayFactor})`,
    });
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div
          className={`${sizes[size]} bg-[#FF6B6B] border-[1.5px] border-gray-900 rounded-sm animate-bounce shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]`}
          style={getStyle(-0.3)}
        ></div>
        <div
          className={`${sizes[size]} bg-[#4ADE80] border-[1.5px] border-gray-900 rounded-sm animate-bounce shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]`}
          style={getStyle(-0.15)}
        ></div>
        <div
          className={`${sizes[size]} bg-[#FFD93D] border-[1.5px] border-gray-900 rounded-sm animate-bounce shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]`}
          style={getStyle(0)}
        ></div>
      </div>
    );
  }

  return null;
};

export default Loader;
