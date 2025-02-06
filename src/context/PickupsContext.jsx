import {
  collection,
  doc,
  onSnapshot,
  writeBatch,
  arrayUnion,
  arrayRemove,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useProfile } from "./ProfileContext";
import { useAuth } from "./AuthContext";

const PickupContext = createContext();

export const usePickups = () => useContext(PickupContext);

export const PickupsProvider = ({ children }) => {
  const [pickups, setPickups] = useState([]);
  const { user } = useAuth();
  const { profile } = useProfile();

  // Real-time listener for pickups
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, "pickups"), (querySnapshot) => {
        const fetchedPickups = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPickups(fetchedPickups);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Create a new pickup
  const createPickup = async (pickupData) => {
    try {
      const newPickupId = uuidv4();
      const newPickup = {
        ...pickupData,
        id: newPickupId,
        createdAt: new Date(),
        isAccepted: false,
        isCompleted: false,
        createdBy: {
          userId: user?.uid,
          displayName: profile?.displayName || "No Name",
          email: profile?.email,
          photoURL: profile?.profilePic || "",
        },
      };

      const batch = writeBatch(db);

      // Add the pickup to the pickups collection
      batch.set(doc(db, "pickups", newPickupId), newPickup);

      // Add the pickup ID to the profile's pickups array
      batch.update(doc(db, "profiles", user?.uid), {
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
  const editPickup = async (pickupId, updatedData) => {
    try {
      const batch = writeBatch(db);

      // Update the pickup in the pickups collection
      const pickupRef = doc(db, "pickups", pickupId);
      batch.update(pickupRef, updatedData);

      // Update the pickup in the profile's pickups array
      const profileRef = doc(db, "profiles", user?.uid);
      const profileSnap = await getDoc(profileRef);
      const profileData = profileSnap.data();

      const updatedPickups = profileData.pickups.map((pickup) =>
        pickup.id === pickupId ? { ...pickup, ...updatedData } : pickup
      );

      batch.update(profileRef, { pickups: updatedPickups });

      await batch.commit();
      toast.success("Pickup updated successfully!");
    } catch (error) {
      console.error("Error editing pickup:", error);
      toast.error("Error editing pickup. Please try again.");
    }
  };

  // Delete a pickup
  const deletePickup = async (pickupId) => {
    try {
      const batch = writeBatch(db);

      // Delete the pickup from the pickups collection
      const pickupRef = doc(db, "pickups", pickupId);
      batch.delete(pickupRef);

      // Remove the pickup ID from the profile's pickups array
      const profileRef = doc(db, "profiles", user?.uid);
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
