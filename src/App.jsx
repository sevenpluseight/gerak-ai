import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import FileUpload from "./pages/FileUpload";
import Dashboard from "./pages/Dashboard";
import { ThemeContext } from "./context/ThemeContext";

function App() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    const userSelected = localStorage.getItem("userSelectedTheme") === "true";

    if (userSelected && savedTheme !== null) {
      return JSON.parse(savedTheme);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [userSelected, setUserSelected] = useState(
    localStorage.getItem("userSelectedTheme") === "true"
  );

  useEffect(() => {
    if (userSelected) {
      localStorage.setItem("theme", JSON.stringify(isDark));
      localStorage.setItem("userSelectedTheme", "true");
    }
  }, [isDark, userSelected]);

  useEffect(() => {
    if (userSelected) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDark(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [userSelected]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    setUserSelected(true);
  };

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark: toggleTheme }}>
        <div
          className={`min-h-screen transition-colors duration-300 ${
            isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-[#1a1a1a]"
          }`}
        >
          <Router basename="/gerak-ai">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/file-upload" element={<FileUpload />} />
              <Route path="/user-dashboard" element={<Dashboard />} />
            </Routes>
          </Router>
        </div>
    </ThemeContext.Provider>
  );
}

export default App;
