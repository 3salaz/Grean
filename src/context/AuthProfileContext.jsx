import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";

const AuthProfileContext = createContext();

export function AuthProfileProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const profileDocRef = doc(db, "profiles", user.uid);
        const profileSnap = await getDoc(profileDocRef);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        } else {
          setProfile(null);
        }
        setUser(user);
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

  const createUser = async (email, password, profileData) => {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const profileDocRef = doc(db, "profiles", user.uid);
    await setDoc(profileDocRef, { ...profileData, uid: user.uid });
    setProfile({ ...profileData, uid: user.uid });

    return user;
  };

  const signIn = async (email, password) => {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  };

  const googleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const profileDocRef = doc(db, "profiles", user.uid);
    const profileSnap = await getDoc(profileDocRef);

    if (!profileSnap.exists()) {
      const profileData = {
        displayName: user.displayName,
        profilePic: user.photoURL,
        email: user.email,
        uid: user.uid,
      };
      await setDoc(profileDocRef, profileData);
      setProfile(profileData);
    } else {
      setProfile(profileSnap.data());
    }

    return user;
  };

  const updateProfile = async (uid, profileData) => {
    const profileDocRef = doc(db, "profiles", uid);
    await setDoc(profileDocRef, profileData, { merge: true });
    const profileSnap = await getDoc(profileDocRef);
    if (profileSnap.exists()) {
      setProfile(profileSnap.data());
    }
  };

  const deleteProfile = async (uid) => {
    const profileDocRef = doc(db, "profiles", uid);
    await deleteDoc(profileDocRef);
    setProfile(null);
  };

  const batchUpdateProfiles = async (profiles) => {
    const batch = writeBatch(db);
    profiles.forEach(profile => {
      const profileDocRef = doc(db, "profiles", profile.uid);
      batch.set(profileDocRef, profile);
    });
    await batch.commit();
  };

  const value = {
    user,
    profile,
    loading,
    logOut,
    createUser,
    signIn,
    googleSignIn,
    updateProfile,
    deleteProfile,
    batchUpdateProfiles,
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
