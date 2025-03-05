import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../firebase"; // ✅ Ensure Firebase is initialized
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

// ✅ Define Profile Interface
export interface UserProfile {
  displayName: string;
  profilePic?: string | null;
  email: string;
  uid: string;
  locations: string[];
  pickups: string[];
  accountType: string;
}

// ✅ Define Context Type
interface ProfileContextValue {
  profile: UserProfile | null;
  loadingProfile: boolean;
  createProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateProfile: (
    field: string,
    value: any,
    operation?: "update" | "addToArray" | "removeFromArray"
  ) => Promise<void>;
  deleteProfile: () => Promise<void>;
}

// ✅ Create Context
const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      console.warn("⚠️ No user found, clearing profile.");
      setProfile(null);
      setLoadingProfile(false);
      return;
    }

    console.log("👤 User detected:", user.uid);

    // ✅ First, check if profile exists
    const checkProfileExists = async () => {
      const profileRef = doc(db, "profiles", user.uid);
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        console.warn("⚠️ Profile does not exist in Firestore for user:", user.uid);
        setProfile(null);
        setLoadingProfile(false);
        return;
      }
    };

    checkProfileExists().catch((err) => {
      console.error("🔥 Error checking profile existence:", err);
      setProfile(null);
      setLoadingProfile(false);
    });

    // ✅ Firestore real-time listener (auto-updates when data changes)
    const profileRef = doc(db, "profiles", user.uid);
    const unsubscribe = onSnapshot(
      profileRef,
      (docSnap) => {
        if (docSnap.exists()) {
          console.log("✅ Profile Data received:", docSnap.data());
          setProfile(docSnap.data() as UserProfile);
        } else {
          console.warn("⚠️ Profile does not exist in Firestore!");
          setProfile(null);
        }
        setLoadingProfile(false);
      },
      (error) => {
        console.error("❌ Firestore error:", error);
        toast.error("Permission denied: Unable to access profile.");
        setProfile(null);
        setLoadingProfile(false);
      }
    );

    return () => unsubscribe(); // ✅ Cleanup listener
  }, [user]);

  /** ✅ Create Profile */
  const createProfile = async (data: Partial<UserProfile>) => {
    try {
      const createProfileFn = httpsCallable(functions, "createProfile");
      await createProfileFn(data);
      toast.success("Profile created successfully!");
    } catch (error) {
      console.error("❌ Error creating profile:", error);
      toast.error("Failed to create profile.");
    }
  };

/** ✅ Update Profile in Bulk */
const updateProfile = async (updates: Partial<UserProfile>) => {
  try {
    const updateProfileFn = httpsCallable(functions, "updateProfile");
    // Send all updates in one call
    await updateProfileFn({ updates });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    throw error; // Let the caller handle error notifications
  }
};

  /** ✅ Delete Profile */
  const deleteProfile = async () => {
    try {
      const deleteProfileFn = httpsCallable(functions, "deleteProfile");
      await deleteProfileFn({});
      setProfile(null);
      toast.warn("Profile deleted!");
    } catch (error) {
      console.error("❌ Error deleting profile:", error);
      toast.error("Failed to delete profile.");
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loadingProfile, createProfile, updateProfile, deleteProfile }}>
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
