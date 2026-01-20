import React from "react";
import { Loader } from "./ui";
const Button = ({
  children,
  variant = "primary",
  styleType = "classic",
  className = "",
  isLoading = false,
  disabled = false,

  ...props
}) => {

  const isDesabled = isLoading || disabled;
  const shapeClass = styleType === "classic" ? "" : "rounded-xl";

  const getColors = () => {
    if (variant === "secondary") return "bg-white text-black hover:bg-gray-50";
    if (variant === "danger")
      return "bg-[#FF6B6B] text-black hover:bg-[#FF5252]";
    if (variant === "success")
      return "bg-[#34D399] text-black hover:bg-[#10B981]";

    if (styleType === "classic") {
      return "bg-[#FFD028] text-black hover:bg-[#FFE066]";
    }
    return "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]";
  };

  return (
    <button
      className={`
        neo-border neo-shadow neo-press
        px-6 py-3 font-bold flex items-center justify-center gap-2
        ${shapeClass}
        ${getColors()}
        ${className}
        ${isDesabled ? "disabled opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      disabled={isDesabled}
      {...props}
    >
      {isLoading && <Loader size="sm" variant="spinner" />}
      {children}
    </button>
  );
};

export default Button;
