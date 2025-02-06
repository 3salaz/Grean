// src/context/ProfileContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";  // Your Firestore instance
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext"; // We rely on the current user

// Type or interface for your profile data
export interface UserProfile {
  displayName: string;
  profilePic: string;
  email: string;
  uid: string;
  locations: string[];
  pickups: string[];
  accountType: string;
  createdAt?: any;
  // add other fields if needed
}

interface ProfileContextValue {
  profile: UserProfile | null;
  loadingProfile: boolean;

  // Create a new profile doc (replaces anything that might exist)
  createProfile: (uid: string, data: Partial<UserProfile>) => Promise<void>;

  // Read (fetch) the profile doc
  readProfile: (uid: string) => Promise<UserProfile | null>;

  // Update a single field or array in the profile
  updateProfile: (
    uid: string,
    field: string,
    value: any,
    operation?: "update" | "addToArray" | "removeFromArray"
  ) => Promise<void>;

  // Delete the profile doc entirely
  deleteProfile: (uid: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // The current Firebase Auth user
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  /** CREATE a new profile (will overwrite if doc already exists) */
  const createProfile = async (uid: string, data: Partial<UserProfile>) => {
    const profileDocRef = doc(db, "profiles", uid);
    await setDoc(profileDocRef, {
      ...data,
      createdAt: serverTimestamp(),
    });
    // If you want to immediately load it into state:
    const snap = await getDoc(profileDocRef);
    setProfile(snap.data() as UserProfile);
  };

  /** READ an existing profile doc */
  const readProfile = async (uid: string): Promise<UserProfile | null> => {
    const profileDocRef = doc(db, "profiles", uid);
    const snapshot = await getDoc(profileDocRef);
    if (!snapshot.exists()) return null;
    return snapshot.data() as UserProfile;
  };

  /** UPDATE a single field or an array in the profile */
  const updateProfile = async (
    uid: string,
    field: string,
    value: any,
    operation: "update" | "addToArray" | "removeFromArray" = "update"
  ) => {
    const profileDocRef = doc(db, "profiles", uid);
    try {
      if (operation === "addToArray") {
        await updateDoc(profileDocRef, { [field]: arrayUnion(value) });
      } else if (operation === "removeFromArray") {
        await updateDoc(profileDocRef, { [field]: arrayRemove(value) });
      } else {
        await updateDoc(profileDocRef, { [field]: value });
      }

      const updatedProfileSnap = await getDoc(profileDocRef);
      const updatedProfileData = updatedProfileSnap.data() as UserProfile;
      setProfile(updatedProfileData);

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(`Failed to update profile: ${error.message}`);
      throw error;
    }
  };

  /** DELETE the entire profile doc */
  const deleteProfile = async (uid: string) => {
    const profileDocRef = doc(db, "profiles", uid);
    await deleteDoc(profileDocRef);
    setProfile(null);
    toast.warn("Profile deleted!");
  };

  /**
   * Whenever the user changes, either:
   * - setProfile(null) if signed out
   * - or attempt to READ their profile. If it doesn't exist, CREATE a default one.
   */
  useEffect(() => {
    const fetchOrCreateProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }
      setLoadingProfile(true);
      
      // Attempt to read the existing doc
      const existingDoc = await readProfile(user.uid);
      if (!existingDoc) {
        // If no doc, create a default profile
        await createProfile(user.uid, {
          displayName: user.displayName || "",
          profilePic: user.photoURL || "",
          email: user.email,
          uid: user.uid,
          locations: [],
          pickups: [],
          accountType: "User",
        });
      } else {
        // If doc exists, put it in state
        setProfile(existingDoc);
      }
      setLoadingProfile(false);
    };

    fetchOrCreateProfile();
  }, [user]);

  const value: ProfileContextValue = {
    profile,
    loadingProfile,
    createProfile,
    readProfile,
    updateProfile,
    deleteProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {!loadingProfile && children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
