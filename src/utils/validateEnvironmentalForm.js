export const validateEnvironmentalForm = (formData) => {
  const errors = {};

  // Weather is required
  if (!formData.weather) {
    errors.weather = "Please select the weather forecast/consideration.";
  }

  // Nearby Events
  if (typeof formData.nearbyEvents !== "boolean") {
    errors.nearbyEvents = "Please indicate if there are nearby events.";
  }

  if (formData.nearbyEvents) {
    if (!formData.eventName || formData.eventName.trim() === "") {
      errors.eventName = "Event name is required.";
    }

    if (!formData.eventLocation || formData.eventLocation.trim() === "") {
      errors.eventLocation = "Event location is required.";
    }

    if (!formData.eventStart) {
      errors.eventStart = "Event start date and time is required.";
    }

    if (!formData.eventEnd) {
      errors.eventEnd = "Event end date and time is required.";
    } else if (formData.eventStart && formData.eventEnd < formData.eventStart) {
      errors.eventEnd = "Event end cannot be before start time.";
    }

    if (!formData.expectedAttendance || formData.expectedAttendance <= 0) {
      errors.expectedAttendance = "Expected attendance must be greater than 0.";
    }
  }

  return errors;
};

export const isEnvironmentalFormComplete = (formData) => {
  const errors = validateEnvironmentalForm(formData);
  return Object.keys(errors).length === 0;
};
