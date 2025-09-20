import React from "react";
import Alert from "./Alert";

const FormControl = ({ label, children, error }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="label font-semibold text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      {children}
      {error && <Alert type="error" message={error} compact />}
    </div>
  );
};

export default FormControl;