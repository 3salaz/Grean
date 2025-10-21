// --- Interfaces ---

/**
 * Firestore-stored Pickup document shape.
 */
export interface Pickup {
  id?: string;
  createdAt?: FirebaseFirestore.FieldValue;
  isAccepted: boolean;
  isCompleted: boolean;
  createdBy: PickupUser;
  addressData: {
    address: string;
  };
  pickupDate: string;
  pickupTime: string;
  pickupNote?: string;
  materials: string[];
}

/**
 * Basic user data stored in each Pickup.
 */
export interface PickupUser {
  userId: string;
  displayName: string;
  email: string;
  photoURL: string;
  accountType?: "User" | "Driver";
}

/**
 * Data needed to create a new pickup.
 */
export interface CreatePickupData {
  isAccepted: boolean;
  isCompleted: boolean;
  createdBy: PickupUser;
  addressData: {
    address: string;
  };
  pickupDate: string;
  pickupTime: string;
  pickupNote?: string;
  materials: string[];
}

/**
 * Bulk update request structure.
 */
export interface UpdatePickupData {
  pickupId: string;
  updates: Partial<Pickup>;
}

/**
 * Single field update request structure.
 */
export interface UpdatePickupFieldData {
  pickupId: string;
  field: keyof Pickup;
  value: Pickup[keyof Pickup];
  operation?: PickupUpdateOperation;
}

/**
 * Structure for pickup deletion.
 */
export interface DeletePickupData {
  pickupId: string;
}

// --- Types ---

/**
 * Allowed update operations.
 */
export type PickupUpdateOperation = "update" | "addToArray" | "removeFromArray" | "set";
