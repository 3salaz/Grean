import { db, admin } from "../config";

export interface UserProfile {
  displayName: string;
  profilePic?: string | null;
  email: string;
  uid: string;
  locations: string[];
  pickups: string[];
  accountType: string;
  createdAt?: any;
}

/** ✅ Create a new user profile */
export const createProfile = async (uid: string, profileData: Partial<UserProfile>): Promise<void> => {
  const profileRef = db.collection("profiles").doc(uid);
  await profileRef.set({
    ...profileData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
};

/** ✅ Read a user profile */
export const readProfile = async (uid: string): Promise<UserProfile | null> => {
  const profileRef = db.collection("profiles").doc(uid);
  const docSnap = await profileRef.get();

  return docSnap.exists ? (docSnap.data() as UserProfile) : null;
};

/** ✅ Update profile fields */
export const updateProfileField = async (
  uid: string,
  field: string,
  value: any,
  operation: "update" | "addToArray" | "removeFromArray" = "update"
): Promise<void> => {
  const profileRef = db.collection("profiles").doc(uid);

  if (operation === "addToArray") {
    await profileRef.update({ [field]: admin.firestore.FieldValue.arrayUnion(value) });
  } else if (operation === "removeFromArray") {
    await profileRef.update({ [field]: admin.firestore.FieldValue.arrayRemove(value) });
  } else {
    await profileRef.update({ [field]: value });
  }
};

/** ✅ Delete a profile */
export const deleteProfile = async (uid: string): Promise<void> => {
  const profileRef = db.collection("profiles").doc(uid);
  await profileRef.delete();
};
