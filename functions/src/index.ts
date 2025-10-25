import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";

// Pickup routes
import {
  createPickup,
  updatePickup,
  deletePickup,
  completePickup,
} from "./pickups/handlers";

// Location routes
import {
  createLocation,
  updateLocation,
  deleteLocation,
} from "./locations/handlers";

// Profile routes
import {
  createProfile,
  updateProfile,
  deleteProfile,
} from "./profile/handlers";

// Initialize Express app
const app = express();

// Middleware
app.use(cors({origin: true}));

// Profile Routes
app.post("/profile/create", createProfile);
app.post("/profile/update", updateProfile);
app.post("/profile/delete", deleteProfile);

// Location Routes
app.post("/location/create", createLocation);
app.post("/location/update", updateLocation);
app.post("/location/delete", deleteLocation);

// Pickup Routes
app.post("/pickup/create", createPickup);
app.post("/pickup/update", updatePickup);
app.post("/pickup/delete", deletePickup);
app.post("/pickup/complete", completePickup);

// Export the Express app
exports.api = functions.https.onRequest(app);
