import React, { useState } from "react";
import { useTheme } from "../context/useTheme";
import Alert from "../components/Alert";
import NextButton from "../components/Button/NextButton";
import { useForm } from "../context/useForm";
import Dropdown from "../components/Dropdown/GeneralDropdown";
import MultiSelectDropdown from "../components/Dropdown/MultiSelectDropdown";
import { validateVenueForm, isVenueFormComplete } from "../utils/validateVenueDetailsForm";
import FormLayout from "../components/Layout/FormLayout";

// Default Sections
const standardSectionsDefault = [
  { name: "North", capacity: 0 },
  { name: "South", capacity: 0 },
  { name: "East", capacity: 0 },
  { name: "West", capacity: 0 },
];

const layoutOptions = ["Standard", "Custom"];
const gateTypes = ["General", "VIP Only", "Staff Only", "Emergency Exit", "Service/Delivery"];

const VenueDetailsForm = () => {
  const { isDark } = useTheme();
  const { updateFormData } = useForm();

  const [formData, setFormData] = useState({
    layoutType: "",
    sections: [],
    customFile: null,
    gates: [],
    vipZones: [],
    restrictedAreas: [],
  });

  const [errors, setErrors] = useState({});
  const [expandedGate, setExpandedGate] = useState(null);
  const [expandedVIP, setExpandedVIP] = useState(null);
  const [expandedRestricted, setExpandedRestricted] = useState(null);

  const inputClass = (error) =>
    `input input-bordered w-full ${
      isDark ? "bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600" : "bg-white text-gray-900 placeholder-gray-500 border-gray-700"
    } ${error ? "input-error" : ""}`;

  const handleLayoutChange = (val) => {
    setFormData(prev => ({
      ...prev,
      layoutType: val,
      sections: val === "Standard" ? standardSectionsDefault : [],
      customFile: null,
    }));
  };

  const handleSectionChange = (idx, key, value) => {
    const sections = [...formData.sections];
    sections[idx][key] = key === "capacity" ? Number(value) : value;
    setFormData(prev => ({ ...prev, sections }));
  };

  const handleFileUpload = (e) => setFormData(prev => ({ ...prev, customFile: e.target.files[0] }));

  const addGate = () => {
    setFormData(prev => ({
      ...prev,
      gates: [
        ...prev.gates,
        { name: `Gate ${String.fromCharCode(65 + prev.gates.length)}`, type: "General", capacity: 0, accessibility: [], connectedSections: [] }
      ]
    }));
  };

  const handleGateChange = (idx, key, value) => {
    const gates = [...formData.gates];
    gates[idx][key] = key === "capacity" ? Number(value) : value;
    setFormData(prev => ({ ...prev, gates }));
  };

  const addVIPZone = () => {
    setFormData(prev => ({
      ...prev,
      vipZones: [...prev.vipZones, { name: `VIP Zone ${prev.vipZones.length + 1}`, location: "", gates: [], capacity: 0 }]
    }));
  };

  const handleVIPZoneChange = (idx, key, value) => {
    const vipZones = [...formData.vipZones];
    vipZones[idx][key] = value;
    setFormData(prev => ({ ...prev, vipZones }));
  };

  const addRestrictedArea = () => {
    setFormData(prev => ({
      ...prev,
      restrictedAreas: [...prev.restrictedAreas, { location: "", type: "Construction", duration: "" }]
    }));
  };

  const handleRestrictedAreaChange = (idx, key, value) => {
    const restrictedAreas = [...formData.restrictedAreas];
    restrictedAreas[idx][key] = value;
    setFormData(prev => ({ ...prev, restrictedAreas }));
  };

  const handleNext = () => {
    const validationErrors = validateVenueForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      updateFormData("venue", formData);
      // TODO: navigate to next step
    }
  };

  return (
    <FormLayout title="Venue Details">
      {/* Layout */}
      <Dropdown
        label="Seating Layout Type"
        options={layoutOptions}
        value={formData.layoutType}
        onChange={handleLayoutChange}
        error={errors.layoutType}
        isDark={isDark}
      />
      {errors.layoutType && <Alert type="error" message={errors.layoutType} compact />}

      {/* Sections */}
      {formData.layoutType === "Standard" &&
        formData.sections.map((section, idx) => (
          <div key={idx} className="grid grid-cols-2 gap-4">
            <div>
              <label className="label font-semibold">Section Name</label>
              <input type="text" value={section.name} onChange={e => handleSectionChange(idx, "name", e.target.value)} className={inputClass(errors[`sections.${idx}.name`])} />
              {errors[`sections.${idx}.name`] && <Alert type="error" message={errors[`sections.${idx}.name`]} compact />}
            </div>
            <div>
              <label className="label font-semibold">Capacity</label>
              <input type="number" min={1} value={section.capacity} onChange={e => handleSectionChange(idx, "capacity", e.target.value)} className={inputClass(errors[`sections.${idx}.capacity`])} />
              {errors[`sections.${idx}.capacity`] && <Alert type="error" message={errors[`sections.${idx}.capacity`]} compact />}
            </div>
          </div>
        ))}

      {formData.layoutType === "Custom" && (
        <div>
          <label className="label font-semibold">Upload CSV/JSON</label>
          <input type="file" accept=".csv,.json" onChange={handleFileUpload} className={inputClass(errors.customFile)} />
          {errors.customFile && <Alert type="error" message={errors.customFile} compact />}
        </div>
      )}

      {/* Gates */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Gates / Entrances</h2>
          <button type="button" className="btn btn-sm" onClick={addGate}>Add Gate</button>
        </div>
        {formData.gates.map((gate, idx) => (
          <div key={idx} className="border rounded p-2 mb-2">
            <div className="cursor-pointer font-semibold" onClick={() => setExpandedGate(expandedGate === idx ? null : idx)}>
              {gate.name || `Gate ${idx + 1}`}
            </div>
            {expandedGate === idx && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                <input type="text" value={gate.name} placeholder="Gate Name" onChange={e => handleGateChange(idx, "name", e.target.value)} className={inputClass()} />
                <Dropdown options={gateTypes} value={gate.type} onChange={val => handleGateChange(idx, "type", val)} isDark={isDark} />
                <input type="number" min={1} value={gate.capacity} placeholder="Max Capacity" onChange={e => handleGateChange(idx, "capacity", e.target.value)} className={inputClass()} />
                <MultiSelectDropdown options={formData.sections.map(s => s.name)} value={gate.connectedSections} onChange={vals => handleGateChange(idx, "connectedSections", vals)} placeholder="Connected Sections" isDark={isDark} />
                <input type="text" value={gate.accessibility?.join(", ")} placeholder="Accessibility Features (comma)" onChange={e => handleGateChange(idx, "accessibility", e.target.value.split(",").map(s => s.trim()))} className={inputClass()} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* VIP Zones */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">VIP Zones</h2>
          <button type="button" className="btn btn-sm" onClick={addVIPZone}>Add VIP Zone</button>
        </div>
        {formData.vipZones.map((zone, idx) => (
          <div key={idx} className="border rounded p-2 mb-2">
            <div className="cursor-pointer font-semibold" onClick={() => setExpandedVIP(expandedVIP === idx ? null : idx)}>
              {zone.name || `VIP Zone ${idx + 1}`}
            </div>
            {expandedVIP === idx && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                <input type="text" value={zone.name} placeholder="VIP Zone Name" onChange={e => handleVIPZoneChange(idx, "name", e.target.value)} className={inputClass()} />
                <input type="text" value={zone.location} placeholder="Location" onChange={e => handleVIPZoneChange(idx, "location", e.target.value)} className={inputClass()} />
                <input type="number" min={1} value={zone.capacity} placeholder="Capacity" onChange={e => handleVIPZoneChange(idx, "capacity", e.target.value)} className={inputClass()} />
                <MultiSelectDropdown options={formData.gates.map(g => g.name)} value={zone.gates} onChange={vals => handleVIPZoneChange(idx, "gates", vals)} placeholder="Connected Gates" isDark={isDark} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Restricted Areas */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Restricted Areas</h2>
          <button type="button" className="btn btn-sm" onClick={addRestrictedArea}>Add Restricted Area</button>
        </div>
        {formData.restrictedAreas.map((area, idx) => (
          <div key={idx} className="border rounded p-2 mb-2">
            <div className="cursor-pointer font-semibold" onClick={() => setExpandedRestricted(expandedRestricted === idx ? null : idx)}>
              {area.location || `Restricted Area ${idx + 1}`}
            </div>
            {expandedRestricted === idx && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <input type="text" value={area.location} placeholder="Location" onChange={e => handleRestrictedAreaChange(idx, "location", e.target.value)} className={inputClass()} />
                <Dropdown options={["Construction", "Maintenance", "Other"]} value={area.type} onChange={val => handleRestrictedAreaChange(idx, "type", val)} isDark={isDark} />
                <input type="text" value={area.duration} placeholder="Duration" onChange={e => handleRestrictedAreaChange(idx, "duration", e.target.value)} className={inputClass()} />
              </div>
            )}
          </div>
        ))}
      </div>

      <NextButton onClick={handleNext} disabled={!isVenueFormComplete(formData)}>Next</NextButton>
    </FormLayout>
  );
};

export default VenueDetailsForm;
