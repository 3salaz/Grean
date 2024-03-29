import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { UserAuth } from "./AuthContext";

const PickupContext = createContext();

export const usePickups = () => useContext(PickupContext);

export const PickupsProvider = ({ children }) => {
  const [pickups, setPickups] = useState([]);
  // User Accepted For User / Admin
  const [userAcceptedPickups, setUserAcceptedPickups] = useState([]);
  // All Accepted is for Admin
  const [allAcceptedPickups, setAllAcceptedPickups] = useState([]);

  // For notification modal, we need to be able to see all pickups that are open and
  const [visiblePickups, setVisiblePickups] = useState([]);
  const [completedPickups, setCompletedPickups] = useState([]);
  const [userCreatedPickups, setUserCreatedPickups] = useState([]);
  const { user } = UserAuth();

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        collection(db, "pickups"),
        (querySnapshot) => {
          const currentUserPickups = [];
          const currentUserAccepted = [];
          const currentCompleted = [];
  
          querySnapshot.forEach((doc) => {
            const pickup = { id: doc.id, ...doc.data() };
  
            // Assuming 'createdBy' stores the UID of the user who created the pickup
            if (pickup.createdBy === user.uid) {
              currentUserPickups.push(pickup);
  
              // Check if the pickup is accepted but not completed
              if (pickup.isAccepted && !pickup.isComplete) {
                currentUserAccepted.push(pickup);
              }
  
              // Check if the pickup is completed
              if (pickup.isComplete) {
                currentCompleted.push(pickup);
              }
            }
          });
  
          setUserCreatedPickups(currentUserPickups);
          setUserAcceptedPickups(currentUserAccepted);
          setCompletedPickups(currentCompleted);
        }
      );
  
      return () => unsubscribe();
    }
  }, [user]);

  // Create Pickups

  const createPickup = async (pickupData) => {
    const newPickupId = uuidv4();
    const newPickup = {
      ...pickupData,
      id: newPickupId,
      createdAt: serverTimestamp(),
      isAccepted: false, // Ensure new pickups are marked as not accepted
      isCompleted: false,
      createdBy: user.uid, // Add the createdBy field
    };

    try {
      await setDoc(doc(db, "pickups", newPickupId), newPickup);
      toast.success("Pickup added successfully!");
    } catch (error) {
      console.error("Error adding pickup:", error);
      toast.error("Error adding pickup. Please try again.");
    }
  };

  // Read
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        collection(db, "pickups"),
        (querySnapshot) => {
          const allPickups = [];
          const currentUserAccepted = [];
          const allAccepted = [];
          const createdPickups = [];

          querySnapshot.forEach((doc) => {
            const pickup = { id: doc.id, ...doc.data() };
            allPickups.push(pickup);

            // Check for accepted pickups
            if (pickup.isAccepted) {
              allAccepted.push(pickup);
              if (pickup.acceptedBy === user.uid) {
                currentUserAccepted.push(pickup);
              }
            }

            // Check for pickups created by the user
            if (pickup.createdBy === user.uid) {
              createdPickups.push(pickup);
            }
          });

          setPickups(allPickups);
          setUserAcceptedPickups(currentUserAccepted);
          setAllAcceptedPickups(allAccepted);
          setUserCreatedPickups(createdPickups); // Set pickups created by the user

          // Filter for visiblePickups: not accepted and open
          const filteredVisiblePickups = allPickups.filter(
            (pickup) => !pickup.isAccepted
          );
          const filterIsCompleted = allPickups.filter(
            (pickup) => pickup.isCompleted
          );
          setCompletedPickups(filterIsCompleted);
          setVisiblePickups(filteredVisiblePickups); // Set visiblePickups
        }
      );

      return () => unsubscribe(); // Cleanup on unmount
    }
  }, [user]); // Depend on user to refetch when the user changes

  // Update Pickup

  const acceptPickup = async (pickupId) => {
    if (!user) {
      toast.error("You must be logged in to accept pickups.");
      return;
    }

    const pickupRef = doc(db, "pickups", pickupId);
    try {
      await updateDoc(pickupRef, {
        isAccepted: true,
        acceptedBy: user.uid
      });

      // Optimistically update the local state to reflect the accepted pickup
      setPickups((pickups) =>
        pickups.filter((pickup) => pickup.id !== pickupId)
      );
      toast.success("Pickup accepted successfully!");
    } catch (error) {
      console.error("Error accepting pickup: ", error);
      toast.error("Error accepting pickup. Please try again.");
    }
  };

  // Delete Pickups
  const deletePickup = async (pickupId) => {
    if (!user) {
      toast.error("You must be logged in to delete pickups.");
      return;
    }

    const pickupRef = doc(db, "pickups", pickupId);
    const pickupSnapshot = await getDoc(pickupRef);

    if (!pickupSnapshot.exists()) {
      toast.error("Pickup does not exist.");
      return;
    }

    const pickupData = pickupSnapshot.data();
    if (pickupData.createdBy !== user.uid) {
      toast.error("You are not authorized to delete this pickup.");
      return;
    }

    try {
      await deleteDoc(pickupRef);
      setPickups((currentPickups) =>
        currentPickups.filter((pickup) => pickup.id !== pickupId)
      );
      toast.success("Pickup deleted successfully!");
    } catch (error) {
      console.error("Error deleting pickup: ", error);
      toast.error("Error deleting pickup. Please try again.");
    }
  };

  // Complete Pickup
  const completePickup = async (pickupId, weight) => {
    if (!user) {
      toast.error("You must be logged in to complete pickups.");
      return;
    }
    try {
      const pickupRef = doc(db, "pickups", pickupId);
      await updateDoc(pickupRef, {
        isCompleted: true,
        ...(weight && { weight: weight }),
      });
  
      // Find the completed pickup in userAcceptedPickups
      const completedPickup = userAcceptedPickups.find(pickup => pickup.id === pickupId);
      if (completedPickup) {
        // Update local state to move the completed pickup
        setUserAcceptedPickups(prev => prev.filter(pickup => pickup.id !== pickupId));
        setCompletedPickups(prev => [...prev, { ...completedPickup, isCompleted: true }]);
      }
  
      toast.success("Pickup completed successfully!");
    } catch (error) {
      console.error("Error completing pickup:", error);
      toast.error("Error completing pickup. Please try again.");
    }
  };

  return (
    <PickupContext.Provider
      value={{
        // CREATE
        createPickup,
        // READ
        pickups,
        visiblePickups,
        userAcceptedPickups,
        allAcceptedPickups,
        completedPickups,
        userCreatedPickups,
        // UPDATE
        acceptPickup,
        // DELETE
        deletePickup,
        completePickup,
      }}
    >
      {children}
    </PickupContext.Provider>
  );
};
