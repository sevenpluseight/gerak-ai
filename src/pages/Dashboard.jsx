import React, { useState } from "react";
import HeaderLayout from "../components/Layout/HeaderLayout";
import { useTheme } from "../context/useTheme";
import { Info, X } from "lucide-react";

const mockHistory = [
  { id: 1, time: "2025-09-20 09:12", label: "Event A", result: "Safe" },
  { id: 2, time: "2025-09-19 17:45", label: "Event B", result: "Monitor" },
  { id: 3, time: "2025-09-18 14:30", label: "Event C", result: "High Risk" },
  { id: 4, time: "2025-09-15 11:05", label: "Event D", result: "Safe" },
];

const scenarios = ["Entry Rush", "Mid-Event Congestion", "Emergency Evacuation", "General"];

const scenarioStats = {
  "Entry Rush": { crowd: "5,000", risk: "High", response: "Open extra gates", accuracy: 85 },
  "Mid-Event Congestion": { crowd: "3,800", risk: "Moderate", response: "Deploy staff", accuracy: 78 },
  "Emergency Evacuation": { crowd: "2,200", risk: "Critical", response: "Activate alarm", accuracy: 92 },
  General: { crowd: "3,200", risk: "Moderate", response: "Monitor gates", accuracy: 80 },
};

const SmallStat = ({ title, value, isDark }) => (
  <div
    className={`p-4 rounded-lg shadow-sm ${
      isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900 border border-gray-300"
    }`}
  >
    <div className="text-sm text-gray-500">{title}</div>
    <div className="mt-1 text-2xl font-bold text-gray-500">{value}</div>
  </div>
);

const MockLineChart = ({ isDark }) => (
  <div
    className={`p-4 rounded-lg shadow-sm ${
      isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900 border border-gray-300"
    }`}
  >
    <div className="text-sm text-gray-500">Predicted density (mock)</div>
    <svg viewBox="0 0 200 80" className="w-full h-36 mt-2">
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <polyline
        points="0,60 25,45 50,40 75,30 100,35 125,28 150,20 175,30 200,18"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polygon
        points="0,80 0,60 25,45 50,40 75,30 100,35 125,28 150,20 175,30 200,18 200,80"
        fill="url(#g1)"
      />
    </svg>
    <div className="text-xs text-gray-500 mt-2">This is a mock chart for layout only.</div>
  </div>
);

const MockBarChart = ({ isDark }) => (
  <div
    className={`p-4 rounded-lg shadow-sm ${
      isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900 border border-gray-300"
    }`}
  >
    <div className="text-sm text-gray-500">Recent metric (mock)</div>
    <div className="flex items-end gap-2 h-28 mt-3">
      {[40, 65, 55, 80, 30, 70].map((v, i) => (
        <div
          key={i}
          style={{ height: `${v}%` }}
          className={`flex-1 rounded-t ${isDark ? "bg-purple-400" : "bg-purple-600"}`}
          title={`${v}%`}
        />
      ))}
    </div>
    <div className="text-xs text-gray-500 mt-2">Bars are mock samples.</div>
  </div>
);

