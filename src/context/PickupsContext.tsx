import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import { useProfile } from "./ProfileContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import type { Pickup, PickupData } from "../types/pickups";

interface PickupContextType {
  allPickups: Pickup[];
  userOwnedPickups: Pickup[];
  userAssignedPickups: Pickup[];
  availablePickups: Pickup[];
  finishedPickups: Pickup[];
  createPickup: (pickupData: PickupData) => Promise<string | undefined>;
  updatePickup: (pickupId: string, updatedData: Partial<Pickup>) => Promise<void>;
  deletePickup: (pickupId: string) => Promise<void>;
  fetchAllPickups: () => (() => void) | undefined;
  fetchUserAssignedPickups: (userId: string) => (() => void) | undefined;
  fetchUserOwnedPickups: (userId: string) => (() => void) | undefined;
  removePickup: (pickupId: string) => Promise<void>;
  startPickup: (pickupId: string) => Promise<void>;
  completePickup: (pickupId: string) => Promise<void>;
  cancelPickup: (pickupId: string) => Promise<void>;
  cancelUserPickup: (pickupId: string) => Promise<void>;
}

const PickupContext = createContext<PickupContextType | null>(null);

export function PickupsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [allPickups, setAllPickups] = useState<Pickup[]>([]);
  const [userOwnedPickups, setUserOwnedPickups] = useState<Pickup[]>([]);
  const [userAssignedPickups, setUserAssignedPickups] = useState<Pickup[]>([]);
  const [availablePickups, setAvailablePickups] = useState<Pickup[]>([]);
  const [finishedPickups, setFinishedPickups] = useState<Pickup[]>([]);

  useEffect(() => {
    if (!user || !profile || !profile.accountType) {
      console.log("⏳ Waiting on profile/accountType to initialize");
      return;
    }
  
    console.log("✅ Initializing pickups listeners");
    const unsubscribeOwned = fetchUserOwnedPickups(user.uid);
    const unsubscribeAssigned = fetchUserAssignedPickups(user.uid);
    const unsubscribeAll = fetchAllPickups();
  
    return () => {
      unsubscribeOwned?.();
      unsubscribeAssigned?.();
      unsubscribeAll?.();
    };
  }, [user, profile?.accountType]);
  
  

  const fetchAllPickups = (): (() => void) | undefined => {
    if (!user || !profile || !profile.accountType) return;
  
    const q = query(collection(db, "pickups"), where("status", "==", "pending"));
  
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let pickups = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Pickup[];
  
        if (profile.accountType === "Driver") {
          pickups = pickups.filter((pickup) => !pickup.acceptedBy);
        } else {
          pickups = pickups.filter((pickup) => pickup.createdBy.userId !== user.uid);
        }
  
        setAvailablePickups(pickups);
      },
      (error) => {
        console.error("❌ Error in real-time pickup listener:", error);
      }
    );
  
    return unsubscribe;
  };
  
  

  const fetchUserOwnedPickups = (userId: string): (() => void) | undefined => {
    try {
      const q = query(collection(db, "pickups"), where("createdBy.userId", "==", userId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userPickups = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Pickup[];
        setUserOwnedPickups(userPickups);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error in real-time user created pickups listener:", error);
      toast.error("Failed to load user pickups in real-time.");
      return undefined;
    }
  };

  const fetchUserAssignedPickups = (userId: string): (() => void) | undefined => {
    try {
      const q = query(collection(db, "pickups"), where("acceptedBy", "==", userId));

      const unsubscribe = onSnapshot(q, (snap) => {
        const activeStatuses = ["accepted", "inProgress", "pending"];
        const myPickups = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Pickup))
          .filter((p) => activeStatuses.includes(p.status));

        setUserAssignedPickups(myPickups);
      });

      return unsubscribe;
    } catch (err) {
      console.error("Error in real-time assigned-pickups listener:", err);
      toast.error("Failed to load assigned pickups in real-time.");
      return undefined;
    }
  };

  const removePickup = async (pickupId: string): Promise<void> => {
    try {
      setAvailablePickups((prev) => prev.filter((p) => p.id !== pickupId));
      toast.info("Pickup removed from queue.");
    } catch (error) {
      console.error("Error removing pickup:", error);
      toast.error("Failed to remove pickup.");
    }
  };

  const createPickup = async (pickupData: PickupData): Promise<string | undefined> => {
    try {
      if (!user || !profile) throw new Error("User or Profile not found");

      const token = await user.getIdToken();
      const dataToSend = {
        ...pickupData,
        status: "pending",
        pickupDate: pickupData.pickupTime.split("T")[0],
        createdBy: {
          userId: user.uid,
          displayName: profile.displayName,
          email: profile.email,
          photoURL: profile.photoURL,
        },
      };

      const response = await axios.post(
        "https://us-central1-grean-de04f.cloudfunctions.net/api/createPickupFunction",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && typeof response.data === "object" && "pickupId" in response.data) {
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

  const updatePickup = async (
    pickupId: string,
    fieldOrUpdates: string | Partial<Pickup>,
    value?: any,
    operation: "update" | "addToArray" | "removeFromArray" = "update"
  ): Promise<void> => {
    try {
      const token = await user.getIdToken();
      const dataToSend =
        typeof fieldOrUpdates === "string"
          ? { pickupId, field: fieldOrUpdates, value, operation }
          : { pickupId, updates: fieldOrUpdates };

      await axios.post(
        "https://us-central1-grean-de04f.cloudfunctions.net/api/updatePickupFunction",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating pickup:", error);
      toast.error("Failed to update pickup.");
    }
  };

  const startPickup = (pickupId: string) => updatePickup(pickupId, { status: "inProgress" });

  const completePickup = (pickupId: string) => updatePickup(pickupId, { status: "completed" });

  const cancelPickup = (pickupId: string) => updatePickup(pickupId, { status: "pending" });

  const cancelUserPickup = (pickupId: string) => updatePickup(pickupId, { status: "cancelled" });

  const deletePickup = async (pickupId: string): Promise<void> => {
    try {
      const token = await user.getIdToken();

      await axios.delete(
        "https://us-central1-grean-de04f.cloudfunctions.net/api/deletePickupFunction",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { pickupId },
        }
      );

      toast.success("Pickup deleted successfully!");
    } catch (error) {
      console.error("Error deleting pickup:", error);
      toast.error("Failed to delete pickup.");
    }
  };

  return (
    <PickupContext.Provider
      value={{
        allPickups,
        userOwnedPickups,
        userAssignedPickups,
        availablePickups,
        finishedPickups,
        createPickup,
        updatePickup,
        deletePickup,
        fetchAllPickups,
        fetchUserOwnedPickups,
        fetchUserAssignedPickups,
        removePickup,
        startPickup,
        completePickup,
        cancelPickup,
        cancelUserPickup,
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
