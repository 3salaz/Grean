import {
  createProfileFunction,
  updateProfileFunction,
  deleteProfileFunction,
} from "./routes/profileFunctions.js";

import {
  createLocationFunction,
  updateLocationFunction,
  deleteLocationFunction,
} from "./routes/locationFunctions.js";

import {
  createPickupFunction,
  editPickupFunction,
  deletePickupFunction,
} from "./routes/pickupFunctions.js";

// 🔥 Export Profile Functions
export const createProfile = createProfileFunction;
export const updateProfile = updateProfileFunction;
export const deleteProfile = deleteProfileFunction;

// 🔥 Export Location Functions
export const createLocation = createLocationFunction;
export const updateLocation = updateLocationFunction;
export const deleteLocation = deleteLocationFunction;

// 🔥 Export Pickup Functions
export const createPickup = createPickupFunction;
export const editPickup = editPickupFunction;
export const deletePickup = deletePickupFunction;
