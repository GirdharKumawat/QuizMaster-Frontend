 const Card = ({ children, className = '', ...props }) => (
    <div 
      className={`bg-white/25 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl ${className}`}
      {...props} 
    >
      {children}
    </div>
  );

export default Card;