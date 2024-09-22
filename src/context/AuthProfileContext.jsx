import { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { incrementReadCount, incrementWriteCount, incrementDeleteCount } from "../utils/requestCounter";

const AuthProfileContext = createContext();

export function AuthProfileProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const initialProfileData = {
          displayName: "",
          profilePic: "",
          email: "",
          uid: "",
          addresses: [],
          accountType: null, // Add other necessary fields here
        };
        const profileDocRef = doc(db, "profiles", user.uid);
        const unsubscribeProfile = onSnapshot(profileDocRef, async (doc) => {
          if (doc.exists()) {
            setProfile(doc.data());
            incrementReadCount();
          } else {
            await setDoc(profileDocRef, { ...initialProfileData, email: user.email, uid: user.uid });
            setProfile({ ...initialProfileData, email: user.email, uid: user.uid });
            incrementWriteCount();
          }
          setLoading(false);
        });
        setUser(user);
        return () => unsubscribeProfile();
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const ensureProfileExists = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const initialProfileData = {
      displayName: "",
      profilePic: "",
      email: "",
      uid: "",
      addresses: [],
      accountType: null, // Add other necessary fields here
    };

    if (user) {
      const profileDocRef = doc(db, "profiles", user.uid);
      const profileSnap = await getDoc(profileDocRef);
      incrementReadCount();

      if (!profileSnap.exists()) {
        await setDoc(profileDocRef, { ...initialProfileData, email: user.email, uid: user.uid });
        setProfile({ ...initialProfileData, email: user.email, uid: user.uid });
        incrementWriteCount();
      }
    }
  };

  const logOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const signUp = async (email, password, profileData) => {
    const auth = getAuth();
    const userCreds = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCreds.user;
    const profileDocRef = doc(db, "profiles", user.uid);

    await setDoc(profileDocRef, { ...profileData, uid: user.uid });
    setProfile({ ...profileData, uid: user.uid });
    incrementWriteCount();
    return user;
  };

  const googleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const initialProfileData = {
      displayName: "",
      profilePic: "",
      email: user.email,
      uid: user.uid,
      addresses: [],
      accountType: null, // Add other necessary fields here
    };
    const profileDocRef = doc(db, "profiles", user.uid);
    const profileSnap = await getDoc(profileDocRef);
    incrementReadCount();

    if (!profileSnap.exists()) {
      const profileData = {
        displayName: user.displayName,
        profilePic: user.photoURL,
        email: user.email,
        uid: user.uid,
        ...initialProfileData, // Add other necessary fields here
      };
      await setDoc(profileDocRef, profileData);
      setProfile(profileData);
      incrementWriteCount();
    } else {
      setProfile(profileSnap.data());
    }
    return user;
  };

  const signIn = async (email, password) => {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  };

  const updateProfileData = async (uid, updateData) => {
    const profileDocRef = doc(db, "profiles", uid);
    await updateDoc(profileDocRef, updateData);
    incrementWriteCount();
    const profileSnap = await getDoc(profileDocRef);
    incrementReadCount();
    if (profileSnap.exists()) {
      setProfile(profileSnap.data());
    }
  };

  const deleteProfile = async (uid) => {
    const profileDocRef = doc(db, "profiles", uid);
    await deleteDoc(profileDocRef);
    setProfile(null);
    incrementDeleteCount();
  };

  const addAddressToProfile = async (uid, address) => {
    const profileDocRef = doc(db, "profiles", uid);
    await updateDoc(profileDocRef, {
      addresses: arrayUnion(address),
    });
    incrementWriteCount();
    const updatedProfile = await getDoc(profileDocRef);
    incrementReadCount();
    if (updatedProfile.exists()) {
      setProfile(updatedProfile.data());
    }
  };

  const removeAddressFromProfile = async (uid, address) => {
    const profileDocRef = doc(db, "profiles", uid);
    await updateDoc(profileDocRef, {
      addresses: arrayRemove(address),
    });
    incrementWriteCount();
    const updatedProfile = await getDoc(profileDocRef);
    incrementReadCount();
    if (updatedProfile.exists()) {
      setProfile(updatedProfile.data());
    }
  };

  const value = {
    user,
    profile,
    loading,
    ensureProfileExists,
    logOut,
    signUp,
    signIn,
    googleSignIn,
    updateProfileData, // Replace updateProfile, updateProfileLocation, and updateProfilePickups with this
    deleteProfile,
    addAddressToProfile,
    removeAddressFromProfile,
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
