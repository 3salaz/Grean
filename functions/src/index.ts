import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";

import {
  createProfileFunction,
  updateProfileFunction,
  deleteProfileFunction,
} from "./profile/profileFunctions";

import {
  createLocationFunction,
  updateLocationFunction,
  deleteLocationFunction,
} from "./locations/locationFunctions";

// import {
//   createPickupFunction,
//   updatePickupFunction,
//   deletePickupFunction,
// } from "./pickups/pickupFunctions";

// Initialize Express app
const app = express();

// Apply CORS middleware
app.use(cors({ origin: true }));

// Define routes for your functions
app.post("/createProfileFunction", createProfileFunction);
app.post("/updateProfileFunction", updateProfileFunction);
app.post("/deleteProfileFunction", deleteProfileFunction);
app.post("/createLocationFunction", createLocationFunction);
app.post("/updateLocationFunction", updateLocationFunction);
app.post("/deleteLocationFunction", deleteLocationFunction);
// app.post("/createPickupFunction", createPickupFunction);
// app.post("/updatePickupFunction", updatePickupFunction);
// app.post("/deletePickupFunction", deletePickupFunction);

// Export the Express app as a Firebase function
exports.api = functions.https.onRequest(app);