const Dashboard = () => {
  const { isDark } = useTheme();
  const [selectedScenario, setSelectedScenario] = useState("General");
  const [showAccuracyTooltip, setShowAccuracyTooltip] = useState(false);

  const stats = scenarioStats[selectedScenario];

  const cardClass = `rounded-lg p-4 shadow flex flex-col ${
    isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900 border border-gray-300"
  }`;

  return (
    <HeaderLayout title="Dashboard">
      <div className="min-h-[80vh] px-6 ml-4.5 relative">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-500">Overview</h2>
          <p className="text-lg text-gray-500">Quick snapshot of predictions and recent activity</p>
        </div>

        {/* Top Row */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          {/* Current Prediction */}
          <div className="col-span-12 md:col-span-8">
            <div className={`${cardClass} h-full`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-500">Current Prediction</h3>
                <div className="text-sm text-gray-500">Updated: just now</div>
              </div>

              {/* Scenario Buttons */}
              <div className="flex gap-2 flex-wrap mb-4">
                {scenarios.map((s) => {
                  const active = s === selectedScenario;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedScenario(s)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        active
                          ? "border-green-400 bg-green-50 text-green-600"
                          : isDark
                          ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              <MockLineChart isDark={isDark} />

              {/* Stats & Accuracy Tooltip */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <SmallStat title="Estimated Crowd" value={stats.crowd} isDark={isDark} />
                <SmallStat title="Risk Level" value={stats.risk} isDark={isDark} />
                <SmallStat title="Response Suggested" value={stats.response} isDark={isDark} />

                <div className="relative">
                  <div
                    className={`p-4 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer ${
                      isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900 border border-gray-300"
                    }`}
                    onClick={() => setShowAccuracyTooltip(!showAccuracyTooltip)}
                  >
                    <span className="text-sm text-gray-500">Accuracy:</span>
                    <span className="font-bold text-2xl text-gray-500">{stats.accuracy || 80}%</span>
                    <Info className={`w-5 h-15 ${isDark ? "text-gray-500" : "text-gray-500"}`} />
                  </div>

                  {/* Tooltip */}
                  {showAccuracyTooltip && (
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 rounded-lg shadow-lg ${
                        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900 border border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-gray-500">Improve Accuracy</h4>
                        <X
                          className="w-4 h-4 cursor-pointer text-gray-500"
                          onClick={() => setShowAccuracyTooltip(false)}
                        />
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs text-gray-500">
                        <li>Provide high-quality input data with minimal missing values.</li>
                        <li>Update predictive models with recent events regularly.</li>
                        <li>Validate predictions against real outcomes when possible.</li>
                        <li>Combine multiple data sources for better context.</li>
                        <li>Adjust thresholds based on real-time feedback.</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Prediction History */}
          <div className="col-span-12 md:col-span-4">
            <div className={`${cardClass} h-full`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-500">Prediction History</h3>
                <div className="text-xs text-gray-500">Recent</div>
              </div>
              <ul className="mt-4 space-y-3 overflow-auto flex-1">
                {mockHistory.map((h) => (
                  <li
                    key={h.id}
                    className={`p-3 rounded ${
                      isDark ? "bg-gray-800" : "bg-gray-50 border border-gray-300"
                    } flex justify-between items-center`}
                  >
                    <div>
                      <div className="font-medium text-gray-500">{h.label}</div>
                      <div className="text-xs text-gray-500">{h.time}</div>
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        h.result === "Safe"
                          ? "text-green-500"
                          : h.result === "High Risk"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {h.result}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <MockBarChart isDark={isDark} />
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className={cardClass}>
              <h4 className="text-sm text-gray-500">Quick Actions</h4>
              <div className="mt-3 flex flex-col gap-2 flex-1">
                {["Run full analysis", "Export report", "Manage uploads"].map((label) => (
                  <button
                    key={label}
                    className="px-3 py-2 rounded-md font-medium text-sm transition-all bg-purple-600 text-white hover:bg-purple-500"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className={cardClass}>
              <h4 className="text-sm text-gray-500">Recent Uploads</h4>
              <div className="mt-3 space-y-2 text-sm">
                {[
                  "file_eventA.pdf — 2.1 MB",
                  "venue_plan.xlsx — 540 KB",
                  "layout_doc.docx — 1.2 MB",
                ].map((f) => (
                  <div
                    key={f}
                    className={`px-3 py-2 rounded-md ${
                      isDark
                        ? "bg-gray-700 text-gray-200"
                        : "bg-gray-100 text-gray-900 border border-gray-300"
                    }`}
                  >
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="col-span-12 mt-4">
          <div
            className={`p-2 rounded-lg ${
              isDark ? "bg-gray-900 text-gray-500" : "bg-white text-gray-500 border border-gray-300"
            } shadow flex items-center justify-center`}
          >
            <div className="text-center text-sm font-regular">
              AI is not perfect. Please verify the predictions before taking action.
            </div>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
};

export default Dashboard;
