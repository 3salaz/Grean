import {Response} from "express";
import * as logger from "firebase-functions/logger";
import {
  createProfile,
  updateProfileField,
  updateProfileBulk,
  deleteProfile,
} from "./profileServices";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middleware/authMiddleware";
import {
  CreateProfileData,
  UpdateProfileData,
  ProfileUpdateOperation,
} from "./profileTypes";

export const createProfileFunction = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    logger.info("🔥 createProfileFunction TRIGGERED with data:", req.body);
    try {
      const uid = req.user?.uid;
      if (!uid) {
        throw new Error("User UID is undefined.");
      }
      logger.info("✅ User authenticated:", uid);

      await createProfile(uid, req.body as CreateProfileData);
      res.status(200).send({success: true});
    } catch (error) {
      logger.error("❌ ERROR:", error);
      res.status(500).send({error: (error as Error).message});
    }
  },
];

export const updateProfileFunction = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user?.uid;
      if (!uid) {
        throw new Error("User UID is undefined.");
      }
      logger.info("✅ User authenticated:", uid);

      const {
        field,
        value,
        operation = "update",
      } = req.body as UpdateProfileData;

      if (operation === "update" || operation === "set") {
        await updateProfileField(
            uid,
            field,
            value,
          operation as ProfileUpdateOperation
        );
      } else {
        await updateProfileBulk(uid, {[field]: value});
      }

      res.status(200).send({success: true});
    } catch (error) {
      logger.error("❌ ERROR:", error);
      res.status(500).send({error: (error as Error).message});
    }
  },
];

export const deleteProfileFunction = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user?.uid;
      if (!uid) {
        throw new Error("User UID is undefined.");
      }
      logger.info("✅ User authenticated:", uid);

      await deleteProfile(uid);
      res.status(200).send({success: true});
    } catch (error) {
      logger.error("❌ ERROR:", error);
      res.status(500).send({error: (error as Error).message});
    }
  },
];
