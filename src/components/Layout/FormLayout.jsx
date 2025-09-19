import React from "react";
import HeaderLayout from "./HeaderLayout";
import { useTheme } from "../../context/useTheme";

const FormHeaderLayout = ({ title, children }) => {
  const { isDark } = useTheme();

  return (
    <div className={isDark ? "bg-[#1a1a1a] text-gray-100 min-h-screen" : "bg-gray-50 text-gray-900 min-h-screen"}>
      <HeaderLayout>
        <main className="max-w-3.5xl md:max-w-4xl mx-auto px-6 py-12 mt-8">
          <div className={`card border rounded-xl shadow-md ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <div className="card-body">
              {title && (
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">{title}</h1>
              )}
              <div className="flex flex-col gap-6">
                {children}
              </div>
            </div>
          </div>
        </main>
      </HeaderLayout>
    </div>
  );
};

export default FormHeaderLayout;