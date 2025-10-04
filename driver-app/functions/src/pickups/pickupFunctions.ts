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
import {admin, db} from "../firebase";
import {updateUserStats} from "../services/profileStats";

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

      const pickupRef = db.collection("pickups").doc(pickupId);

      // ✅ Fetch profile to check role
      const profileSnap = await db.collection("profiles").doc(uid).get();
      const profileData = profileSnap.data();
      const isDriver = profileData?.accountType === "Driver";

      if (!isDriver && !field && !updates) {
        throw new Error(
            "Unauthorized: Only the pickup creator or a driver can update"
        );
      }

      // ✅ Handle array operations
      if (field && value !== undefined) {
        if (operation === "addToArray") {
          await pickupRef.update({
            [field]: admin.firestore.FieldValue.arrayUnion(value),
          });
        } else if (operation === "removeFromArray") {
          await pickupRef.update({
            [field]: admin.firestore.FieldValue.arrayRemove(value),
          });
        } else {
          if (isDriver && !["acceptedBy", "status", "pickupNote"].includes(field)) {
            throw new Error(
                "Unauthorized: Drivers can update acceptedBy, status, or pickupNote."
            );
          }

          await updatePickupField(
              uid,
              pickupId,
              field,
              value,
            operation as PickupUpdateOperation
          );
        }
      } else if (updates) {
        await updatePickupBulk(uid, pickupId, updates);
      } else {
        throw new Error("Invalid update request. Missing field or updates.");
      }
      res.status(200).send({success: true});
    } catch (error) {
      logger.error("❌ ERROR in updatePickupFunction:", error);
      res.status(500).send({error: (error as Error).message});
    }
  },
];

export const completePickupFunction = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    logger.info("🔥 completePickupFunction TRIGGERED with data:", req.body);
    try {
      const {pickupId, materials} = req.body;

      if (!pickupId || !Array.isArray(materials)) {
        return res.status(400).json({error: "Missing pickupId or materials"});
      }

      const pickupRef = db.collection("pickups").doc(pickupId);
      const pickupDoc = await pickupRef.get();

      if (!pickupDoc.exists) {
        return res.status(404).json({error: "Pickup not found"});
      }

      const pickup = pickupDoc.data();
      const userId = pickup?.createdBy?.userId;
      const driverId = pickup?.acceptedBy;

      await pickupRef.update({
        status: "completed",
        materials,
        isCompleted: true,
      });

      if (userId) await updateUserStats(userId, materials);
      if (driverId) await updateUserStats(driverId, materials);

      return res.status(200).json({success: true});
    } catch (error) {
      logger.error("❌ ERROR in completePickupFunction:", error);
      return res.status(500).json({error: (error as Error).message});
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
