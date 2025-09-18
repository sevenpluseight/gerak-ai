import { createContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Load from localStorage if available, else default to system preference
    const saved = localStorage.getItem("theme");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Save whenever theme changes
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(isDark));
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      <div
        className={
          isDark
            ? "bg-[#1a1a1a] text-white min-h-screen"
            : "bg-white text-[#1a1a1a] min-h-screen"
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
