import React, { useState, useRef, useEffect } from "react";

const MultiSelectDropdown = ({ label, options, value = [], onChange, placeholder = "Select", isDark, error }) => {
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

  const toggleOption = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {label && <label className="label font-semibold">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          flex w-full flex-wrap items-center min-h-[2.5rem] gap-1 rounded-lg border px-3 py-2 text-left cursor-pointer
          ${isDark ? "bg-gray-800 text-gray-200 border-gray-600" : "bg-white text-gray-800 border-gray-300"}
          ${error ? "border-red-500" : ""}
        `}
      >
        {value.length === 0 ? placeholder : value.map((v) => (
          <span key={v} className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">{v}</span>
        ))}
        <span className="ml-auto text-gray-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <ul
          className={`
            mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-md absolute z-10 w-full
            ${isDark ? "bg-gray-800 text-gray-200 border-gray-700" : "bg-white text-gray-800 border-gray-200"}
          `}
        >
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => toggleOption(option)}
                className={`
                  block w-full text-left px-4 py-2 cursor-pointer
                  ${isDark ? "hover:bg-blue-800 hover:text-white" : "hover:bg-gray-100 hover:text-gray-900"}
                  ${value.includes(option)
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

export default MultiSelectDropdown;
