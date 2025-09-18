import React from "react";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

const Alert = ({ type = "info", message, compact = false }) => {
  const icons = {
    success: <CheckCircle className="w-4 h-4 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 shrink-0" />,
    error: <XCircle className="w-4 h-4 shrink-0" />,
    info: <Info className="w-4 h-4 shrink-0" />,
  };

  const baseClass = compact
    ? "flex items-center gap-1 text-sm mt-1"
    : "alert py-2 px-3 mt-2";

  const typeClass = {
    success: compact ? "text-green-500" : "alert-success",
    warning: compact ? "text-yellow-500" : "alert-warning",
    error: compact ? "text-red-500" : "alert-error",
    info: compact ? "text-blue-500" : "alert-info",
  };

  return (
    <div role="alert" className={`${baseClass} ${typeClass[type]}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};

export default Alert;