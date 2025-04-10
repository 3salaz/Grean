import {createContext, useContext, useState, ReactNode, useEffect} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {useAuth} from "./AuthContext";
import {useProfile} from "./ProfileContext";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot
} from "firebase/firestore";
import {db} from "../firebase";

// Define Pickup Type
export interface Pickup {
  id: string;
  createdAt: string;
  isAccepted: boolean;
  isCompleted: boolean;
  createdBy: {
    userId: string;
    displayName: string;
    email: string;
    photoURL: string;
  };
  acceptedBy?: string;
  addressData: {address: string};
  pickupDate: string;
  pickupTime: string;
  pickupNote?: string;
  materials: string[];
}

// Define PickupContext Type
interface PickupContextType {
  allPickups: Pickup[];
  userOwnedPickups: Pickup[];
  userAssignedPickups: Pickup[];
  availablePickups: Pickup[];
  finishedPickups: Pickup[];
  createPickup: (
    pickupData: Omit<
      Pickup,
      "id" | "createdAt" | "isAccepted" | "isCompleted" | "createdBy"
    >
  ) => Promise<string | undefined>;
  updatePickup: (
    pickupId: string,
    updatedData: Partial<Pickup>
  ) => Promise<void>;
  deletePickup: (pickupId: string) => Promise<void>;
  fetchAllPickups: () => (() => void) | undefined;
  fetchUserOwnedPickups: (userId: string) => Promise<void>;
  // acceptPickup: (pickupId: string) => Promise<void>;
  removePickup: (pickupId: string) => Promise<void>;
}

// Create Context
const PickupContext = createContext<PickupContextType | null>(null);

export function PickupsProvider({children}: {children: ReactNode}) {
  const {user} = useAuth();
  const {profile} = useProfile();
  const [allPickups, setAllPickups] = useState<Pickup[]>([]);
  const [userOwnedPickups, setUserOwnedPickups] = useState<Pickup[]>([]);
  const [userAssignedPickups, setUserAssignedPickups] = useState<Pickup[]>([]);
  const [availablePickups, setAvailablePickups] = useState<Pickup[]>([]);
  const [finishedPickups, setFinishedPickups] = useState<Pickup[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (user && profile) {
      unsubscribe = fetchAllPickups();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, profile]);

  const fetchAllPickups = (): (() => void) | undefined => {
    if (!user || !profile) return;

    const q = query(
      collection(db, "pickups"),
      where("isAccepted", "==", false),
      where("isCompleted", "==", false)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let pickups = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Pickup[];

        if (profile.accountType === "Driver") {
          // console.log("👷 Driver view: showing all unaccepted pickups.");
        } else {
          pickups = pickups.filter(
            (pickup) => pickup.createdBy.userId !== user.uid
          );
        }

        setAvailablePickups(pickups);
        // console.log("📦 Real-time availablePickups updated:", pickups);
      },
      (error) => {
        console.error("❌ Error in real-time pickup listener:", error);
        // toast.error("Failed to load pickups in real-time.");
      }
    );

    return unsubscribe;
  };

  const fetchUserOwnedPickups = async (userId: string) => {
    try {
      const q = query(
        collection(db, "pickups"),
        where("createdBy.userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const userPickups = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Pickup[];
      setUserOwnedPickups(userPickups);
    } catch (error) {
      console.error("Error fetching user created pickups:", error);
      toast.error("Failed to fetch user created pickups.");
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

  const createPickup = async (
    pickupData: Omit<
      Pickup,
      "id" | "createdAt" | "isAccepted" | "isCompleted" | "createdBy"
    >
  ): Promise<string | undefined> => {
    try {
      if (!user || !profile) throw new Error("User or Profile not found");

      const token = await user.getIdToken();
      const dataToSend = {
        ...pickupData,
        createdBy: {
          userId: user.uid,
          displayName: profile.displayName,
          email: profile.email,
          photoURL: profile.photoURL
        }
      };

      const response = await axios.post(
        "https://us-central1-grean-de04f.cloudfunctions.net/api/createPickupFunction",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

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

  const updatePickup = async (
    pickupId: string,
    fieldOrUpdates: string | Partial<Pickup>,
    value?: any,
    operation: "update" | "addToArray" | "removeFromArray" = "update"
  ): Promise<void> => {
    try {
      const token = await user.getIdToken();
      let dataToSend;

      if (typeof fieldOrUpdates === "string") {
        dataToSend = {
          pickupId,
          field: fieldOrUpdates,
          value,
          operation
        };
      } else {
        dataToSend = {
          pickupId,
          updates: fieldOrUpdates
        };
      }

      await axios.post(
        "https://us-central1-grean-de04f.cloudfunctions.net/api/updatePickupFunction",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Pickup updated successfully!");
    } catch (error) {
      console.error("Error updating pickup:", error);
      toast.error("Failed to update pickup.");
    }
  };

  const deletePickup = async (pickupId: string): Promise<void> => {
    try {
      const token = await user.getIdToken();

      await axios.delete(
        "https://us-central1-grean-de04f.cloudfunctions.net/api/deletePickupFunction",
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {pickupId}
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
        // acceptPickup,
        removePickup
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
