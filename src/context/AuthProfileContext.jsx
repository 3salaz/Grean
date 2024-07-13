import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { auth } from "../firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const AuthProfileContext = createContext();

export function AuthProfileProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const profileRef = doc(db, "profiles", user.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);


  const logOut = async () => {
    await signOut(auth);
  };

  const createUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(user.email);
    // Create user profile
    const profileData = {
      email: user.email,
      uid: user.uid,
    };
    await createProfile(user.uid, profileData);
  
    return user;
  };

  const signIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // Check if user profile already exists
    const profileRef = doc(db, "profiles", user.uid);
    const profileSnap = await getDoc(profileRef);
  
    if (!profileSnap.exists()) {
      // Create user profile if it doesn't exist
      const profileData = {
        displayName: user.displayName,
        profilePic: user.photoURL,
        email: user.email,
        uid: user.uid,
      };
      await createProfile(user.uid, profileData);
    }
  
    return user;
  };

  const createProfile = async (uid, profileData) => {
    const profileRef = doc(db, "profiles", uid);
    await setDoc(profileRef, profileData);
    setProfile(profileData);
  };

  const updateProfile = async (uid, profileData) => {
    const profileRef = doc(db, "profiles", uid);
    await setDoc(profileRef, profileData, { merge: true });
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      setProfile(profileSnap.data());
    }
  };

  const deleteProfile = async (uid) => {
    const profileRef = doc(db, "profiles", uid);
    await deleteDoc(profileRef);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    logOut,
    createUser,
    signIn,
    googleSignIn,
    createProfile,
    updateProfile,
    deleteProfile,
  };

  return (
    <AuthProfileContext.Provider value={value}>
      {!loading && children}
    </AuthProfileContext.Provider>
  );
}

export function useAuthProfile() {
  return useContext(AuthProfileContext);
}
