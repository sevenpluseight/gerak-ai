// utils/validateBasicEventForm.js

export const validateBasicEventForm = (formData) => {
  const errors = {};

  if (!formData.eventName) errors.eventName = "Event name is required";
  if (!formData.eventType) errors.eventType = "Event type is required";
  if (formData.eventType === "Other" && !formData.customEventType)
    errors.customEventType = "Please specify custom event type";
  if (!formData.startDate) errors.startDate = "Start date is required";
  if (!formData.endDate) errors.endDate = "End date is required";
  if (formData.startDate && formData.endDate && formData.startDate > formData.endDate)
    errors.endDate = "End date must be after start date";
  if (!formData.venue) errors.venue = "Venue is required";
  if (!formData.estimatedAttendance) errors.estimatedAttendance = "Estimated attendance is required";

  return errors;
};

// Returns true if all required fields are filled out
export const isBasicEventFormComplete = (formData) => {
  if (
    !formData.eventName ||
    !formData.eventType ||
    (formData.eventType === "Other" && !formData.customEventType) ||
    !formData.startDate ||
    !formData.endDate ||
    !formData.venue ||
    !formData.estimatedAttendance
  ) {
    return false;
  }
  return true;
};