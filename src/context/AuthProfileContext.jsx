import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { getAuth, signOut, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase";
import { toast } from "react-toastify";

const AuthProfileContext = createContext();

const initializeProfile = async (user) => {
  const profileDocRef = doc(db, "profiles", user.uid);
  const profileSnap = await getDoc(profileDocRef);

  const defaultProfileData = {
    displayName: user.displayName || "",
    profilePic: user.photoURL || "",
    email: user.email,
    uid: user.uid,
    locations: [],
    accountType: "User",
    createdAt: serverTimestamp(),
  };

  if (!profileSnap.exists()) {
    await setDoc(profileDocRef, defaultProfileData);
    return defaultProfileData;
  }

  const existingProfileData = profileSnap.data();
  return { ...defaultProfileData, ...existingProfileData };
};

export function AuthProfileProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const updatedProfile = await initializeProfile(currentUser);
        setProfile(updatedProfile);
        setUser(currentUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const signUp = async (email, password, profileData = {}) => {
    const auth = getAuth();

    try {
      const userCreds = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCreds.user;

      const updatedProfile = {
        ...(await initializeProfile(user)),
        ...profileData,
      };

      setProfile(updatedProfile);
      return user;
    } catch (error) {
      toast.error("Failed to sign up. Please try again.");
      throw error;
    }
  };

  const googleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const updatedProfile = await initializeProfile(user);
      setProfile(updatedProfile);
      return user;
    } catch (error) {
      toast.error("Failed to sign in with Google. Please try again.");
      throw error;
    }
  };

  const signIn = async (email, password) => {
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const updatedProfile = await initializeProfile(user);
      setProfile(updatedProfile);
      return user;
    } catch (error) {
      toast.error("Failed to sign in. Please try again.");
      throw error;
    }
  };

  // Generic function to update profile data
  const updateProfileField = async (uid, field, value, operation = "update") => {
    const profileDocRef = doc(db, "profiles", uid);

    try {
      if (operation === "addToArray") {
        await updateDoc(profileDocRef, { [field]: arrayUnion(value) });
      } else if (operation === "removeFromArray") {
        await updateDoc(profileDocRef, { [field]: arrayRemove(value) });
      } else if (operation === "update") {
        await updateDoc(profileDocRef, { [field]: value });
      }

      const updatedProfile = (await getDoc(profileDocRef)).data();
      setProfile(updatedProfile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(`Failed to update profile: ${error.message}`);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      logOut,
      signUp,
      signIn,
      googleSignIn,
      updateProfileField, // Expose the generic update function
    }),
    [user, profile, loading]
  );

  return (
    <AuthProfileContext.Provider value={value}>
      {!loading && children}
    </AuthProfileContext.Provider>
  );
}

export function useAuthProfile() {
  return useContext(AuthProfileContext);
}
