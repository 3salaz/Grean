import { HttpsError } from "firebase-functions/v2/https";
import admin from "firebase-admin";

// Type definitions for Firebase Callable Request and Express Request
import { CallableRequest } from "firebase-functions/v2/https";
import { Request as ExpressRequest } from "express";

// Ensure Firebase Admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Middleware function to authenticate Firebase users for callable functions & Express APIs.
 * @param {CallableRequest<any> | ExpressRequest} contextOrReq - Firebase callable request or Express request.
 * @return {Promise<string>} - The authenticated user's UID.
 * @throws {HttpsError} - Throws an error if authentication fails.
 */
export const authMiddleware = async (
  contextOrReq: CallableRequest<any> | ExpressRequest
): Promise<string> => {
  // ✅ Handling Firebase Callable Functions (Cloud Functions v2)
  if ("auth" in contextOrReq) {
    if (!contextOrReq.auth || !contextOrReq.auth.uid) {
      throw new HttpsError(
        "unauthenticated",
        "No authentication token provided."
      );
    }
    return contextOrReq.auth.uid;
  }

  // ✅ Handling Express API Requests
  if ("headers" in contextOrReq && contextOrReq.headers.authorization) {
    const authHeader = contextOrReq.headers.authorization;

    if (!authHeader.startsWith("Bearer ")) {
      throw new HttpsError(
        "unauthenticated",
        "No authentication token provided."
      );
    }

    // ✅ Extract token from Authorization header
    const token = authHeader.split("Bearer ")[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken.uid; // ✅ Return UID for Express APIs
    } catch (error) {
      console.error("❌ Authentication failed:", error);
      throw new HttpsError("unauthenticated", "Invalid authentication token.");
    }
  }

  throw new HttpsError("unauthenticated", "Invalid request type.");
};
