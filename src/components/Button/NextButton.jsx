import React from "react";
import { ArrowRight, Check } from "lucide-react";

const NextButton = ({
  children,
  onClick,
  variant = "next", // "next" | "submit"
  loading = false,
  disabled = false,
}) => {
  const isSubmit = variant === "submit";

  return (
    <button
      type={isSubmit ? "submit" : "button"}
      onClick={onClick ? onClick : undefined}
      disabled={loading || disabled}
      className={`
        relative flex items-center justify-center gap-2
        px-6 py-3 rounded-xl font-semibold text-white
        ${disabled || loading
          ? "bg-gray-400 cursor-not-allowed"
          : isSubmit
          ? "bg-gradient-to-r from-green-600 to-emerald-600 cursor-pointer"
          : "bg-gradient-to-r from-blue-600 to-indigo-600 cursor-pointer"
        }
        shadow-md hover:shadow-lg transition-all duration-300
        hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-60
      `}
    >
      {loading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        <>
          {children || (isSubmit ? "Submit" : "Proceed to Next Section")}
          {isSubmit ? (
            <Check className="w-5 h-5" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        </>
      )}
    </button>
  );
};

export default NextButton;