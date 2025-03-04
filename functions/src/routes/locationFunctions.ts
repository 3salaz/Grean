import * as functions from "firebase-functions";
import * as corsLib from "cors";
import {authMiddleware} from "../utils/authMiddleware";
import {
  fetchUserLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../services/locationServices";

const cors = corsLib({origin: true});

/** ✅ Fetch locations (only user's locations) */
export const getLocations = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const uid = await authMiddleware(req);
      const locations = await fetchUserLocations(uid);
      res.status(200).json(locations);
    } catch (error: unknown) {
      console.error("❌ Error fetching locations:", error);
      const errMsg = error instanceof Error ? error.message : "Unknown error.";
      res.status(500).json({error: errMsg});
    }
  });
});

/** ✅ Create a location */
export const createLocationFunction = functions.https.onRequest(
    (req, res) => {
      cors(req, res, async () => {
        try {
          const uid = await authMiddleware(req);
          const locationId = await createLocation(uid, req.body);
          res.status(201).json({locationId});
        } catch (error: unknown) {
          console.error("❌ Error creating location:", error);
          const errMsg =
          error instanceof Error ? error.message : "Unknown error.";
          res.status(500).json({error: errMsg});
        }
      });
    }
);

/** ✅ Update a location */
export const updateLocationFunction = functions.https.onRequest(
    (req, res) => {
      cors(req, res, async () => {
        try {
          const uid = await authMiddleware(req);
          const {locationId, updates} = req.body;
          await updateLocation(uid, locationId, updates);
          res.status(200).json({success: true});
        } catch (error: unknown) {
          console.error("❌ Error updating location:", error);
          const errMsg =
          error instanceof Error ? error.message : "Unknown error.";
          res.status(403).json({error: errMsg});
        }
      });
    }
);

/** ✅ Delete a location */
export const deleteLocationFunction = functions.https.onRequest(
    (req, res) => {
      cors(req, res, async () => {
        try {
          const uid = await authMiddleware(req);
          const {locationId} = req.body;
          await deleteLocation(uid, locationId);
          res.status(200).json({success: true});
        } catch (error: unknown) {
          console.error("❌ Error deleting location:", error);
          const errMsg =
          error instanceof Error ? error.message : "Unknown error.";
          res.status(403).json({error: errMsg});
        }
      });
    }
);
