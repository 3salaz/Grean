import {createContext, useContext, useState, ReactNode} from "react";
import {httpsCallable} from "firebase/functions";
import {functions} from "../firebase";
import {toast} from "react-toastify";
import {useAuth} from "./AuthContext";
import {useProfile} from "./ProfileContext";

// Define Pickup Type
export interface Pickup {
  id: string;
  createdAt: string; // Stored as ISO string in Firestore
  isAccepted: boolean;
  isCompleted: boolean;
  createdBy: {
    userId: string;
    displayName: string;
    email: string;
    photoURL: string;
  };
  acceptedBy?: {
    uid: string;
    displayName: string;
  };
  addressData: {address: string}; // ✅ Updated to match the database structure
  pickupDate: string;
  pickupTime: string;
  pickupNote?: string;
  materials: string[];
}

// Define PickupContext Type
interface PickupContextType {
  pickups: Pickup[];
  userCreatedPickups: Pickup[];
  userAcceptedPickups: Pickup[];
  visiblePickups: Pickup[];
  completedPickups: Pickup[];
  createPickup: (
    pickupData: Omit<
      Pickup,
      "id" | "createdAt" | "isAccepted" | "isCompleted" | "createdBy"
    >
  ) => Promise<string | undefined>;
  editPickup: (pickupId: string, updatedData: Partial<Pickup>) => Promise<void>;
  deletePickup: (pickupId: string) => Promise<void>;
}

// Create Context
const PickupContext = createContext<PickupContextType | null>(null);

export function PickupsProvider({children}: {children: ReactNode}) {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const {user} = useAuth();
  const {profile} = useProfile();

  // Create Pickup
  const createPickup = async (
    pickupData: Omit<
      Pickup,
      "id" | "createdAt" | "isAccepted" | "isCompleted" | "createdBy"
    >
  ): Promise<string | undefined> => {
    try {
      if (!user || !profile) throw new Error("User or Profile not found");

      const createPickupFn = httpsCallable(functions, "createPickup");
      const response = await createPickupFn({...pickupData, userId: user.uid});

      if (
        response.data &&
        typeof response.data === "object" &&
        "pickupId" in response.data
      ) {
        toast.success("Pickup created successfully!");
        return response.data.pickupId as string;
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (error) {
      console.error("Error creating pickup:", error);
      toast.error("Failed to create pickup.");
    }
  };

  // Edit Pickup
  const editPickup = async (
    pickupId: string,
    updatedData: Partial<Pickup>
  ): Promise<void> => {
    try {
      const editPickupFn = httpsCallable(functions, "editPickup");
      await editPickupFn({pickupId, updatedData});
      toast.success("Pickup updated successfully!");
    } catch (error) {
      console.error("Error updating pickup:", error);
      toast.error("Failed to update pickup.");
    }
  };

  // Delete Pickup
  const deletePickup = async (pickupId: string): Promise<void> => {
    try {
      const deletePickupFn = httpsCallable(functions, "deletePickup");
      await deletePickupFn({pickupId});
      toast.success("Pickup deleted successfully!");
    } catch (error) {
      console.error("Error deleting pickup:", error);
      toast.error("Failed to delete pickup.");
    }
  };

  // Filters
  const userCreatedPickups = pickups.filter(
    (pickup) => pickup.createdBy?.userId === user?.uid
  );
  const userAcceptedPickups = pickups.filter(
    (pickup) => pickup.acceptedBy?.uid === user?.uid
  );
  const visiblePickups = pickups.filter((pickup) => !pickup.isAccepted);
  const completedPickups = pickups.filter((pickup) => pickup.isCompleted);

  return (
    <PickupContext.Provider
      value={{
        pickups,
        userCreatedPickups,
        userAcceptedPickups,
        visiblePickups,
        completedPickups,
        createPickup,
        editPickup,
        deletePickup
      }}
    >
      {children}
    </PickupContext.Provider>
  );
}

export function usePickups() {
  const context = useContext(PickupContext);
  if (!context) {
    throw new Error("usePickups must be used within a PickupsProvider");
  }
  return context;
}
