export const isVenueFormComplete = (formData) => {
  // Sections
  const sectionsComplete =
    formData.HeaderLayoutType === "Standard"
      ? formData.sections.length > 0 && formData.sections.every(s => s.name && s.capacity > 0)
      : formData.HeaderLayoutType === "Custom"
      ? !!formData.customFile
      : false;

  // Gates
  const gatesComplete =
    formData.gates &&
    formData.gates.length > 0 &&
    formData.gates.every(g =>
      g.name && g.type && g.capacity > 0 && 
      (g.type !== "Service/Delivery" ? g.connectedSections?.length > 0 : true)
    );

  // VIP Zones
  const vipComplete =
    !formData.hasVIPZones ||
    (formData.vipZones &&
      formData.vipZones.length > 0 &&
      formData.vipZones.every(v => v.name && v.location && v.entryExitGates?.length > 0 && v.capacity > 0));

  // Restricted Areas
  const restrictedComplete =
    !formData.hasRestrictedAreas ||
    (formData.restrictedAreas &&
      formData.restrictedAreas.length > 0 &&
      formData.restrictedAreas.every(r => r.location && r.type));

  return sectionsComplete && gatesComplete && vipComplete && restrictedComplete;
};

export const validateVenueForm = (formData) => {
  const errors = {};

  // HeaderLayout Type
  if (!formData.HeaderLayoutType) {
    errors.HeaderLayoutType = "Please select a seating HeaderLayout type";
  }

  // Sections
  if (formData.HeaderLayoutType === "Standard") {
    if (!formData.sections || formData.sections.length === 0) {
      errors.sections = "At least one section is required";
    } else {
      formData.sections.forEach((s, i) => {
        if (!s.name) errors[`sections.${i}.name`] = "Section name is required";
        if (!s.capacity || s.capacity <= 0) errors[`sections.${i}.capacity`] = "Capacity must be a positive number";
      });
    }
  }

  if (formData.HeaderLayoutType === "Custom") {
    if (!formData.customFile) errors.customFile = "Please upload a CSV or JSON file";
  }

  // Gates
  if (!formData.gates || formData.gates.length === 0) {
    errors.gates = "At least one gate is required";
  } else {
    formData.gates.forEach((g, i) => {
      if (!g.name) errors[`gates.${i}.name`] = "Gate name is required";
      if (!g.type) errors[`gates.${i}.type`] = "Gate type is required";
      if (!g.capacity || g.capacity <= 0) errors[`gates.${i}.capacity`] = "Capacity must be a positive number";
      if (g.type !== "Service/Delivery" && (!g.connectedSections || g.connectedSections.length === 0)) {
        errors[`gates.${i}.connectedSections`] = "Select at least one section";
      }
    });
  }

  // VIP Zones
  if (formData.hasVIPZones) {
    if (!formData.vipZones || formData.vipZones.length === 0) {
      errors.vipZones = "Add at least one VIP zone";
    } else {
      formData.vipZones.forEach((v, i) => {
        if (!v.name) errors[`vipZones.${i}.name`] = "VIP zone name is required";
        if (!v.location) errors[`vipZones.${i}.location`] = "Location is required";
        if (!v.entryExitGates || v.entryExitGates.length === 0) errors[`vipZones.${i}.entryExitGates`] = "Select at least one gate";
        if (!v.capacity || v.capacity <= 0) errors[`vipZones.${i}.capacity`] = "Capacity must be a positive number";
      });
    }
  }

  // Restricted Areas
  if (formData.hasRestrictedAreas) {
    if (!formData.restrictedAreas || formData.restrictedAreas.length === 0) {
      errors.restrictedAreas = "Add at least one restricted area";
    } else {
      formData.restrictedAreas.forEach((r, i) => {
        if (!r.location) errors[`restrictedAreas.${i}.location`] = "Location is required";
        if (!r.type) errors[`restrictedAreas.${i}.type`] = "Restriction type is required";
      });
    }
  }

  return errors;
};
