import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6aatRdHznCYbBE3jA3flqEAoM74ajaZg",
  authDomain: "grean-dev.firebaseapp.com",
  projectId: "grean-dev",
  storageBucket: "grean-dev.appspot.com",
  messagingSenderId: "575669203519",
  appId: "1:575669203519:web:21633077219269ace1fe8a",
  measurementId: "G-VWTKK02Z3V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Set persistence to browserLocalPersistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

// Analytics
export const analytics = getAnalytics(app);

export default app;
