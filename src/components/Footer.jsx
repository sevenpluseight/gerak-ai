import React from "react";
import { useTheme } from "../context/useTheme";
import GitHubWhite from "../assets/github-mark-white.svg";
import GitHubDark from "../assets/github-mark-dark.svg";

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer
      className={`w-full py-8 px-6 mt-44 ${
        isDark ? "bg-[#1a1a1a]" : "bg-gray-100"
      } border-t ${isDark ? "border-gray-700" : "border-gray-200"} flex flex-col items-center gap-4`}
    >
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} text-center`}>
        © 2025 Ctrl Alt Win. All rights reserved.
      </p>

      <a
        href="https://github.com/sevenpluseight/gerak-ai"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2 justify-center transition-colors duration-200 ${
          isDark ? "hover:text-blue-500 text-white" : "hover:text-blue-500 text-black"
        }`}
      >
        <img
          src={isDark ? GitHubWhite : GitHubDark}
          alt="GitHub"
          className="w-5 h-5"
        />
        <span>GitHub</span>
      </a>
    </footer>
  );
};

export default Footer;
