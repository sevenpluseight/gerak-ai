import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Guide from "./pages/Guide";
import BasicEventForm from "./pages/BasicEventForm";
import VenueDetailsForm from "./pages/VenueDetailsForm";
import { ThemeContext } from "./context/ThemeContext";
import { FormProvider } from "./context/FormContext";

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
      <FormProvider>
        <div
          className={`min-h-screen transition-colors duration-300 ${
            isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-[#1a1a1a]"
          }`}
        >
          <Router>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/basic-event-form" element={<BasicEventForm />} />
              <Route path="/venue-details-form" element={<VenueDetailsForm />} />
            </Routes>
          </Router>
        </div>
      </FormProvider>
    </ThemeContext.Provider>
  );
}

export default App;
