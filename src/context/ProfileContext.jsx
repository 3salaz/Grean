import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserAuth } from "./AuthContext";
import { toast } from "react-toastify";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const { user } = UserAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          toast.error("Profile does not exist!");
        }
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (data) => {
    if (user) {
      const docRef = doc(db, "profiles", user.uid);
      try {
        await setDoc(docRef, data, { merge: true });
        setProfile((prevProfile) => ({ ...prevProfile, ...data }));
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Error updating profile. Please try again.");
      }
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
