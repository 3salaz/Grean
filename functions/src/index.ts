import {
  createProfileFunction,
  readProfileFunction,
  updateProfileFunction,
  deleteProfileFunction,
} from "./routes/profileFunctions";

exports.createProfile = createProfileFunction;
exports.readProfile = readProfileFunction;
exports.updateProfile = updateProfileFunction;
exports.deleteProfile = deleteProfileFunction;
