import {Response} from "express";
import * as logger from "firebase-functions/logger";
import {
  createPickup,
  updatePickupField,
  updatePickupBulk,
  deletePickup,
} from "./pickupServices";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middleware/authMiddleware";
import {
  UpdatePickupData,
  UpdatePickupFieldData,
  CreatePickupData,
  DeletePickupData,
  PickupUpdateOperation,
} from "./pickupTypes";
import {db} from "../firebase";

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
    try {
      const uid = req.user?.uid;
      if (!uid) {
        throw new Error("User UID is undefined.");
      }
      logger.info("✅ User authenticated:", uid);

      const {
        pickupId,
        field,
        value,
        operation = "update",
        updates,
      } = req.body as UpdatePickupFieldData & UpdatePickupData;

      // Fetch the user profile to check if they are a "Driver"
      const profileSnap = await db.collection("profiles").doc(uid).get();
      const profileData = profileSnap.data();
      const isDriver = profileData?.accountType === "Driver";

      if (!isDriver && !field) {
        throw new Error(
            "Unauthorized-Only the pickup creator or a driver can update " +
            "this pickup."
        );
      }

      // Check if the pickup field exists, and call the appropriate function
      if (field && value !== undefined) {
        if (isDriver && !["isAccepted", "acceptedBy"].includes(field)) {
          throw new Error(
              "Unauthorized: Drivers can only update " + "certain fields."
          );
        }
        await updatePickupField(
            uid,
            pickupId,
            field,
            value,
          operation as PickupUpdateOperation
        );
      } else if (updates) {
        await updatePickupBulk(uid, pickupId, updates);
      } else {
        throw new Error("Invalid update data.");
      }

      res.status(200).send({success: true});
    } catch (error) {
      logger.error("❌ ERROR in updatePickupFunction:", error);
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
