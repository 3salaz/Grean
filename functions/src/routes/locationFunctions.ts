import * as functions from "firebase-functions";
import { createLocation, deleteLocation } from "../services/locationService";
import { authMiddleware } from "../utils/authMiddleware";

export const createLocationFunction = functions.https.onCall(async (data, context) => {
  const userId = authMiddleware(context);
  return await createLocation(userId, data);
});

export const deleteLocationFunction = functions.https.onCall(async (data, context) => {
  const userId = authMiddleware(context);
  return await deleteLocation(userId, data.locationId);
});
