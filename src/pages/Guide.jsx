import React from "react";
import { CheckCircle, MoveRight } from "lucide-react";
import Layout from "../components/Layout";
import { useTheme } from "../context/useTheme";
import MediumButton from "../components/Button/MediumButton";

const Guide = () => {
  const { isDark } = useTheme();

  const steps = [
    {
      title: "Event Basics",
      description:
        "Provide the event name, type, start/end date & time, venue, and expected attendance.",
    },
    {
      title: "Venue & Gates",
      description:
        "Define the seating layout, number of gates, gate types, VIP zones, and restricted areas.",
    },
    {
      title: "Facilities & Attractions",
      description:
        "Add restrooms, food courts, vendors, and any special attractions with their locations.",
    },
    {
      title: "Transport & Parking",
      description:
        "Provide details about public transport options, parking availability, and lane configurations.",
    },
    {
      title: "Staff & Safety",
      description:
        "Specify security staff, stewards, first aid stations, and emergency exits.",
    },
    {
      title: "Environmental Considerations",
      description:
        "Include weather forecasts, nearby events, and any special notes relevant to the event.",
    },
  ];

  return (
    <div className={isDark ? "bg-[#1a1a1a] text-gray-100" : "bg-gray-50 text-gray-900"}>
      <Layout>
        <main className="max-w-5xl mx-auto px-6 py-12 space-y-8 mt-10">
          <h1 className="text-4xl font-extrabold text-center">
            GerakAI Event Setup Guide
          </h1>
          <p className={isDark ? "text-gray-300 text-center" : "text-gray-600 text-center"}>
            This guide helps you gather all the necessary information to fill out the event form in GerakAI. Having everything ready will make your simulation setup fast and accurate.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex flex-col p-4 border rounded-xl shadow-sm hover:shadow-md transition duration-300 ${
                  isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h2 className="font-semibold text-lg">{step.title}</h2>
                </div>
                <p className={isDark ? "text-gray-300" : "text-gray-600"}>{step.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <MediumButton
              title="Proceed to Event Form"
              icon={MoveRight}
              href="/basiceventform"
              isDark={isDark}
            />
          </div>
        </main>
      </Layout>
    </div>
  );
};

export default Guide;