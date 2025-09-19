import React, { useState } from "react";
import { useTheme } from "../context/useTheme";
import { useForm } from "../context/useForm";
import FormLayout from "../components/Layout/FormLayout";
import Dropdown from "../components/Dropdown/GeneralDropdown";
import MultiSelectDropdown from "../components/Dropdown/MultiSelectDropdown";
import Alert from "../components/Alert";
import NextButton from "../components/Button/NextButton";
import { validateFacilitiesForm, isFacilitiesFormComplete } from "../utils/validateFacilitiesAttractionsForm";

const FacilitiesAttractionsForm = ({ sections = ["North", "South", "East", "West"] }) => {
  const { isDark } = useTheme();
  const { updateFormData } = useForm();

  const [formData, setFormData] = useState({
    restroomsAvailable: false,
    restroomCount: "",
    restroomLocations: [],
    foodCourtsAvailable: false,
    foodCourtCount: "",
    foodCourtCapacity: "",
    foodCourtLocations: [],
    specialAttractionsAvailable: false,
    specialAttractions: [],
    specialAttractionsLocations: [],
  });

  const [errors, setErrors] = useState({});

  const inputClass = (error) =>
    `input input-bordered w-full ${
      isDark ? "bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600" : "bg-white text-gray-900 placeholder-gray-500 border-gray-700"
    } ${error ? "input-error" : ""}`;

  const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleNext = () => {
    const validationErrors = validateFacilitiesForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      updateFormData("facilities", formData);
      // TODO: Navigate to next step
    }
  };

  return (
    <FormLayout title="Facilities & Attractions">

      {/* Restrooms */}
      <div>
        <label className="label font-semibold">Restrooms Available?</label>
        <select
          value={formData.restroomsAvailable ? "Yes" : "No"}
          onChange={e => handleChange("restroomsAvailable", e.target.value === "Yes")}
          className={inputClass(errors.restroomsAvailable)}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        {formData.restroomsAvailable && (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              min={1}
              placeholder="Number of restrooms"
              value={formData.restroomCount}
              onChange={e => handleChange("restroomCount", Number(e.target.value))}
              className={inputClass(errors.restroomCount)}
            />
            <MultiSelectDropdown
              options={sections}
              value={formData.restroomLocations}
              onChange={vals => handleChange("restroomLocations", vals)}
              placeholder="Select Locations"
              isDark={isDark}
            />
          </div>
        )}
        {errors.restroomCount && <Alert type="error" message={errors.restroomCount} compact />}
        {errors.restroomLocations && <Alert type="error" message={errors.restroomLocations} compact />}
      </div>

      {/* Food Courts */}
      <div className="mt-6">
        <label className="label font-semibold">Food Courts / Vendors Available?</label>
        <select
          value={formData.foodCourtsAvailable ? "Yes" : "No"}
          onChange={e => handleChange("foodCourtsAvailable", e.target.value === "Yes")}
          className={inputClass(errors.foodCourtsAvailable)}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        {formData.foodCourtsAvailable && (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              min={1}
              placeholder="Number of food courts"
              value={formData.foodCourtCount}
              onChange={e => handleChange("foodCourtCount", Number(e.target.value))}
              className={inputClass(errors.foodCourtCount)}
            />
            <input
              type="number"
              min={1}
              placeholder="Capacity per food court"
              value={formData.foodCourtCapacity}
              onChange={e => handleChange("foodCourtCapacity", Number(e.target.value))}
              className={inputClass(errors.foodCourtCapacity)}
            />
            <MultiSelectDropdown
              options={sections}
              value={formData.foodCourtLocations}
              onChange={vals => handleChange("foodCourtLocations", vals)}
              placeholder="Select Locations"
              isDark={isDark}
            />
          </div>
        )}
        {errors.foodCourtCount && <Alert type="error" message={errors.foodCourtCount} compact />}
        {errors.foodCourtCapacity && <Alert type="error" message={errors.foodCourtCapacity} compact />}
        {errors.foodCourtLocations && <Alert type="error" message={errors.foodCourtLocations} compact />}
      </div>

      {/* Special Attractions */}
      <div className="mt-6">
        <label className="label font-semibold">Special Attraction Points?</label>
        <select
          value={formData.specialAttractionsAvailable ? "Yes" : "No"}
          onChange={e => handleChange("specialAttractionsAvailable", e.target.value === "Yes")}
          className={inputClass(errors.specialAttractionsAvailable)}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        {formData.specialAttractionsAvailable && (
          <div className="mt-2 grid grid-cols-1 gap-4">
            <MultiSelectDropdown
              options={["Merch Booth", "Photo Spot", "Side Stage", "Meet & Greet", "Other"]}
              value={formData.specialAttractions}
              onChange={vals => handleChange("specialAttractions", vals)}
              placeholder="Select Attractions"
              isDark={isDark}
            />
            {formData.specialAttractions.map((attr, idx) => (
              <MultiSelectDropdown
                key={idx}
                options={sections}
                value={formData.specialAttractionsLocations[idx] || []}
                onChange={vals => {
                  const locations = [...formData.specialAttractionsLocations];
                  locations[idx] = vals;
                  handleChange("specialAttractionsLocations", locations);
                }}
                placeholder={`Assign location for ${attr}`}
                isDark={isDark}
              />
            ))}
          </div>
        )}

        {errors.specialAttractions && <Alert type="error" message={errors.specialAttractions} compact />}
        {formData.specialAttractionsLocations.map((_, idx) => {
          const key = `specialAttractionsLocations.${idx}`;
          return errors[key] ? <Alert key={idx} type="error" message={errors[key]} compact /> : null;
        })}
      </div>

      <NextButton onClick={handleNext} disabled={!isFacilitiesFormComplete(formData)}>Next</NextButton>
    </FormLayout>
  );
};

export default FacilitiesAttractionsForm;
