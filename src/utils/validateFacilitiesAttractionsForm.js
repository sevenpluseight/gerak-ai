// utils/validateFacilitiesAttractionsForm.js

export const validateFacilitiesForm = (data) => {
  const errors = {};

  // Restrooms
  if (data.restroomsAvailable) {
    if (!data.restroomCount || data.restroomCount < 1) {
      errors.restroomCount = "Please enter a valid number of restrooms";
    }
    if (!data.restroomLocations || data.restroomLocations.length === 0) {
      errors.restroomLocations = "Please select at least one restroom location";
    }
  }

  // Food Courts
  if (data.foodCourtsAvailable) {
    if (!data.foodCourtCount || data.foodCourtCount < 1) {
      errors.foodCourtCount = "Please enter a valid number of food courts";
    }
    if (!data.foodCourtCapacity || data.foodCourtCapacity < 1) {
      errors.foodCourtCapacity = "Please enter a valid capacity per food court";
    }
    if (!data.foodCourtLocations || data.foodCourtLocations.length === 0) {
      errors.foodCourtLocations = "Please select at least one food court location";
    }
  }

  // Special Attractions
  if (data.specialAttractionsAvailable) {
    if (!data.specialAttractions || data.specialAttractions.length === 0) {
      errors.specialAttractions = "Please select at least one attraction";
    }
    data.specialAttractionsLocations?.forEach((loc, idx) => {
      if (!loc || loc.length === 0) {
        errors[`specialAttractionsLocations.${idx}`] = "Please assign a location for this attraction";
      }
    });
  }

  return errors;
};

export const isFacilitiesFormComplete = (data) =>
  Object.keys(validateFacilitiesForm(data)).length === 0;
