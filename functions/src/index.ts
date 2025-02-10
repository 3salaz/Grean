// src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { updateUserProfile } from "./handlers/profile"; // Import the function

admin.initializeApp(); // Initialize Firebase Admin SDK

// Simple test function
export const helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase!");
});

// Register Cloud Function for profile updates
export const updateUserProfileFunction = updateUserProfile;
