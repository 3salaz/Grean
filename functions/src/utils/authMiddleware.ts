import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Ensure Firebase Admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

export const authMiddleware = async (
  contextOrReq: functions.https.CallableContext | functions.https.Request,
): Promise<string> => {
  let token;

  if ("auth" in contextOrReq) {
    // Firebase Callable Function Context
    if (!contextOrReq.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "No authentication token provided.",
      );
    }
    return contextOrReq.auth.uid;
  } else {
    // Express Request
    const req = contextOrReq as functions.https.Request;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "No authentication token provided.",
      );
    }
    token = authHeader.split("Bearer ")[1];
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error("❌ Authentication failed:", error);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Invalid authentication token.",
    );
  }
};
