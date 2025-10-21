import { Response } from "express";
import * as logger from "firebase-functions/logger";
import { createLocation as createLocationService, updateLocation as updateLocationService, deleteLocation as deleteLocationService } from "./service";
import { authMiddleware, AuthenticatedRequest } from "../middleware/authMiddleware";
import {
  CreateLocationData,
  UpdateLocationData,
  DeleteLocationData,
} from "./types";

// CREATE
export const createLocation = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    logger.info("🔥 createLocation TRIGGERED with data:", req.body);

    try {
      const uid = req.user?.uid;
      if (!uid) throw new Error("User UID is undefined.");

      const locationData = req.body as CreateLocationData;
      const result = await createLocationService(uid, locationData);

      logger.info("✅ Location created with ID:", result.locationId);
      res.status(200).send({ locationId: result.locationId });
    } catch (error) {
      logger.error("❌ ERROR in createLocation:", error);
      res.status(500).send({ error: (error as Error).message });
    }
  },
];

// UPDATE
export const updateLocation = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    logger.info("🔥 updateLocation TRIGGERED with data:", req.body);

    try {
      const uid = req.user?.uid;
      if (!uid) throw new Error("User UID is undefined.");

      const { locationId, updates } = req.body as UpdateLocationData;
      await updateLocationService(uid, locationId, updates);

      logger.info("✅ Location updated:", locationId);
      res.status(200).send({ success: true });
    } catch (error) {
      logger.error("❌ ERROR in updateLocation:", error);
      res.status(500).send({ error: (error as Error).message });
    }
  },
];

// DELETE
export const deleteLocation = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    logger.info("🔥 deleteLocation TRIGGERED with data:", req.body);

    try {
      const uid = req.user?.uid;
      if (!uid) throw new Error("User UID is undefined.");

      const { locationId } = req.body as DeleteLocationData;
      await deleteLocationService(uid, locationId);

      logger.info("✅ Location deleted:", locationId);
      res.status(200).send({ success: true });
    } catch (error) {
      logger.error("❌ ERROR in deleteLocation:", error);
      res.status(500).send({ error: (error as Error).message });
    }
  },
];
