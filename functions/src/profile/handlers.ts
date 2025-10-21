import { Response } from "express";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v1";
import {
  createProfile as createProfileService,
  updateProfileField as updateProfileFieldService,
  updateProfileBulk as updateProfileBulkService,
  deleteProfile as deleteProfileService,
} from "./service";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middleware/authMiddleware";
import {
  CreateProfileData,
  UpdateProfileData,
  ProfileUpdateOperation,
} from "./types";
import { UserRecord } from "firebase-admin/auth";
import { db } from "../firebase";
import { FieldValue } from "firebase-admin/firestore";

// ✅ Firebase Auth Trigger: Automatically create a profile
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
    await createProfileService(uid, profileData);
    console.log(`✅ Profile auto-created for user: ${uid}`);
  } catch (error) {
    console.error(`❌ Failed to auto-create profile for user ${uid}:`, error);
  }
});

// ✅ Create Profile
export const createProfile = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    logger.info("🔥 createProfile triggered with data:", req.body);
    try {
      const uid = req.user?.uid;
      if (!uid) throw new Error("User UID is undefined.");
      logger.info("✅ User authenticated:", uid);

      const initialData: CreateProfileData = {
        displayName: req.body.displayName || `user${Math.floor(Math.random() * 10000)}`,
        email: req.body.email || req.user?.email || "",
        photoURL: req.body.photoURL || "",
        locations: req.body.locations || [],
        pickups: req.body.pickups || [],
        accountType: req.body.accountType || "User",
      };

      await createProfileService(uid, initialData);
      res.status(200).send({ success: true });
    } catch (error) {
      logger.error("❌ ERROR in createProfile:", error);
      res.status(500).send({ error: (error as Error).message });
    }
  },
];

// ✅ Update Profile
export const updateProfile = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user?.uid;
      if (!uid) throw new Error("User UID is undefined.");

      const { field, value, operation = "update" } = req.body as UpdateProfileData;

      const profileRef = db.collection("profiles").doc(uid);

      if (operation === "addToArray") {
        await profileRef.update({ [field]: FieldValue.arrayUnion(value) });
      } else if (operation === "removeFromArray") {
        await profileRef.update({ [field]: FieldValue.arrayRemove(value) });
      } else if (operation === "update" || operation === "set") {
        await updateProfileFieldService(uid, field, value, operation as ProfileUpdateOperation);
      } else {
        await updateProfileBulkService(uid, { [field]: value });
      }

      res.status(200).send({ success: true });
    } catch (error) {
      logger.error("❌ ERROR in updateProfile:", error);
      res.status(500).send({ error: (error as Error).message });
    }
  },
];

// ✅ Delete Profile
export const deleteProfile = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const uid = req.user?.uid;
      if (!uid) throw new Error("User UID is undefined.");
      logger.info("✅ User authenticated:", uid);

      await deleteProfileService(uid);
      res.status(200).send({ success: true });
    } catch (error) {
      logger.error("❌ ERROR in deleteProfile:", error);
      res.status(500).send({ error: (error as Error).message });
    }
  },
];
