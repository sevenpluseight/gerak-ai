import React, { useState } from "react";
import { useTheme } from "../context/useTheme";
import { useForm } from "../context/useForm";
import FormLayout from "../components/Layout/FormLayout";
import MultiSelectDropdown from "../components/Dropdown/MultiSelectDropdown";
import Alert from "../components/Alert";
import NextButton from "../components/Button/NextButton";
import { validateTransportAccessForm, isTransportAccessFormComplete } from "../utils/validateTransportAccessForm";
import { useNavigate } from "react-router-dom";

// TODO: connect to transport API for schedules - https://developer.data.gov.my/realtime-api/gtfs-static

const TransportAccessForm = () => {
  const { isDark } = useTheme();
  const { updateFormData } = useForm();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    publicTransportAvailable: false,
    transportModes: [],
    transportSchedules: [],
    transportCapacityPerTrip: "",
    parkingAvailable: false,
    parkingCapacity: "",
    entryLanes: "",
    exitLanes: "",
  });

  const [errors, setErrors] = useState({});

  const inputClass = (error, extraClass = "") =>
    `input input-bordered w-full ${
      isDark
        ? "bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
        : "bg-white text-gray-900 placeholder-gray-500 border-gray-700"
    } ${error ? "input-error" : ""} ${extraClass}`;

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const addSchedule = () => {
    setFormData(prev => ({
      ...prev,
      transportSchedules: [...prev.transportSchedules, ""],
    }));
  };

  const updateSchedule = (index, value) => {
    const schedules = [...formData.transportSchedules];
    schedules[index] = value;
    setFormData(prev => ({ ...prev, transportSchedules: schedules }));
  };

  const removeSchedule = (index) => {
    const schedules = [...formData.transportSchedules];
    schedules.splice(index, 1);
    setFormData(prev => ({ ...prev, transportSchedules: schedules }));
  };

  const handleNext = () => {
    const validationErrors = validateTransportAccessForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      updateFormData("transport", formData);
      navigate("/staff-safety-form")
    }
  };

  return (
    <FormLayout title="Transport & Access">
      {/* Public Transport */}
      <div className="mb-6">
        <label className="label font-semibold">Nearby Public Transport Available?</label>
        <select
          value={formData.publicTransportAvailable ? "Yes" : "No"}
          onChange={e => handleChange("publicTransportAvailable", e.target.value === "Yes")}
          className={inputClass(errors.publicTransportAvailable)}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        {formData.publicTransportAvailable && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Transport Modes */}
            <div className="flex flex-col">
              <MultiSelectDropdown
                options={["Train", "LRT", "MRT", "Bus", "Shuttle"]}
                value={formData.transportModes}
                onChange={vals => handleChange("transportModes", vals)}
                placeholder="Select Transport Modes"
                isDark={isDark}
                className="mt-1"
              />
              {errors.transportModes && <Alert type="error" message={errors.transportModes} compact />}

              {formData.transportModes.some(mode => ["Train", "LRT", "MRT", "Bus"].includes(mode)) && (
                <p className={`text-sm mt-2 ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                  Attendees should refer to official public transport schedules.
                </p>
              )}
            </div>

            {/* Transport Schedules */}
            <div className="flex flex-col gap-2">
              {formData.transportSchedules.map((time, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={time}
                      onChange={e => updateSchedule(idx, e.target.value)}
                      className={inputClass(errors[`transportSchedules.${idx}`])}
                    />
                    <button
                      type="button"
                      onClick={() => removeSchedule(idx)}
                      className="btn btn-sm btn-error"
                    >
                      Remove
                    </button>
                  </div>
                  {errors[`transportSchedules.${idx}`] && (
                    <Alert type="error" message={errors[`transportSchedules.${idx}`]} compact />
                  )}
                </div>
              ))}
              <button
                type="button"
                className={inputClass(null, "btn btn-outline w-full h-10 mt-1")}
                onClick={addSchedule}
              >
                Add Schedule
              </button>
            </div>

            {/* Capacity per trip */}
            <div>
              <input
                type="number"
                min={1}
                placeholder="Estimated capacity per trip (optional)"
                value={formData.transportCapacityPerTrip}
                onChange={e => handleChange("transportCapacityPerTrip", Number(e.target.value))}
                className={inputClass(errors.transportCapacityPerTrip, "mt-1")}
              />
              {errors.transportCapacityPerTrip && <Alert type="error" message={errors.transportCapacityPerTrip} compact />}
            </div>
          </div>
        )}
      </div>

      {/* Parking */}
      <div className="mb-6">
        <label className="label font-semibold">Parking Available?</label>
        <select
          value={formData.parkingAvailable ? "Yes" : "No"}
          onChange={e => handleChange("parkingAvailable", e.target.value === "Yes")}
          className={inputClass(errors.parkingAvailable)}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        {formData.parkingAvailable && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="number"
                min={1}
                placeholder="Parking Capacity (cars)"
                value={formData.parkingCapacity}
                onChange={e => handleChange("parkingCapacity", Number(e.target.value))}
                className={inputClass(errors.parkingCapacity)}
              />
              {errors.parkingCapacity && <Alert type="error" message={errors.parkingCapacity} compact />}
            </div>
            <div>
              <input
                type="number"
                min={1}
                placeholder="Number of Entry Lanes"
                value={formData.entryLanes}
                onChange={e => handleChange("entryLanes", Number(e.target.value))}
                className={inputClass(errors.entryLanes)}
              />
              {errors.entryLanes && <Alert type="error" message={errors.entryLanes} compact />}
            </div>
            <div>
              <input
                type="number"
                min={1}
                placeholder="Number of Exit Lanes"
                value={formData.exitLanes}
                onChange={e => handleChange("exitLanes", Number(e.target.value))}
                className={inputClass(errors.exitLanes)}
              />
              {errors.exitLanes && <Alert type="error" message={errors.exitLanes} compact />}
            </div>
          </div>
        )}
      </div>

      <NextButton onClick={handleNext} disabled={!isTransportAccessFormComplete(formData)}>
        Next
      </NextButton>
    </FormLayout>
  );
};

export default TransportAccessForm;
