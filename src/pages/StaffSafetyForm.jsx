import React, { useState } from "react";
import { useTheme } from "../context/useTheme";
import { useForm } from "../context/useForm";
import FormLayout from "../components/Layout/FormLayout";
import MultiSelectDropdown from "../components/Dropdown/MultiSelectDropdown";
import Alert from "../components/Alert";
import NextButton from "../components/Button/NextButton";
import { validateStaffSafetyForm, isStaffSafetyFormComplete } from "../utils/validateStaffSafetyForm";
import { useNavigate } from "react-router-dom";

const StaffSafetyForm = () => {
  const { isDark } = useTheme();
  const { formData: globalFormData, updateFormData } = useForm();
  const navigate = useNavigate();

  // Extract venue data for dropdowns - VenueDetailsForm.jsx
  const venueSections = globalFormData?.venue?.sections || [];
  const venueGates = globalFormData?.venue?.gates || [];

  const [formData, setFormData] = useState({
    securityStaffAvailable: false,
    totalStaffCount: "",
    deploymentZones: [],
    firstAidAvailable: false,
    numberOfStations: "",
    firstAidLocations: [],
    emergencyExitsMarked: false,
    numberOfEmergencyExits: "",
    emergencyExitLocations: [],
  });

  const [errors, setErrors] = useState({});

  const inputClass = (error) =>
    `input input-bordered w-full ${
      isDark
        ? "bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
        : "bg-white text-gray-900 placeholder-gray-500 border-gray-700"
    } ${error ? "input-error" : ""}`;

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    const validationErrors = validateStaffSafetyForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      updateFormData("staffSafety", formData);
      navigate("/environmental-external-form")
    }
  };

  return (
    <FormLayout title="Staff & Safety Resources">
      {/* Security Staff */}
      {/* FIX: fix "e" on Stewards / Security Staff Available - Total staff count */}
      <div className="mb-6">
        <label className="label font-semibold">Stewards / Security Staff Available?</label>
        <select
          value={formData.securityStaffAvailable ? "Yes" : "No"}
          onChange={e => handleChange("securityStaffAvailable", e.target.value === "Yes")}
          className={inputClass(errors.securityStaffAvailable)}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        {formData.securityStaffAvailable && (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                min={1}
                placeholder="Total staff count"
                value={formData.totalStaffCount}
                onChange={e => handleChange("totalStaffCount", Number(e.target.value))}
                className={inputClass(errors.totalStaffCount)}
              />
              {errors.totalStaffCount && <Alert type="error" message={errors.totalStaffCount} compact />}
            </div>

            <div>
              <MultiSelectDropdown
                options={venueSections.map(s => s.name)}
                value={formData.deploymentZones}
                onChange={vals => handleChange("deploymentZones", vals)}
                placeholder="Select Deployment Zones"
                isDark={isDark}
              />
              {errors.deploymentZones && <Alert type="error" message={errors.deploymentZones} compact />}
            </div>
          </div>
        )}
      </div>

      {/* First Aid Stations */}
      {/* FIX: fix "e" on First Aid Stations Available - Number of stations */}
      <div className="mb-6">
        <label className="label font-semibold">First Aid Stations Available?</label>
        <select
          value={formData.firstAidAvailable ? "Yes" : "No"}
          onChange={e => handleChange("firstAidAvailable", e.target.value === "Yes")}
          className={inputClass(errors.firstAidAvailable)}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        {formData.firstAidAvailable && (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                min={1}
                placeholder="Number of stations"
                value={formData.numberOfStations}
                onChange={e => handleChange("numberOfStations", Number(e.target.value))}
                className={inputClass(errors.numberOfStations)}
              />
              {errors.numberOfStations && <Alert type="error" message={errors.numberOfStations} compact />}
            </div>

            <div>
              <MultiSelectDropdown
                options={venueSections.map(s => s.name)}
                value={formData.firstAidLocations}
                onChange={vals => handleChange("firstAidLocations", vals)}
                placeholder="Select Locations"
                isDark={isDark}
              />
              {errors.firstAidLocations && <Alert type="error" message={errors.firstAidLocations} compact />}
            </div>
          </div>
        )}
      </div>

      {/* Emergency Exits */}
      {/* FIX: fix "e" on Emergency Exists Clearly Marked - Number of emergency exits */}
      <div className="mb-6">
        <label className="label font-semibold">Emergency Exits Clearly Marked?</label>
        <select
          value={formData.emergencyExitsMarked ? "Yes" : "No"}
          onChange={e => handleChange("emergencyExitsMarked", e.target.value === "Yes")}
          className={inputClass(errors.emergencyExitsMarked)}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        {formData.emergencyExitsMarked && (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                min={1}
                placeholder="Number of emergency exits"
                value={formData.numberOfEmergencyExits}
                onChange={e => handleChange("numberOfEmergencyExits", Number(e.target.value))}
                className={inputClass(errors.numberOfEmergencyExits)}
              />
              {errors.numberOfEmergencyExits && <Alert type="error" message={errors.numberOfEmergencyExits} compact />}
            </div>

            <div>
              <MultiSelectDropdown
                options={venueGates.map(g => g.name)}
                value={formData.emergencyExitLocations}
                onChange={vals => handleChange("emergencyExitLocations", vals)}
                placeholder="Select Emergency Exit Locations"
                isDark={isDark}
              />
              {errors.emergencyExitLocations && <Alert type="error" message={errors.emergencyExitLocations} compact />}
            </div>
          </div>
        )}
      </div>

      <NextButton onClick={handleNext} disabled={!isStaffSafetyFormComplete(formData)}>
        Next
      </NextButton>
    </FormLayout>
  );
};

export default StaffSafetyForm;
