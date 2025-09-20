import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/useTheme";
import { useForm } from "../context/useForm";
import FormLayout from "../components/Layout/FormLayout";
import Dropdown from "../components/Dropdown/GeneralDropdown";
import Alert from "../components/Alert";
import NextButton from "../components/Button/NextButton";
import { validateEnvironmentalForm, isEnvironmentalFormComplete } from "../utils/validateEnvironmentalForm";
import { Calendar } from "lucide-react";

// TODO: connect to weather API - https://developer.data.gov.my/realtime-api/weather

const weatherOptions = ["Sunny", "Rainy", "Hot", "Hazy", "Unknown"];

const InputField = ({ label, type = "text", value, onChange, error, placeholder, inputClass }) => (
  <div>
    {label && <label className="label font-semibold">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputClass(error)}
    />
    {error && <Alert type="error" message={error} compact />}
  </div>
);

const DateTimePicker = ({ label, value, onChange, error, refPicker, inputClass }) => (
  <div>
    {label && <label className="label font-semibold">{label}</label>}
    <div className="relative">
      <input
        ref={refPicker}
        type="datetime-local"
        value={value}
        onChange={onChange}
        className={`${inputClass(error)} pr-10`}
      />
      <button
        type="button"
        onClick={() => refPicker.current?.showPicker?.()}
        className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-300"
      >
        <Calendar className="w-5 h-5" />
      </button>
    </div>
    {error && <Alert type="error" message={error} compact />}
  </div>
);

const EnvironmentalExternalForm = () => {
  const { isDark } = useTheme();
  const { updateFormData, formState } = useForm();

  const [formData, setFormData] = useState({
    weather: "",
    nearbyEvents: false,
    eventName: "",
    eventLocation: "",
    eventStart: "",
    eventEnd: "",
    expectedAttendance: "",
    specialNotes: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const inputClass = (error) =>
    `input input-bordered w-full rounded-md ${
      isDark
        ? "bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
        : "bg-white text-gray-900 placeholder-gray-500 border-gray-300"
    } ${error ? "input-error" : ""} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white`;

  useEffect(() => {
    if (formState?.environmental) {
      setFormData(formState.environmental);
    }
  }, [formState]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleNext = () => {
    const validationErrors = validateEnvironmentalForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      updateFormData("environmental", formData);
      // TODO: navigate to next step
    }
  };

  return (
    <FormLayout title="Environmental & External Factors">
      {/* Weather */}
      <div className="mb-6">
        <Dropdown
          label="Weather Forecast / Consideration"
          options={weatherOptions}
          value={formData.weather}
          onChange={(val) => handleChange("weather", val)}
          error={errors.weather}
          isDark={isDark}
          className={inputClass(errors.weather)}
        />
      </div>

      {/* Nearby Events */}
      {/* FIX: fix "e" on Nearby Events / Clashes - Expected Attendance */}
      <div className="mb-6">
        <label className="label font-semibold">Nearby Events / Clashes?</label>
        <select
          value={formData.nearbyEvents ? "Yes" : "No"}
          onChange={(e) => handleChange("nearbyEvents", e.target.value === "Yes")}
          className={inputClass(errors.nearbyEvents)}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        {formData.nearbyEvents && (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              placeholder="Event Name"
              value={formData.eventName}
              onChange={(e) => handleChange("eventName", e.target.value)}
              error={errors.eventName && touched.eventName}
              inputClass={inputClass}
            />
            <InputField
              placeholder="Location"
              value={formData.eventLocation}
              onChange={(e) => handleChange("eventLocation", e.target.value)}
              error={errors.eventLocation && touched.eventLocation}
              inputClass={inputClass}
            />
            <DateTimePicker
              label="Start Date & Time"
              value={formData.eventStart}
              onChange={(e) => handleChange("eventStart", e.target.value)}
              error={errors.eventStart && touched.eventStart}
              refPicker={startDateRef}
              inputClass={inputClass}
            />
            <DateTimePicker
              label="End Date & Time"
              value={formData.eventEnd}
              onChange={(e) => handleChange("eventEnd", e.target.value)}
              error={errors.eventEnd && touched.eventEnd}
              refPicker={endDateRef}
              inputClass={inputClass}
            />
            <InputField
              type="number"
              placeholder="Expected Attendance"
              value={formData.expectedAttendance}
              onChange={(e) => handleChange("expectedAttendance", Number(e.target.value))}
              error={errors.expectedAttendance && touched.expectedAttendance}
              inputClass={inputClass}
            />
          </div>
        )}
      </div>

      {/* Special Notes - Optional */}
      <div className="mb-6">
        <label className="label font-semibold">Special Notes (Optional)</label>
        <textarea
          placeholder='E.g., "Celebrity arrival at 8pm", "VIP Minister attending", "Road closure after 10pm"'
          value={formData.specialNotes}
          onChange={(e) => handleChange("specialNotes", e.target.value)}
          className={inputClass(errors.specialNotes)}
        />
      </div>

      <NextButton onClick={handleNext} disabled={!isEnvironmentalFormComplete(formData)}>
        Next
      </NextButton>
    </FormLayout>
  );
};

export default EnvironmentalExternalForm;
