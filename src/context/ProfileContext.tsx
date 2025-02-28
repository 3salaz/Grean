import React, { createContext, useContext, useState, useEffect } from "react";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../firebase";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

// Define Profile Interface
export interface UserProfile {
  displayName: string;
  profilePic?: string | null;
  email: string;
  uid: string;
  locations: string[];
  pickups: string[];
  accountType: string;
}

// Define Context Type
interface ProfileContextValue {
  profile: UserProfile | null;
  loadingProfile: boolean;
  createProfile: (data: Partial<UserProfile>) => Promise<void>;
  readProfile: () => Promise<UserProfile | null>;
  updateProfile: (field: string, value: any, operation?: "update" | "addToArray" | "removeFromArray") => Promise<void>;
  deleteProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  useEffect(() => {
    if (!user || location.pathname !== "/account") {
      setProfile(null);
      setLoadingProfile(false);
      return;
    }
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const readProfileFn = httpsCallable(functions, "readProfile");
        const response = await readProfileFn({});
        if (response.data) {
          setProfile(response.data as UserProfile);
        } else {
          await createProfile({
            displayName: user.displayName || "",
            profilePic: user.photoURL || null,
            email: user.email || "",
            uid: user.uid,
            locations: [],
            pickups: [],
            accountType: "User",
          });
        }
      } catch (error) {
        console.error("[ProfileContext] Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user, location.pathname]);
  const createProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!data.uid) {
        console.error("❌ Missing UID in createProfile call!", data);
        throw new Error("User UID is required!");
      }
  
      console.log("🔥 Attempting to create profile in Firestore for UID:", data.uid);
  
      const profileData = {
        displayName: data.displayName || "New User",
        profilePic: data.profilePic || null,
        email: data.email || "",
        uid: data.uid,
        locations: data.locations || [],
        pickups: data.pickups || [],
        accountType: data.accountType || "User",
        createdAt: serverTimestamp(),
      };
  
      console.log("📌 Profile Data to Write:", profileData);
  
      await setDoc(doc(db, "profiles", data.uid), profileData);
  
      setProfile(profileData); // Update local state
      toast.success("Profile created successfully!");
      console.log("✅ Profile successfully written to Firestore!");
    } catch (error) {
      console.error("❌ Error creating profile:", error);
      toast.error("Failed to create profile.");
    }
  };
  
  
  
  

  const readProfile = async (): Promise<UserProfile | null> => {
    try {
      const readProfileFn = httpsCallable(functions, "readProfile");
      const response = await readProfileFn({});
      return response.data as UserProfile;
    } catch (error) {
      console.error("Error reading profile:", error);
      return null;
    }
  };

  const updateProfile = async (field: string, value: any, operation: "update" | "addToArray" | "removeFromArray" = "update") => {
    try {
      const updateProfileFn = httpsCallable(functions, "updateProfile");
      await updateProfileFn({ field, value, operation });
      toast.success("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const deleteProfile = async () => {
    try {
      const deleteProfileFn = httpsCallable(functions, "deleteProfile");
      await deleteProfileFn({});
      setProfile(null);
      toast.warn("Profile deleted!");
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return <ProfileContext.Provider value={{ profile, loadingProfile, createProfile, readProfile, updateProfile, deleteProfile }}>{!loadingProfile && children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
