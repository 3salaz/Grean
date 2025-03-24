import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {
  createLocation,
  updateLocation,
  deleteLocation,
} from "./locationServices";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  CreateLocationData,
  UpdateLocationData,
  DeleteLocationData,
} from "./locationTypes";

/** ✅ Create Location Function */
export const createLocationFunction = onCall<CreateLocationData>(
  async (request) => {
    logger.info("🔥 create TRIGGERED with data:", request.data);
    try {
      const uid = await authMiddleware(request); // 🔒 Secure function
      logger.info("✅ User authenticated:", uid);

      const result = await createLocation(uid, request.data);
      return { locationId: result.locationId };
    } catch (error) {
      logger.error("❌ ERROR:", error);
      throw new HttpsError("internal", (error as Error).message);
    }
  }
);

/** ✅ Update Location Function */
export const updateLocationFunction = onCall<UpdateLocationData>(
  async (request) => {
    logger.info("🔥 update TRIGGERED with data:", request.data);
    try {
      const uid = await authMiddleware(request); // 🔒 Secure function
      logger.info("✅ User authenticated:", uid);

      const { locationId, updates } = request.data;
      await updateLocation(uid, locationId, updates);
      return { success: true };
    } catch (error) {
      logger.error("❌ ERROR:", error);
      throw new HttpsError("internal", (error as Error).message);
    }
  }
);

/** ✅ Delete Location Function */
export const deleteLocationFunction = onCall<DeleteLocationData>(
  async (request) => {
    logger.info("🔥 delete TRIGGERED with data:", request.data);
    try {
      const uid = await authMiddleware(request); // 🔒 Secure function
      logger.info("✅ User authenticated:", uid);

      const { locationId } = request.data;
      await deleteLocation(uid, locationId);
      return { success: true };
    } catch (error) {
      logger.error("❌ ERROR:", error);
      throw new HttpsError("internal", (error as Error).message);
    }
  }
);
