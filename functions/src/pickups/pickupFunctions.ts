import {Response} from "express";
import * as logger from "firebase-functions/logger";
import {createPickup, updatePickup, deletePickup} from "./pickupServices";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middleware/authMiddleware";
import {
  CreatePickupData,
  UpdatePickupData,
  DeletePickupData,
} from "./pickupTypes";

export const createPickupFunction = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    logger.info("🔥 createPickupFunction TRIGGERED with data:", req.body);
    try {
      const uid = req.user?.uid;
      if (!uid) {
        throw new Error("User UID is undefined.");
      }
      logger.info("✅ User authenticated:", uid);

      // Validate request body
      const pickupData = req.body as CreatePickupData;
      logger.info("📥 Received pickup data:", pickupData);
      if (!pickupData) {
        throw new Error("Invalid pickup data.");
      }

      const result = await createPickup(uid, pickupData);
      logger.info(
          "✅ Pickup request created successfully with ID:",
          result.pickupId
      );
      res.status(200).send({pickupId: result.pickupId});
    } catch (error) {
      logger.error(
          "❌ ERROR in createPickupFunction:",
          (error as Error).message,
          (error as Error).stack
      );
      res.status(500).send({error: (error as Error).message});
    }
  },
];

export const updatePickupFunction = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    logger.info("🔥 updatePickupFunction TRIGGERED with data:", req.body);
    try {
      const uid = req.user?.uid;
      if (!uid) {
        throw new Error("User UID is undefined.");
      }
      logger.info("✅ User authenticated:", uid);

      // Validate request body
      const {pickupId, updates} = req.body as UpdatePickupData;
      logger.info("📥 Received update pickup data:", {pickupId, updates});
      if (!pickupId || !updates) {
        throw new Error("Pickup ID and updates are required.");
      }

      await updatePickup(uid, pickupId, updates);
      logger.info("✅ Pickup updated successfully.");
      res.status(200).send({success: true});
    } catch (error) {
      logger.error(
          "❌ ERROR in updatePickupFunction:",
          (error as Error).message,
          (error as Error).stack
      );
      res.status(500).send({error: (error as Error).message});
    }
  },
];

export const deletePickupFunction = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    logger.info("🔥 deletePickupFunction TRIGGERED with data:", req.body);
    try {
      const uid = req.user?.uid;
      if (!uid) {
        throw new Error("User UID is undefined.");
      }
      logger.info("✅ User authenticated:", uid);

      // Validate request body
      const {pickupId} = req.body as DeletePickupData;
      logger.info("📥 Received delete pickup data:", {pickupId});
      if (!pickupId) {
        throw new Error("Pickup ID is required.");
      }

      await deletePickup(uid, pickupId);
      logger.info("✅ Pickup deleted successfully.");
      res.status(200).send({success: true});
    } catch (error) {
      logger.error(
          "❌ ERROR in deletePickupFunction:",
          (error as Error).message,
          (error as Error).stack
      );
      res.status(500).send({error: (error as Error).message});
    }
  },
];
