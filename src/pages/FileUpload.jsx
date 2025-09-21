import React, { useState } from "react";
import HeaderLayout from "../components/Layout/HeaderLayout";
import { useTheme } from "../context/useTheme";
import Alert from "../components/Alert";
import axios from "axios";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [fileStatuses, setFileStatuses] = useState({}); // filename -> status
  const [results, setResults] = useState({}); // filename -> extracted keywords
  const { isDark } = useTheme();

  const API_URL = import.meta.env.VITE_API_URL;

  const MAX_FILES = 5;
  const MAX_SIZE = 1024 * 1024 * 1024; // 1 GB
  const MAX_TOTAL_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB

  const categories = [
    "Entry Rush",
    "Mid-Event Congestion",
    "Emergency Evacuation",
    "General",
  ];

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
    const name = files[index].name;
    setFiles(files.filter((_, i) => i !== index));
    setFileStatuses((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    setResults((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please upload at least one file before submitting.");
      return;
    }

    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      alert("Total file size exceeds the 5GB limit.");
      return;
    }

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post(`${API_URL}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setFileStatuses((prev) => ({ ...prev, [file.name]: "processing" }));
        pollStatus(file.name);
      } catch (err) {
        console.error("Upload failed:", err);
        setFileStatuses((prev) => ({ ...prev, [file.name]: "failed" }));
      }
    }
  };

  const pollStatus = (filename) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`${API_URL}/status/${filename}`);
        setFileStatuses((prev) => ({ ...prev, [filename]: data.status }));

        if (data.status === "done") {
          clearInterval(interval);
          fetchResults(filename);
        } else if (data.status === "failed") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling failed:", err);
        clearInterval(interval);
        setFileStatuses((prev) => ({ ...prev, [filename]: "failed" }));
      }
    }, 3000);
  };

  const fetchResults = async (filename) => {
    try {
      const { data } = await axios.get(`${API_URL}/results/${filename}`);
      setResults((prev) => ({ ...prev, [filename]: data }));
    } catch (err) {
      console.error("Fetching results failed:", err);
      setResults((prev) => ({
        ...prev,
        [filename]: { error: "Failed to fetch results" },
      }));
    }
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <HeaderLayout title="File Upload">
      <div className="flex items-center justify-center min-h-[75vh]">
        <div
          className={`card w-full max-w-2xl shadow-xl ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-[#1a1a1a]"
          }`}
        >
          <div className="card-body">
            <h1 className="card-title text-2xl">Upload Your Files</h1>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              You can upload up to <strong>5 files</strong>, each up to <strong>1GB</strong>. Total must not exceed <strong>5GB</strong>.
            </p>

            <Alert
              type="info"
              message="Accepted file types: PDF. Other formats not allowed."
            />

            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileChange}
              className={`file-input file-input-bordered w-full mt-4 ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            />

            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className={`flex flex-col p-2 border rounded ${
                      isDark ? "bg-gray-800 border-gray-600" : "bg-base-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{file.name} ({formatSize(file.size)})</span>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="text-sm mt-1">
                      Status:{" "}
                      <span
                        className={
                          fileStatuses[file.name] === "done"
                            ? "text-green-600"
                            : fileStatuses[file.name] === "failed"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }
                      >
                        {fileStatuses[file.name] || "pending"}
                      </span>
                    </div>
                    {results[file.name] && (
                      <div className="mt-2 text-xs text-gray-400">
                        <pre>{JSON.stringify(results[file.name], null, 2)}</pre>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {files.length > 0 && (
              <div className="mt-4 text-sm font-medium">
                Total size:{" "}
                <span className={totalSize > MAX_TOTAL_SIZE ? "text-red-500" : "text-green-600"}>
                  {formatSize(totalSize)} / 5GB
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6 p-3 rounded-lg shadow-md">
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

            <div className="card-actions justify-between mt-6">
              <span className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Selected Scenario: <span className="text-purple-500">{selectedCategory}</span>
              </span>
              <button className="btn bg-purple-600 text-white" onClick={handleSubmit}>
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
