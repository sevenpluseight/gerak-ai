import React, { useState, useEffect } from "react";
import HeaderLayout from "../components/Layout/HeaderLayout";
import Papa from "papaparse";

const FUNCTION_URL = "https://nyqtf3jtsw24eloznvyzeywxgm0mjqdt.lambda-url.ap-southeast-1.on.aws/";

const fetchCsvData = async () => {
  try {
    const res = await fetch(FUNCTION_URL);
    if (!res.ok) throw new Error("Failed to fetch data");
    const data = await res.json();

    const results = [];
    Object.keys(data).forEach((key) => {
      const scenarioName = key
        .replace("predictions/prediction_", "")
        .replace(".csv", "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      if (data[key]?.preview) {
        const parsed = Papa.parse(data[key].preview, { header: true, skipEmptyLines: true }).data;
        parsed.forEach((row) => (row.Scenario = scenarioName));
        results.push(...parsed);
      }
    });

    return results;
  } catch (err) {
    console.error("Error fetching CSV:", err);
    return [];
  }
};

const ContainerCard = ({ title, value, color }) => (
  <div
    className={`p-4 rounded-lg shadow-md border-l-4 ${color} bg-white dark:bg-gray-800 mb-4`}
  >
    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    <p className="mt-1 text-xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
  </div>
);

const PredictionsTable = ({ data }) => {
  if (!data || data.length === 0) return <p className="text-gray-500 dark:text-gray-400">No predictions available.</p>;

  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse rounded-lg shadow-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="text-left px-4 py-2 border-b text-gray-700 dark:text-gray-200"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}>
              {columns.map((col) => {
                let value = row[col];
                if (col.toLowerCase().includes("risk")) {
                  const colorClass =
                    value < 0.5
                      ? "text-green-500"
                      : value < 0.75
                      ? "text-yellow-400"
                      : "text-red-500";
                  value = <span className={colorClass}>{value}</span>;
                }
                return (
                  <td key={col} className="px-4 py-2 border-b text-gray-700 dark:text-gray-200">
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const loadData = async () => setCsvData(await fetchCsvData());
    loadData();
  }, []);

  // Group predictions by scenario
  const groupedData = csvData.reduce((acc, row) => {
    if (!acc[row.Scenario]) acc[row.Scenario] = [];
    acc[row.Scenario].push(row);
    return acc;
  }, {});

  return (
    <HeaderLayout title="Dashboard">
      <div className="min-h-[80vh] px-6 py-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-100">Predictions Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400">Grouped predictions by scenario for clarity.</p>
        </div>

        {/* Render grouped tables */}
        {Object.keys(groupedData).map((scenario) => (
          <div key={scenario} className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-100">{scenario}</h3>
            <PredictionsTable data={groupedData[scenario]} />
          </div>
        ))}
      </div>
    </HeaderLayout>
  );
};

export default Dashboard;