import React from "react";
import ThemeController from "../components/ThemeController";
import LargeButton from "../components/LargeButton";
import { MoveRight, Play } from "lucide-react";
import { useTheme } from "../context/useTheme";
import Footer from "../components/Footer";

const MainPage = () => {
  const { isDark, setIsDark } = useTheme();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-6">
        <h1 className="text-3xl font-bold ml-4 bg-gradient-to-r from-[#5694FF] via-[#AC81F2] to-[#FF68B9] bg-clip-text text-transparent">
          GerakAI
        </h1>
        <ThemeController isDark={isDark} setIsDark={setIsDark} />
      </header>

      <main className="flex flex-col flex-1 items-center justify-center text-center pt-46">
        <h1 className="text-8xl font-extrabold bg-gradient-to-r from-[#5694FF] via-[#AC81F2] to-[#FF68B9] bg-clip-text text-transparent drop-shadow-[0_6px_6px_rgba(0,0,0,0.3)]">
          GerakAI
        </h1>

        <h2
          className={`text-3xl font-bold mt-4 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Predict. Insight. Action.
        </h2>

        <p
          className={`text-lg font-medium max-w-2xl mt-4 mb-8 ${
            isDark ? "text-gray-300" : "text-gray-500"
          }`}
        >
          AI-powered simulations for safer, smarter events. Harness the power of crowd
          intelligence to make data-driven decisions in real-time.
        </p>

        <div className="flex gap-x-12 mt-4">
          <LargeButton
            title="Get Started"
            icon={MoveRight}
            variant="getStarted"
            href="#"
            isDark={isDark}
          />
          <LargeButton
            title="Try Demo"
            icon={Play}
            variant="outline"
            href="#"
            isDark={isDark}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainPage;