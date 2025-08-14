
/** ✅ Defines what a User Profile should look like */
export interface UserProfile {
  uid: string; // 🔑 User ID
  displayName: string;
  email: string;
  phoneNumber?: string; // Optional
  photoURL?: string; // Optional profile picture
  locations: string[]; // Locations (default to empty array)
  pickups: string[]; // Pickups (default to empty array)
  accountType: string; // Account type (default to "user")
  createdAt: FirebaseFirestore.FieldValue | FirebaseFirestore.Timestamp;
}

export interface Stats {
  totalWeight: number;
  completedPickups: number;
  materials: Record<string, number>; // or Record<MaterialType, number> if you want stricter typing
}

/** ✅ Defines data for creating a new profile */
export interface CreateProfileData {
  displayName: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  locations?: string[];
  pickups?: string[];
  accountType?: string;
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
