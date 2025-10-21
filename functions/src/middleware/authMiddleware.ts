import * as admin from "firebase-admin";
import {Request, Response, NextFunction} from "express";

// Ensure Firebase Admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Extend the Request interface to include the user property
export interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send({error: "No authentication token provided."});
    return;
  }

  const token = authHeader.split("Bearer ")[1];
  if (!token) {
    res.status(401).send({error: "No authentication token provided."});
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach the decoded token to the request object
    next();
  } catch (error) {
    res.status(401).send({error: "Invalid authentication token provided."});
  }
};

export const decodeAuthToken = async (req: Request) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No authentication token provided.");
  }

  const token = authHeader.split("Bearer ")[1];
  return await admin.auth().verifyIdToken(token);
};

