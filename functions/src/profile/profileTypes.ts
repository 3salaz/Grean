/** ✅ Defines what a User Profile should look like */
export interface UserProfile {
  uid: string; // 🔑 User ID
  displayName: string;
  email: string;
  phoneNumber?: string; // Optional
  photoURL?: string; // Optional profile picture
  locations?: string[]; // Optional: Location IDs
  pickups?: string[]; // Optional: Pickup IDs
  accountType?: string; // Optional: User type
  createdAt: FirebaseFirestore.Timestamp;
}

/** ✅ Defines data for creating a new profile */
export interface CreateProfileData {
  displayName: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
}

/** ✅ Defines valid update operations */
export type ProfileUpdateOperation =
  | "update"
  | "addToArray"
  | "removeFromArray"
  | "set";

/** ✅ Defines data for updating an existing profile */
export interface UpdateProfileData {
  field: keyof UserProfile;
  value: string | string[];
  operation?: ProfileUpdateOperation;
}
