import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({ label, options, value, onChange, error, isDark }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {label && <label className="label font-semibold">{label}</label>}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          flex w-full items-center justify-between rounded-lg border px-4 py-2 text-left cursor-pointer
          ${isDark
            ? "bg-gray-800 text-gray-200 border-gray-600"
            : "bg-white text-gray-800 border-gray-300"}
          ${error ? "border-red-500" : ""}
        `}
      >
        {value || "Select"}
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          className={`
            mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-md absolute z-10 w-full
            ${isDark
              ? "bg-gray-800 text-gray-200 border-gray-700"
              : "bg-white text-gray-800 border-gray-200"}
          `}
        >
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`
                  block w-full text-left px-4 py-2 rounded-md cursor-pointer
                  ${isDark
                    ? "hover:bg-blue-800 hover:text-white"
                    : "hover:bg-gray-100 hover:text-gray-900"}
                  ${value === option
                    ? isDark
                      ? "bg-blue-900 text-white"
                      : "bg-blue-100 text-blue-900"
                    : ""}
                `}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
