const Card = ({
  title,
  className = "",
  children,
  ...props
}) => {
  const baseClasses = `
    relative overflow-hidden p-6 border-[1.5px] border-gray-900
    rounded-xl
    bg-white 
    shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)]
  `;

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {title && (
        <div className="flex items-center justify-between border-b-[1.5px] border-gray-900 pb-2 mb-4">
          <h2 className="text-lg font-bold uppercase tracking-tight text-black">
            {title}
          </h2>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-400 border border-gray-900"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 border border-gray-900"></div>
            <div className="w-3 h-3 rounded-full bg-green-400 border border-gray-900"></div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;