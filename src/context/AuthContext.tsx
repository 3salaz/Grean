// src/context/AuthContext.tsx
import React, {useState, useEffect, createContext, useContext} from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from "firebase/auth";
import {toast} from "react-toastify";

import { createProfileIfMissing } from "../utils/createProfileIfMissing";

interface AuthContextValue {
  user: any; // or a custom Firebase user type
  loadingAuth: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  googleSignIn: () => Promise<any>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children
}) => {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Create a new user with email/password.
   * Shows a success toast if created,
   * or an error toast if something fails (e.g., email in use).
   */
  const handleSignUpError = (error: any) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        toast.error(
          "Email is already in use! Please sign in or use a different email."
        );
        break;
      case "auth/weak-password":
        toast.error("Your password is too weak. Try a stronger one!");
        break;
      case "auth/invalid-email":
        toast.error("Invalid email address. Please check your email format.");
        break;
      default:
        toast.error("Failed to sign up. Please try again.");
        break;
    }
  };

  const signUp = async (email: string, password: string) => {
    const auth = getAuth();
    try {
      const userCreds = await createUserWithEmailAndPassword(auth, email, password);
      await createProfileIfMissing(userCreds.user);
      setUser(userCreds.user);
      return userCreds.user;  
    } catch (error: any) {
      console.error("Sign Up Error:", error);
      handleSignUpError(error);
      throw error;
    }
  };

  /**
   * Sign in with email/password.
   * Shows a success toast if logged in,
   * or an error toast if something fails (e.g., wrong password).
   */
  const signIn = async (email: string, password: string) => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await createProfileIfMissing(userCredential.user);
      return userCredential.user;
    } catch (error: any) {
      console.error("Sign In Error:", error);
      switch (error.code) {
        case "auth/wrong-password":
          toast.error("Incorrect password. Please try again.");
          break;
        case "auth/user-not-found":
          toast.error(
            "No user found with that email. Please check or sign up first."
          );
          break;
        case "auth/too-many-requests":
          toast.error("Too many attempts. Please wait a moment and try again.");
          break;
        default:
          toast.error("Failed to sign in. Please try again.");
          break;
      }
      throw error;
    }
  };

  /**
   * Google sign-in with a popup.
   * Shows success toast on success,
   * or an error toast on failure.
   */
  const googleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success("Signed in with Google!");
      await createProfileIfMissing(result.user);
      return result.user;
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      switch (error.code) {
        case "auth/cancelled-popup-request":
          toast.error("Google sign-in was canceled. Please try again.");
          break;
        default:
          toast.error("Failed to sign in with Google. Please try again.");
          break;
      }
      throw error;
    }
  };

  /**
   * Sign out the current user.
   * Shows a success toast on sign-out.
   */
  const logOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    setUser(null);
    toast.success("You have signed out successfully.");
  };

  const value: AuthContextValue = {
    user,
    loadingAuth,
    signUp,
    signIn,
    googleSignIn,
    logOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
