export const validateStaffSafetyForm = (formData) => {
  const errors = {};

  // Security Staff
  if (formData.securityStaffAvailable) {
    if (!formData.totalStaffCount || formData.totalStaffCount < 1) {
      errors.totalStaffCount = "Please enter a valid total staff count.";
    }
    if (!formData.deploymentZones || formData.deploymentZones.length === 0) {
      errors.deploymentZones = "Please select at least one deployment zone.";
    }
  }

  // First Aid Stations
  if (formData.firstAidAvailable) {
    if (!formData.numberOfStations || formData.numberOfStations < 1) {
      errors.numberOfStations = "Please enter a valid number of first aid stations.";
    }
    if (!formData.firstAidLocations || formData.firstAidLocations.length === 0) {
      errors.firstAidLocations = "Please select at least one first aid location.";
    }
  }

  // Emergency Exits
  if (formData.emergencyExitsMarked) {
    if (!formData.numberOfEmergencyExits || formData.numberOfEmergencyExits < 1) {
      errors.numberOfEmergencyExits = "Please enter a valid number of emergency exits.";
    }
    if (!formData.emergencyExitLocations || formData.emergencyExitLocations.length === 0) {
      errors.emergencyExitLocations = "Please select at least one exit location.";
    }
  }

  return errors;
};

export const isStaffSafetyFormComplete = (formData) => {
  const errors = validateStaffSafetyForm(formData);
  return Object.keys(errors).length === 0;
};
