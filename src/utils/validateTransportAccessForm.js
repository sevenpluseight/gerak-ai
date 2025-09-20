export const validateTransportAccessForm = (data) => {
  const errors = {};

  // Helper regex for HH:MM format
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  // Public transport validation
  if (data.publicTransportAvailable) {
    if (!data.transportModes || data.transportModes.length === 0) {
      errors.transportModes = "Please select at least one transport mode";
    }

    if (!data.transportSchedules || data.transportSchedules.length === 0) {
      errors.transportSchedules = "Please add at least one schedule time";
    } else {
      data.transportSchedules.forEach((time, idx) => {
        if (!time || !timeRegex.test(time)) {
          errors[`transportSchedules.${idx}`] = "Invalid time format (HH:MM)";
        }
      });
    }

    if (data.transportCapacityPerTrip && data.transportCapacityPerTrip < 1) {
      errors.transportCapacityPerTrip = "Capacity per trip must be a positive number";
    }
  }

  // Parking validation
  if (data.parkingAvailable) {
    if (!data.parkingCapacity || data.parkingCapacity < 1) {
      errors.parkingCapacity = "Please enter a valid parking capacity";
    }
    if (!data.entryLanes || data.entryLanes < 1) {
      errors.entryLanes = "Please enter a valid number of entry lanes";
    }
    if (!data.exitLanes || data.exitLanes < 1) {
      errors.exitLanes = "Please enter a valid number of exit lanes";
    }
  }

  return errors;
};

export const isTransportAccessFormComplete = (data) => {
  return Object.keys(validateTransportAccessForm(data)).length === 0;
};
