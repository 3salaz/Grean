// functions/src/pickups/functions.ts
import { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import {
  updatePickupField,
  updatePickupBulk,
  deletePickup as deletePickupService,
  createPickup as createPickupService,
} from "./services";
import {
  UpdatePickupData,
  UpdatePickupFieldData,
  CreatePickupData,
  DeletePickupData,
  PickupUpdateOperation,
} from "./types";
import { admin, db } from "../firebase";
import { updateUserStats } from "../services/profileStats";
import { decodeAuthToken } from "../middleware/authMiddleware";

const getUidFromRequest = async (req: Request): Promise<string> => {
  const decoded = await decodeAuthToken(req);
  return decoded.uid;
};

export const createPickup = async (req: Request, res: Response) => {
  try {
    const uid = await getUidFromRequest(req);
    const pickupData = req.body as CreatePickupData;

    const result = await createPickupService(uid, pickupData);
    logger.info("✅ Pickup created:", result.pickupId);
    res.status(200).send({ pickupId: result.pickupId });
  } catch (error) {
    logger.error("❌ createPickup error:", error);
    res.status(500).send({ error: (error as Error).message });
  }
};

export const updatePickup = async (req: Request, res: Response) => {
  try {
    const uid = await getUidFromRequest(req);
    const { pickupId, field, value, operation = "update", updates } =
      req.body as UpdatePickupFieldData & UpdatePickupData;

    const pickupRef = db.collection("pickups").doc(pickupId);
    const profileSnap = await db.collection("profiles").doc(uid).get();
    const profileData = profileSnap.data();
    const isDriver = profileData?.accountType === "Driver";

    if (!isDriver && !field && !updates) {
      throw new Error("Unauthorized update.");
    }

    if (field && value !== undefined) {
      if (operation === "addToArray") {
        await pickupRef.update({ [field]: admin.firestore.FieldValue.arrayUnion(value) });
      } else if (operation === "removeFromArray") {
        await pickupRef.update({ [field]: admin.firestore.FieldValue.arrayRemove(value) });
      } else {
        if (isDriver && !["acceptedBy", "status", "pickupNote"].includes(field)) {
          throw new Error("Unauthorized: Drivers can only update acceptedBy, status, pickupNote.");
        }
        await updatePickupField(uid, pickupId, field, value, operation as PickupUpdateOperation);
      }
    } else if (updates) {
      await updatePickupBulk(uid, pickupId, updates);
    } else {
      throw new Error("Missing update field or updates.");
    }

    res.status(200).send({ success: true });
  } catch (error) {
    logger.error("❌ updatePickup error:", error);
    res.status(500).send({ error: (error as Error).message });
  }
};

export const completePickup = async (req: Request, res: Response) => {
  try {
    const { pickupId, materials } = req.body;
    if (!pickupId || !Array.isArray(materials)) {
      return res.status(400).json({ error: "Missing pickupId or materials" });
    }

    const pickupRef = db.collection("pickups").doc(pickupId);
    const pickupDoc = await pickupRef.get();
    if (!pickupDoc.exists) return res.status(404).json({ error: "Pickup not found" });

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

    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error("❌ completePickup error:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const deletePickup = async (req: Request, res: Response) => {
  try {
    const uid = await getUidFromRequest(req);
    const { pickupId } = req.body as DeletePickupData;

    if (!pickupId) throw new Error("Pickup ID is required.");

    await deletePickupService(uid, pickupId);
    logger.info("✅ Pickup deleted:", pickupId);
    res.status(200).send({ success: true });
  } catch (error) {
    logger.error("❌ deletePickup error:", error);
    res.status(500).send({ error: (error as Error).message });
  }
};
