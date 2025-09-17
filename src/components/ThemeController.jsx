import React from "react";
import { useTheme } from "../context/useTheme";

const ThemeController = () => {
  const { isDark, setIsDark } = useTheme();

  return (
    <label className="flex cursor-pointer gap-2 items-center">
      {/* Sun icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-yellow-500"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>

      <input
        type="checkbox"
        className="toggle theme-controller"
        checked={isDark}
        onChange={() => setIsDark(!isDark)}
        style={{
          borderColor: isDark ? "#ffffff" : "#B0B0B0FF",
          backgroundColor: isDark ? "#333" : "#d4d4d4",
        }}
      />

      {/* Moon icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-400"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </label>
  );
};

export default ThemeController;