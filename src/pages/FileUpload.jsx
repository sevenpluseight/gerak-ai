import React, { useState } from "react";
import HeaderLayout from "../components/Layout/HeaderLayout";
import { useTheme } from "../context/useTheme";
import Alert from "../components/Alert";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("General");
  const { isDark } = useTheme();

  const MAX_FILES = 5;
  const MAX_SIZE = 1024 * 1024 * 1024; // 1 GB per file
  const MAX_TOTAL_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB total

  // Format bytes into KB/MB/GB
  const formatSize = (bytes) => {
    if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
    if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    let newFiles = [...files];

    for (let file of selectedFiles) {
      if (newFiles.length >= MAX_FILES) {
        alert(`You can only upload up to ${MAX_FILES} files.`);
        break;
      }
      if (file.size > MAX_SIZE) {
        alert(`${file.name} exceeds the 1GB per-file limit.`);
        continue;
      }
      newFiles.push(file);
    }

    setFiles(newFiles);
    e.target.value = ""; // Reset input
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      alert("Please upload at least one file before submitting.");
      return;
    }
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      alert("Total file size exceeds the 5GB limit.");
      return;
    }
    // TODO: hook up API request here
    alert(
      `${files.length} file(s) uploaded successfully under "${selectedCategory}".`
    );
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  const categories = [
    "Entry Rush",
    "Mid-Event Congestion",
    "Emergency Evacuation",
    "General",
  ];

  return (
    <HeaderLayout title="File Upload">
      <div className="flex items-center justify-center min-h-[75vh]">
        {/* File Upload Card */}
        <div
          className={`card w-full max-w-2xl shadow-xl ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-[#1a1a1a]"
          }`}
        >
          <div className="card-body">
            <h1 className="card-title text-2xl">Upload Your Files</h1>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              You can upload up to <strong>5 files</strong>, with each file no
              larger than <strong>1GB</strong>. The combined total size must not
              exceed <strong>5GB</strong>.
            </p>

            <Alert
              type="info"
              message="Accepted file types: PDF, CSV, Excel (XLS, XLSX), TXT. Images and ZIP folders are not allowed."
            />

            {/* File Input */}
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className={`file-input file-input-bordered w-full mt-4 ${
                isDark
                  ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                  : "bg-white text-gray-900 placeholder-gray-500 border-gray-300"
              }`}
            />

            {/* File List */}
            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className={`flex items-center justify-between p-2 border rounded ${
                      isDark ? "bg-gray-800 border-gray-600" : "bg-base-200"
                    }`}
                  >
                    <span className="truncate max-w-xs">
                      {file.name}{" "}
                      <span
                        className={`ml-2 text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        ({formatSize(file.size)})
                      </span>
                    </span>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Total Size */}
            {files.length > 0 && (
              <div className="mt-4 text-sm font-medium">
                Total size:{" "}
                <span
                  className={`${
                    totalSize > MAX_TOTAL_SIZE ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {formatSize(totalSize)} / 5GB
                </span>
              </div>
            )}

            {/* Category Selector (Row) */}
            <div
              className={`flex flex-wrap gap-3 mt-6 p-3 rounded-lg shadow-md ${
                isDark ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full font-medium transition border-2 ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white border-green-500"
                      : isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border-transparent"
                      : "bg-white text-gray-700 hover:bg-gray-200 border-transparent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="card-actions justify-between mt-6">
              <span
                className={`text-sm font-semibold ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Selected Scenario:{" "}
                <span className="text-purple-500">{selectedCategory}</span>
              </span>
              <button
                className="btn bg-purple-600 text-white"
                onClick={handleSubmit}
              >
                Start Prediction
              </button>
            </div>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
};

export default FileUpload;
