import {createContext, useContext, useState, ReactNode, useEffect} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {useAuth} from "./AuthContext";
import {useProfile} from "./ProfileContext";
import {collection, query, where, getDocs} from "firebase/firestore";
import {db} from "../firebase";

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
  updatePickup: (
    pickupId: string,
    updatedData: Partial<Pickup>
  ) => Promise<void>;
  deletePickup: (pickupId: string) => Promise<void>;
  fetchAllPickups: () => Promise<void>;
  fetchUserCreatedPickups: (userId: string) => Promise<void>;
}

// Create Context
const PickupContext = createContext<PickupContextType | null>(null);

export function PickupsProvider({children}: {children: ReactNode}) {
  const {user} = useAuth();
  const {profile} = useProfile();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [userCreatedPickups, setUserCreatedPickups] = useState<Pickup[]>([]);
  const [userAcceptedPickups, setUserAcceptedPickups] = useState<Pickup[]>([]);
  const [visiblePickups, setVisiblePickups] = useState<Pickup[]>([]);
  const [completedPickups, setCompletedPickups] = useState<Pickup[]>([]);

  // Fetch All Pickups
  const fetchAllPickups = async () => {
    try {
      const q = query(
        collection(db, "pickups"),
        where("isAccepted", "==", false),
        where("isCompleted", "==", false)
      );
      const querySnapshot = await getDocs(q);
      const allPickups = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Pickup[];
      setPickups(allPickups);
    } catch (error) {
      console.error("Error fetching all pickups:", error);
      toast.error("Failed to fetch pickups.");
    }
  };

  // Fetch User Created Pickups
  const fetchUserCreatedPickups = async (userId: string) => {
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
      setUserCreatedPickups(userPickups);
    } catch (error) {
      console.error("Error fetching user created pickups:", error);
      toast.error("Failed to fetch user created pickups.");
    }
  };

  // Create Pickup
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
      console.log("🚀 Sending pickup data to backend:", dataToSend); // Added logging

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

  // Update Pickup
  const updatePickup = async (
    pickupId: string,
    updatedData: Partial<Pickup>
  ): Promise<void> => {
    try {
      const token = await user.getIdToken();
      const dataToSend = {pickupId, updates: updatedData};
      console.log("🚀 Sending update pickup data to backend:", dataToSend); // Added logging

      await axios.put(
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

  // Delete Pickup
  const deletePickup = async (pickupId: string): Promise<void> => {
    try {
      const token = await user.getIdToken();
      console.log("🚀 Sending delete pickup data to backend:", {pickupId}); // Added logging

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

  useEffect(() => {
    if (user) {
      fetchUserCreatedPickups(user.uid);
    }
  }, [user]);

  return (
    <PickupContext.Provider
      value={{
        pickups,
        userCreatedPickups,
        userAcceptedPickups,
        visiblePickups,
        completedPickups,
        createPickup,
        updatePickup,
        deletePickup,
        fetchAllPickups,
        fetchUserCreatedPickups
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
