import React from "react";

const MediumButton = ({ title, onClick, href, icon: Icon, iconPosition = "right", className = "", isDark }) => {
  const content = (
    <span className="flex items-center gap-2">
      {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
      {title}
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
    </span>
  );

  const baseClasses =
    "px-5 py-3 rounded-md font-medium text-lg shadow-md transition duration-300 flex items-center justify-center gap-2";

  const variantClasses = isDark
    ? "bg-[#FF7F50] text-white hover:bg-[#FF6333]"
    : "bg-[#4CAF50] text-white hover:bg-[#43A047]";

  const classes = `${baseClasses} ${variantClasses} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  );
};

export default MediumButton;