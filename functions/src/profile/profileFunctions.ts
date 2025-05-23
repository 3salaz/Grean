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

import * as functions from 'firebase-functions';

import { UserRecord } from "firebase-admin/auth";


export const autoCreateProfile = functions.auth.user().onCreate(async (user: UserRecord) => {
  const uid = user.uid;
  const profileData: CreateProfileData = {
    displayName: user.displayName || `user${Math.floor(Math.random() * 10000)}`,
    email: user.email || "",
    photoURL: user.photoURL || "",
    locations: [],
    pickups: [],
    accountType: "User",
  };

  try {
    await createProfile(uid, profileData);
    console.log(`✅ Profile auto-created for user: ${uid}`);
  } catch (error) {
    console.error(`❌ Failed to auto-create profile for user ${uid}:`, error);
  }
});

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

      // Ensure initial data is passed to createProfile
      const initialData: CreateProfileData = {
        displayName:
          req.body.displayName || `user${Math.floor(Math.random() * 10000)}`,
        email: req.body.email || req.user?.email || "",
        photoURL: req.body.photoURL || "",
        locations: req.body.locations || [],
        pickups: req.body.pickups || [],
        accountType: req.body.accountType || "User",
      };

      await createProfile(uid, initialData);
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
