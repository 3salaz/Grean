import {
  collection,
  doc,
  onSnapshot,
  writeBatch,
  arrayUnion,
  arrayRemove,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useProfile } from "./ProfileContext";
import { useAuth } from "./AuthContext";

// Define Types
interface Pickup {
  id: string;
  createdAt: Date;
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
}

interface PickupContextType {
  pickups: Pickup[];
  userCreatedPickups: Pickup[];
  userAcceptedPickups: Pickup[];
  visiblePickups: Pickup[];
  completedPickups: Pickup[];
  createPickup: (pickupData: Omit<Pickup, "id" | "createdAt" | "isAccepted" | "isCompleted" | "createdBy">) => Promise<void>;
  editPickup: (pickupId: string, updatedData: Partial<Pickup>) => Promise<void>;
  deletePickup: (pickupId: string) => Promise<void>;
}

const PickupContext = createContext<PickupContextType | undefined>(undefined);

export const usePickups = (): PickupContextType => {
  const context = useContext(PickupContext);
  if (!context) {
    throw new Error("usePickups must be used within a PickupsProvider");
  }
  return context;
};

interface PickupsProviderProps {
  children: ReactNode;
}

export const PickupsProvider: React.FC<PickupsProviderProps> = ({ children }) => {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const { user } = useAuth();
  const { profile } = useProfile();

  // Real-time listener for pickups
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, "pickups"), (querySnapshot) => {
        const fetchedPickups: Pickup[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Pickup[];
        setPickups(fetchedPickups);
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Create a new pickup
  const createPickup = async (pickupData: Omit<Pickup, "id" | "createdAt" | "isAccepted" | "isCompleted" | "createdBy">) => {
    try {
      if (!user || !profile) throw new Error("User or Profile not found");

      const newPickupId = uuidv4();
      const newPickup: Pickup = {
        id: newPickupId,
        createdAt: new Date(),
        isAccepted: false,
        isCompleted: false,
        createdBy: {
          userId: user.uid,
          displayName: profile.displayName || "No Name",
          email: profile.email,
          photoURL: profile.profilePic || "",
        },
        ...pickupData,
      };

      const batch = writeBatch(db);

      // Add the pickup to the pickups collection
      batch.set(doc(db, "pickups", newPickupId), newPickup);

      // Add the pickup ID to the profile's pickups array
      batch.update(doc(db, "profiles", user.uid), {
        pickups: arrayUnion(newPickupId),
      });

      await batch.commit();
      toast.success("Pickup created successfully!");
    } catch (error) {
      console.error("Error creating pickup:", error);
      toast.error("Error creating pickup. Please try again.");
    }
  };

  // Edit an existing pickup
  const editPickup = async (pickupId: string, updatedData: Partial<Pickup>) => {
    try {
      if (!user) throw new Error("User not found");

      const batch = writeBatch(db);

      // Update the pickup in the pickups collection
      const pickupRef = doc(db, "pickups", pickupId);
      batch.update(pickupRef, updatedData);

      // Update the pickup in the profile's pickups array
      const profileRef = doc(db, "profiles", user.uid);
      const profileSnap = await getDoc(profileRef);
      const profileData = profileSnap.data();

      if (profileData?.pickups) {
        const updatedPickups = profileData.pickups.map((pickup: Pickup) =>
          pickup.id === pickupId ? { ...pickup, ...updatedData } : pickup
        );

        batch.update(profileRef, { pickups: updatedPickups });
      }

      await batch.commit();
      toast.success("Pickup updated successfully!");
    } catch (error) {
      console.error("Error editing pickup:", error);
      toast.error("Error editing pickup. Please try again.");
    }
  };

  // Delete a pickup
  const deletePickup = async (pickupId: string) => {
    try {
      if (!user) throw new Error("User not found");

      const batch = writeBatch(db);

      // Delete the pickup from the pickups collection
      const pickupRef = doc(db, "pickups", pickupId);
      batch.delete(pickupRef);

      // Remove the pickup ID from the profile's pickups array
      const profileRef = doc(db, "profiles", user.uid);
      batch.update(profileRef, {
        pickups: arrayRemove(pickupId),
      });

      await batch.commit();
      toast.success("Pickup deleted successfully!");
    } catch (error) {
      console.error("Error deleting pickup:", error);
      toast.error("Error deleting pickup. Please try again.");
    }
  };

  // Filters
  const userCreatedPickups = pickups.filter((pickup) => pickup.createdBy?.userId === user?.uid);
  const userAcceptedPickups = pickups.filter((pickup) => pickup.acceptedBy?.uid === user?.uid);
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
        deletePickup,
      }}
    >
      {children}
    </PickupContext.Provider>
  );
};
