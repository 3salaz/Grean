import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  writeBatch
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useAuthProfile } from "./AuthProfileContext";
import { useLocations } from "./LocationsContext";

const PickupContext = createContext();

export const usePickups = () => useContext(PickupContext);

export const PickupsProvider = ({ children }) => {
  const [pickups, setPickups] = useState([]);
  const [userAcceptedPickups, setUserAcceptedPickups] = useState([]);
  const [allAcceptedPickups, setAllAcceptedPickups] = useState([]);
  const [visiblePickups, setVisiblePickups] = useState([]);
  const [completedPickups, setCompletedPickups] = useState([]);
  const [userCreatedPickups, setUserCreatedPickups] = useState([]);
  const { user, profile } = useAuthProfile();
  const { addLocation } = useLocations();

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, "pickups"), (querySnapshot) => {
        const allPickups = [];
        const currentUserAccepted = [];
        const allAccepted = [];
        const createdPickups = [];
        const currentCompleted = [];

        querySnapshot.forEach((doc) => {
          const pickup = doc.data();
          allPickups.push(pickup);

          if (pickup.isAccepted) {
            allAccepted.push(pickup);
            if (pickup.acceptedBy === user.uid) {
              currentUserAccepted.push(pickup);
            }
          }

          if (pickup.createdBy === user.uid) {
            createdPickups.push(pickup);
          }

          if (pickup.isCompleted) {
            currentCompleted.push(pickup);
          }
        });

        setPickups(allPickups);
        setUserAcceptedPickups(currentUserAccepted);
        setAllAcceptedPickups(allAccepted);
        setUserCreatedPickups(createdPickups);
        setCompletedPickups(currentCompleted);

        const filteredVisiblePickups = allPickups.filter(
          (pickup) => !pickup.isAccepted
        );
        setVisiblePickups(filteredVisiblePickups);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const createPickup = async (pickupData) => {
    const newPickupId = uuidv4(); // Generate a unique ID for the new pickup
    const newPickup = {
      ...pickupData,
      id: newPickupId,
      createdAt: new Date(), // Use JavaScript Date instead of serverTimestamp()
      isAccepted: false,
      isCompleted: false,
      createdBy: user.uid,
    };

    try {
      // Reference to the new pickup document in the pickups collection
      const pickupDocRef = doc(db, "pickups", newPickupId);

      // Create the new pickup document
      await setDoc(pickupDocRef, newPickup);

      toast.success("Pickup added successfully!");
    } catch (error) {
      console.error("Error adding pickup:", error);
      toast.error("Error adding pickup. Please try again.");
    }
  };

  const acceptPickup = async (pickupId) => {
    if (!user) {
      toast.error("You must be logged in to accept pickups.");
      return;
    }

    try {
      // Reference to the specific pickup document in the pickups collection
      const pickupDocRef = doc(db, "pickups", pickupId);
      const pickupDoc = await getDoc(pickupDocRef);

      if (!pickupDoc.exists()) {
        toast.error("Pickup not found.");
        return;
      }

      const pickupData = pickupDoc.data();
      const updatedPickup = {
        ...pickupData,
        isAccepted: true,
        acceptedBy: user.uid,
        driverName: profile.displayName
      };

      await updateDoc(pickupDocRef, updatedPickup);
      toast.success("Pickup accepted successfully!");
    } catch (error) {
      console.error("Error accepting pickup:", error);
      toast.error("Error accepting pickup. Please try again.");
    }
  };

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
      console.error("Error deleting pickup:", error);
      toast.error("Error deleting pickup. Please try again.");
    }
  };

  const completePickup = async (pickupId, weight) => {
    if (!user) {
      toast.error("You must be logged in to complete pickups.");
      return;
    }
  
    try {
      // Verify pickupId is correct
      console.log("Completing pickup with ID:", pickupId);
  
      const pickupDocRef = doc(db, "pickups", pickupId);
      const docSnapshot = await getDoc(pickupDocRef);
  
      if (!docSnapshot.exists()) {
        console.error("No document to update:", pickupId);
        toast.error("Pickup document does not exist.");
        return;
      }
  
      const updatedData = {
        isCompleted: true,
        pickupWeight: {
          ...(weight.glassWeight && { glassWeight: weight.glassWeight }),
          ...(weight.aluminumWeight && { aluminumWeight: weight.aluminumWeight }),
          ...(weight.plasticWeight && { plasticWeight: weight.plasticWeight }),
          ...(weight.alcoholBottlesWeight && { alcoholBottlesWeight: weight.alcoholBottlesWeight }),
        }
      };
  
      // Begin Firestore batch operation
      const batch = writeBatch(db);
  
      // Update the pickup document
      batch.update(pickupDocRef, updatedData);
  
      // Reference to the user's profile document
      const userProfileDocRef = doc(db, "profiles", user.uid);
      const userProfileDoc = await getDoc(userProfileDocRef);
  
      if (!userProfileDoc.exists()) {
        console.error("User profile document does not exist:", user.uid);
        toast.error("User profile document does not exist.");
        return;
      }
  
      // Get the existing completedPickups array or initialize it if it doesn't exist
      const userProfileData = userProfileDoc.data();
      const completedPickups = userProfileData.stats?.completedPickups || [];
      const updatedProfileData = {
        stats: {
          ...userProfileData.stats,
          completedPickups: [...completedPickups, pickupId]
        }
      };
  
      batch.update(userProfileDocRef, updatedProfileData);
  
      // Commit the batch operation
      await batch.commit();
  
      const completedPickup = userAcceptedPickups.find((pickup) => pickup.id === pickupId);
      if (completedPickup) {
        setUserAcceptedPickups((prev) => prev.filter((pickup) => pickup.id !== pickupId));
        setCompletedPickups((prev) => [...prev, { ...completedPickup, isCompleted: true, pickupWeight: updatedData.pickupWeight }]);
      }
  
      toast.success("Pickup completed successfully!");
    } catch (error) {
      console.error("Error completing pickup:", error);
      toast.error("Error completing pickup. Please try again.");
    }
  };

  const removePickup = async (pickupId) => {
    try {
      await deleteDoc(doc(db, "pickups", pickupId));
      setUserCreatedPickups((prevPickups) => prevPickups.filter((pickup) => pickup.id !== pickupId));
      toast.success("Pickup removed successfully!");
    } catch (error) {
      console.error("Error removing pickup:", error);
      toast.error("Error removing pickup. Please try again.");
    }
  };

  return (
    <PickupContext.Provider
      value={{
        createPickup,
        pickups,
        visiblePickups,
        userAcceptedPickups,
        allAcceptedPickups,
        completedPickups,
        userCreatedPickups,
        acceptPickup,
        deletePickup,
        completePickup,
        removePickup,
      }}
    >
      {children}
    </PickupContext.Provider>
  );
};
