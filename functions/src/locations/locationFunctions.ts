import {Response} from "express";
import * as logger from "firebase-functions/logger";
import {
  createLocation,
  // updateLocation,
  deleteLocation,
} from "./locationServices";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middleware/authMiddleware";

import {
  CreateLocationData,
  // UpdateLocationData,
  DeleteLocationData,
} from "./locationTypes";

export const createLocationFunction = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    logger.info("🔥 createLocationFunction TRIGGERED with data:", req.body);
    try {
      const uid = req.user?.uid;
      if (!uid) {
        throw new Error("User UID is undefined.");
      }
      logger.info("✅ User authenticated:", uid);

      const result = await createLocation(uid, req.body as CreateLocationData);
      res.status(200).send({locationId: result.locationId});
    } catch (error) {
      logger.error("❌ ERROR in createLocationFunction:", error);
      res.status(500).send({error: (error as Error).message});
    }
  },
];

// export const updateLocationFunction = [
//   authMiddleware,
//   async (req: AuthenticatedRequest, res: Response) => {
//     logger.info("🔥 updateLocationFunction TRIGGERED with data:", req.body);
//     try {
//       const uid = req.user?.uid;
//       if (!uid) {
//         throw new Error("User UID is undefined.");
//       }
//       logger.info("✅ User authenticated:", uid);

//       const { locationId, updates } = req.body as UpdateLocationData;
//       await updateLocation(uid, locationId, updates);
//       res.status(200).send({ success: true });
//     } catch (error) {
//       logger.error("❌ ERROR in updateLocationFunction:", error);
//       res.status(500).send({ error: (error as Error).message });
//     }
//   },
// ];

export const deleteLocationFunction = [
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    logger.info("🔥 deleteLocationFunction TRIGGERED with data:", req.body);
    try {
      const uid = req.user?.uid;
      if (!uid) {
        throw new Error("User UID is undefined.");
      }
      logger.info("✅ User authenticated:", uid);

      const {locationId} = req.body as DeleteLocationData;
      await deleteLocation(uid, locationId);
      res.status(200).send({success: true});
    } catch (error) {
      logger.error("❌ ERROR in deleteLocationFunction:", error);
      res.status(500).send({error: (error as Error).message});
    }
  },
];
