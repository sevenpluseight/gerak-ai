import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../components/Layout/FormLayout";
import { useTheme } from "../context/useTheme";
import Alert from "../components/Alert";
import NextButton from "../components/Button/NextButton";
import { useForm } from "../context/useForm";
import { Calendar } from "lucide-react";
import Dropdown from "../components/Dropdown/GeneralDropdown";
import { validateBasicEventForm, isBasicEventFormComplete } from "../utils/validateBasicEventForm";

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
  const [touched, setTouched] = useState({});

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
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldError = validateBasicEventForm({ ...formData, [name]: value }, name);
    setErrors(prev => ({ ...prev, [name]: fieldError[name] }));
  };

  const handleEventTypeChange = (val) => {
    setFormData(prev => ({ ...prev, eventType: val }));
    setTouched(prev => ({ ...prev, eventType: true }));
    const fieldError = validateBasicEventForm({ ...formData, eventType: val }, "eventType");
    setErrors(prev => ({ ...prev, eventType: fieldError.eventType }));
  };

  const handleNext = () => {
    const validationErrors = validateBasicEventForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      updateFormData("event", formData);
      navigate("/venue-details-form");
    }
  };

  const inputClass = (error) => `
    input input-bordered w-full
    ${isDark
      ? "bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
      : "bg-white text-gray-900 placeholder-gray-500 border-gray-700"}
    ${error ? "input-error" : ""}
  `;

  return (
    <FormLayout title="Basic Event Information">
      {/* Event Name */}
      <div>
        <label className="label font-semibold">Event Name</label>
        <input
          type="text"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          placeholder="Enter event name"
          className={inputClass(errors.eventName && touched.eventName)}
          maxLength={500}
        />
        <small className="text-gray-500 text-sm">Event name should be up to 100 words.</small>
        {errors.eventName && touched.eventName && <Alert type="error" message={errors.eventName} compact />}
      </div>

      {/* Event Type */}
      <div>
        <Dropdown
          label="Event Type"
          options={eventTypes}
          value={formData.eventType}
          onChange={handleEventTypeChange}
          error={errors.eventType && touched.eventType}
          isDark={isDark}
        />
        {errors.eventType && touched.eventType && <Alert type="error" message={errors.eventType} compact />}
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
            className={inputClass(errors.customEventType && touched.customEventType)}
          />
          {errors.customEventType && touched.customEventType && (
            <Alert type="error" message={errors.customEventType} compact />
          )}
        </div>
      )}

      {/* Start Date */}
      <div className="relative">
        <label className="label font-semibold">Start Date & Time</label>
        <div className="relative">
          <input
            ref={startDateRef}
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`${inputClass(errors.startDate && touched.startDate)} pr-10`}
          />
          <button
            type="button"
            onClick={() => startDateRef.current?.showPicker?.()}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-300"
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>
        {errors.startDate && touched.startDate && <Alert type="error" message={errors.startDate} compact />}
      </div>

      {/* End Date */}
      <div className="relative">
        <label className="label font-semibold">End Date & Time</label>
        <div className="relative">
          <input
            ref={endDateRef}
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`${inputClass(errors.endDate && touched.endDate)} pr-10`}
          />
          <button
            type="button"
            onClick={() => endDateRef.current?.showPicker?.()}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-300"
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>
        {errors.endDate && touched.endDate && <Alert type="error" message={errors.endDate} compact />}
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
          className={inputClass(errors.venue && touched.venue)}
        />
        {errors.venue && touched.venue && <Alert type="error" message={errors.venue} compact />}
      </div>

      {/* Estimated Attendance */}
      <div>
        <label className="label font-semibold">Estimated Attendance</label>
        <input
          type="text"
          name="estimatedAttendance"
          value={formData.estimatedAttendance}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange({ target: { name: "estimatedAttendance", value } });
            }
          }}
          placeholder="Enter number of attendees"
          min={100}
          className={inputClass(errors.estimatedAttendance && touched.estimatedAttendance)}
        />
        {errors.estimatedAttendance && touched.estimatedAttendance && (
          <Alert type="error" message={errors.estimatedAttendance} compact />
        )}
      </div>

      <NextButton
        onClick={handleNext}
        disabled={!isBasicEventFormComplete(formData)}
      >
        Next
      </NextButton>
    </FormLayout>
  );
};

export default BasicEventForm;
