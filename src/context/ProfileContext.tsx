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
import { db } from "../firebase"; // Your Firestore instance
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext"; // Authentication context
import { useLocation } from "react-router-dom";

// 🔹 Define Profile Interface
export interface UserProfile {
  displayName: string;
  profilePic: string | null;
  email: string;
  uid: string;
  locations: any[];
  pickups: any[];
  accountType: string;
  createdAt?: any;
}

// 🔹 Define Context Type
interface ProfileContextValue {
  profile: UserProfile | null;
  loadingProfile: boolean;
  createProfile: (uid: string, data: Partial<UserProfile>) => Promise<void>;
  readProfile: (uid: string) => Promise<UserProfile | null>;
  updateProfile: (
    uid: string,
    field: string,
    value: any,
    operation?: "update" | "addToArray" | "removeFromArray"
  ) => Promise<void>;
  deleteProfile: (uid: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // Firebase Auth user
  const location = useLocation(); // Get current route
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      console.error("[ProfileContext] Not Authenticated");
      setProfile(null);
      setLoadingProfile(false);
      return;
    }

    // ✅ Only fetch when on the `/account` page
    if (location.pathname !== "/account") {
      console.log("[ProfileContext] Not on /account page - Skipping profile fetch.");
      return;
    }

    const fetchOrCreateProfile = async () => {
      if (!user) {
        console.warn("[ProfileContext] No authenticated user. Clearing profile.");
        setProfile(null);
        setLoadingProfile(false);
        return;
      }

      // console.log(`[ProfileContext] Fetching profile for user: ${user.uid}`);
      setLoadingProfile(true);

      try {
        const existingDoc = await readProfile(user.uid);
        if (!existingDoc) {
          console.log("[ProfileContext] No existing profile found. Creating new profile.");
          await createProfile(user.uid, {
            displayName: user.displayName || "",
            profilePic: user.photoURL || null,
            email: user.email || "",
            uid: user.uid,
            locations: [],
            pickups: [],
            accountType: "User",
          });
        } else {
          // console.log("[ProfileContext] Profile found:", existingDoc);

          // 🔹 Ensure `profilePic` stays updated with Firebase Auth
          if (existingDoc.profilePic !== user.photoURL) {
            console.log("[ProfileContext] Updating profilePic to match Firebase Auth.");
            await updateProfile(user.uid, "profilePic", user.photoURL || null);
          }

          setProfile(existingDoc);
        }
      } catch (error: any) {
        console.error("[ProfileContext] Error fetching/creating profile:", error);
      }

      setLoadingProfile(false);
    };
  
  
    fetchOrCreateProfile();
  }, [user]);

  /** ✅ CREATE a new profile */
  const createProfile = async (uid: string, data: Partial<UserProfile>) => {
    const profileDocRef = doc(db, "profiles", uid);
    try {
      await setDoc(profileDocRef, {
        ...data,
        createdAt: serverTimestamp(),
      });

      console.log("[ProfileContext] New profile created:", data);
      setProfile({ ...data, createdAt: new Date() } as UserProfile);
    } catch (error) {
      console.error("[ProfileContext] Error creating profile:", error);
    }
  };

  /** ✅ READ an existing profile */
  const readProfile = async (uid: string): Promise<UserProfile | null> => {
    const profileDocRef = doc(db, "profiles", uid);
    try {
      const snapshot = await getDoc(profileDocRef);
      if (!snapshot.exists()) {
        console.warn("[ProfileContext] No profile document found.");
        return null;
      }

      console.log("[ProfileContext] Profile document found:", snapshot.data());
      return snapshot.data() as UserProfile;
    } catch (error: any) {
      console.error("[ProfileContext] Firestore read error:", error);
      return null;
    }
  };

  /** ✅ UPDATE profile fields or array values */
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

      console.log(`[ProfileContext] Profile field '${field}' updated.`);
      toast.success("Profile updated successfully!");

      // Fetch updated profile
      const updatedProfileSnap = await getDoc(profileDocRef);
      setProfile(updatedProfileSnap.data() as UserProfile);
    } catch (error: any) {
      console.error("[ProfileContext] Profile update error:", error);
      toast.error(`Failed to update profile: ${error.message}`);
    }
  };

  /** ✅ DELETE the profile */
  const deleteProfile = async (uid: string) => {
    const profileDocRef = doc(db, "profiles", uid);
    try {
      await deleteDoc(profileDocRef);
      setProfile(null);
      toast.warn("Profile deleted!");
      console.log("[ProfileContext] Profile deleted.");
    } catch (error) {
      console.error("[ProfileContext] Profile deletion error:", error);
    }
  };

  /** ✅ Context Provider */
  const value: ProfileContextValue = {
    profile,
    loadingProfile,
    createProfile,
    readProfile,
    updateProfile,
    deleteProfile,
  };

  return <ProfileContext.Provider value={value}>{!loadingProfile && children}</ProfileContext.Provider>;
};

/** ✅ Custom Hook to Use Profile Context */
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
