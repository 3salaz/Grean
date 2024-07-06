import React, { createContext, useContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";

// Create the context
const AuthProfileContext = createContext();

// Custom hook to use the context
export const useAuthProfile = () => useContext(AuthProfileContext);

export const AuthProfileProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        await checkAndFetchProfile(currentUser.uid);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const checkAndFetchProfile = async (uid) => {
    const docRef = doc(db, "profiles", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProfile(docSnap.data());
    } else {
      // Profile does not exist, create one with default data
      const defaultProfile = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: uid
      };
      await setDoc(docRef, defaultProfile);
      setProfile(defaultProfile);
      toast.success("Profile created successfully!");
    }
  };

  const createProfile = async (uid, data) => {
    const docRef = doc(db, "profiles", uid);
    try {
      await setDoc(docRef, data);
      setProfile(data);
      toast.success("Profile created successfully!");
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Error creating profile. Please try again.");
    }
  };

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

  const deleteProfile = async () => {
    if (user) {
      const docRef = doc(db, "profiles", user.uid);
      try {
        await deleteDoc(docRef);
        setProfile(null);
        toast.success("Profile deleted successfully!");
      } catch (error) {
        console.error("Error deleting profile:", error);
        toast.error("Error deleting profile. Please try again.");
      }
    }
  };

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const profileData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      };
      await createProfile(user.uid, profileData);
      return user;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    return signOut(auth);
  };

  return (
    <AuthProfileContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        logOut,
        createUser,
        googleSignIn,
        createProfile,
        updateProfile,
        deleteProfile,
      }}
    >
      {children}
    </AuthProfileContext.Provider>
  );
};
