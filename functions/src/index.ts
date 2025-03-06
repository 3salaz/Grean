import {
  createProfileFunction,
  updateProfileFunction,
  deleteProfileFunction,
} from "./routes/profileFunctions";

// 🔥 Export Profile Functions
exports.createProfile = createProfileFunction;
exports.updateProfile = updateProfileFunction;
exports.deleteProfile = deleteProfileFunction;

import {
  createLocationFunction,
  updateLocationFunction,
  deleteLocationFunction,
} from "./routes/locationFunctions";

// 🔥 Export Location Functions
exports.createLocation = createLocationFunction;
exports.updateLocation = updateLocationFunction;
exports.deleteLocation = deleteLocationFunction;
