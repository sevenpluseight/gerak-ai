import React from "react";
import { Link } from "react-router-dom";
import ThemeController from "../ThemeController";

const HeaderLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-6">
        <Link to="/">
          <h1 className="text-3xl font-bold ml-4 bg-gradient-to-r from-[#5694FF] via-[#AC81F2] to-[#FF68B9] bg-clip-text text-transparent cursor-pointer">
            GerakAI
          </h1>
        </Link>

        <ThemeController />
      </header>

      <main className="w-full">{children}</main>
    </div>
  );
};

export default HeaderLayout;
