// Modern minimal Card component
// API: <Card className="...">children</Card>
// Added optional props: variant (elevated|outline|subtle|flat), interactive (adds hover styles)
const Card = ({
  children,
  className = '',
  variant = 'elevated',
  interactive = false,
  ...props
}) => {
  const base = 'rounded-xl transition-shadow transition-colors duration-200 z-10';
  const variants = {
    elevated: 'bg-white border border-gray-200 shadow-sm',
    outline: 'bg-white border border-gray-300',
    subtle: 'bg-gray-50 border border-gray-200',
    flat: 'bg-transparent border border-transparent'
  };
  const hover = interactive ? 'hover:shadow-md hover:border-gray-300' : '';

  return (
    <div
      className={`${base} ${variants[variant] || variants.elevated} ${hover} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;