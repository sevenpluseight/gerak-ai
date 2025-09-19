import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useTheme } from "../context/useTheme";
import Alert from "../components/Alert";
import NextButton from "../components/Button/NextButton";
import { useForm } from "../context/useForm";
import { Calendar } from "lucide-react";
import { validateBasicEventForm, isBasicEventFormComplete } from "../utils/validateBasicEventForm";

const Dropdown = ({ label, options, value, onChange, error, isDark }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {label && <label className="label font-semibold">{label}</label>}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          flex w-full items-center justify-between rounded-lg border px-4 py-2 text-left cursor-pointer
          ${isDark
            ? "bg-gray-800 text-gray-200 border-gray-600"
            : "bg-white text-gray-800 border-gray-300"}
          ${error ? "border-red-500" : ""}
        `}
      >
        {value || "Select type"}
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          className={`
            mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-md absolute z-10 w-full
            ${isDark
              ? "bg-gray-800 text-gray-200 border-gray-700"
              : "bg-white text-gray-800 border-gray-200"}
          `}
        >
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`
                  block w-full text-left px-4 py-2 rounded-md cursor-pointer
                  ${isDark
                    ? "hover:bg-blue-800 hover:text-white"
                    : "hover:bg-gray-100 hover:text-gray-900"}
                  ${value === option
                    ? isDark
                      ? "bg-blue-900 text-white"
                      : "bg-blue-100 text-blue-900"
                    : ""}
                `}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const BasicEventForm = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { updateFormData } = useForm();

  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    customEventType: "",
    startDate: "",
    endDate: "",
    venue: "",
    estimatedAttendance: "",
  });

  const [errors, setErrors] = useState({});

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const eventTypes = [
    "Concert",
    "Football Match",
    "Festival",
    "Parade",
    "Political Rally",
    "Exhibition",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const validationErrors = validateBasicEventForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      updateFormData("event", formData);
      navigate("/venue-details");
    }
  };

  const inputClass = (error) => `
    input input-bordered w-full pr-12
    ${isDark
      ? "bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
      : "bg-white text-gray-900 placeholder-gray-500 border-gray-700"}
    ${error ? "input-error" : ""}
  `;

  return (
    <div className={isDark ? "bg-[#1a1a1a] text-gray-100" : "bg-gray-50 text-gray-900"}>
      <Layout>
        <main className="max-w-3xl mx-auto px-6 py-12 mt-8">
          <div
            className={`card border rounded-xl shadow-md ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="card-body">
              <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
                Basic Event Information
              </h1>

              <div className="flex flex-col gap-6">
                {/* Event Name */}
                <div>
                  <label className="label font-semibold">Event Name</label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Enter event name"
                    className={inputClass(errors.eventName)}
                    maxLength={100}
                  />
                  {errors.eventName && <Alert type="error" message={errors.eventName} compact />}
                </div>

                {/* Event Type */}
                <div>
                  <Dropdown
                    label="Event Type"
                    options={eventTypes}
                    value={formData.eventType}
                    onChange={(val) => setFormData((prev) => ({ ...prev, eventType: val }))}
                    error={errors.eventType}
                    isDark={isDark}
                  />
                  {errors.eventType && <Alert type="error" message={errors.eventType} compact />}
                </div>

                {/* Custom Event Type */}
                {formData.eventType === "Other" && (
                  <div>
                    <label className="label font-semibold">Specify Custom Event Type</label>
                    <input
                      type="text"
                      name="customEventType"
                      value={formData.customEventType}
                      onChange={handleChange}
                      placeholder="Custom event type"
                      className={inputClass(errors.customEventType)}
                    />
                    {errors.customEventType && (
                      <Alert type="error" message={errors.customEventType} compact />
                    )}
                  </div>
                )}

                {/* Start & End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="label font-semibold">Start Date & Time</label>
                    <input
                      ref={startDateRef}
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`${inputClass(errors.startDate)} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => startDateRef.current?.showPicker?.()}
                      className="absolute right-3 top-[65%] -translate-y-1/2 text-gray-600 dark:text-gray-300"
                    >
                      <Calendar className="w-5 h-5" />
                    </button>
                    {errors.startDate && <Alert type="error" message={errors.startDate} compact />}
                  </div>

                  <div className="relative">
                    <label className="label font-semibold">End Date & Time</label>
                    <input
                      ref={endDateRef}
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={inputClass(errors.endDate)}
                    />
                    <button
                      type="button"
                      onClick={() => endDateRef.current?.showPicker?.()}
                      className="absolute right-3 top-[65%] -translate-y-1/2 text-gray-600 dark:text-gray-300"
                    >
                      <Calendar className="w-5 h-5" />
                    </button>
                    {errors.endDate && <Alert type="error" message={errors.endDate} compact />}
                  </div>
                </div>

                {/* Venue */}
                <div>
                  <label className="label font-semibold">Venue</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="Enter venue"
                    className={inputClass(errors.venue)}
                  />
                  {errors.venue && <Alert type="error" message={errors.venue} compact />}
                </div>

                {/* Estimated Attendance */}
                <div>
                  <label className="label font-semibold">Estimated Attendance</label>
                  <input
                    type="number"
                    name="estimatedAttendance"
                    value={formData.estimatedAttendance}
                    onChange={handleChange}
                    placeholder="Enter number of attendees"
                    min={100}
                    className={inputClass(errors.estimatedAttendance)}
                  />
                  {errors.estimatedAttendance && (
                    <Alert type="error" message={errors.estimatedAttendance} compact />
                  )}
                </div>

                {/* Next Button */}
                <NextButton
                  onClick={handleNext}
                  disabled={!isBasicEventFormComplete(formData)}
                >
                  Next
                </NextButton>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </div>
  );
};

export default BasicEventForm;
