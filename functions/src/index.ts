import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";

// Pickup routes
import {
  createPickup,
  updatePickup,
  deletePickup,
  completePickup,
} from "./pickups/functions";

// Location routes
import {
  createLocationFunction,
  updateLocationFunction,
  deleteLocationFunction,
} from "./locations/locationFunctions";

// Profile routes
import {
  createProfileFunction,
  updateProfileFunction,
  deleteProfileFunction,
} from "./profile/profileFunctions";

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));

// Profile Routes
app.post("/profile/create", createProfileFunction);
app.post("/profile/update", updateProfileFunction);
app.post("/profile/delete", deleteProfileFunction);

// Location Routes
app.post("/location/create", createLocationFunction);
app.post("/location/update", updateLocationFunction);
app.post("/location/delete", deleteLocationFunction);

// Pickup Routes
app.post("/pickup/create", createPickup);
app.post("/pickup/update", updatePickup);
app.post("/pickup/delete", deletePickup);
app.post("/pickup/complete", completePickup);

// Export the Express app
exports.api = functions.https.onRequest(app);
