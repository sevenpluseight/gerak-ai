import React from "react";

const LargeButton = ({
  title,
  href,
  onClick,
  icon: Icon,
  iconPosition = "right",
  className = "",
  variant = "getStarted",
}) => {
  const content = (
    <span className="flex items-center gap-2">
      {Icon && iconPosition === "left" && <Icon className="w-5 h-5" />}
      {title}
      {Icon && iconPosition === "right" && <Icon className="w-5 h-5" />}
    </span>
  );

  const baseClasses =
    "px-6 py-5 rounded-xl font-semibold text-2xl shadow-md transition duration-300 flex items-center justify-center gap-2";

  const variants = {
    getStarted:
      "bg-gradient-to-r from-[#5694FF] via-[#AC81F2] to-[#FF68B9] text-white hover:opacity-90",
    demo:
      "bg-gray-300 hover:bg-gray-400 text-[#1a1a1a] dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white",
    outline:
      "border border-gray=400 text-gray-400 hover:bg-gray-100 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-700",
    default: "bg-gray-200 hover:bg-gray-300 text-black",
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

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

export default LargeButton;