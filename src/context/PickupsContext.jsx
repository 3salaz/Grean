import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useAuthProfile } from "./AuthProfileContext";

const PickupContext = createContext();

export const usePickups = () => useContext(PickupContext);

export const PickupsProvider = ({ children }) => {
  const [pickups, setPickups] = useState([]); // All pickups
  const [userCreatedPickups, setUserCreatedPickups] = useState([]); // Pickups created by the current user
  const [userAcceptedPickups, setUserAcceptedPickups] = useState([]); // Pickups accepted by the current user
  const [visiblePickups, setVisiblePickups] = useState([]); // Pickups visible to everyone (not accepted yet)
  const [completedPickups, setCompletedPickups] = useState([]); // Pickups that are completed
  const { user, profile } = useAuthProfile();

  // Fetch data from Firestore and filter pickups based on different criteria
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        collection(db, "pickups"),
        (querySnapshot) => {
          const allPickups = [];
          const userCreated = [];
          const userAccepted = [];
          const completed = [];
          const visible = [];

          querySnapshot.forEach((doc) => {
            const pickup = doc.data();

            // Add all pickups to the allPickups array
            allPickups.push(pickup);

            // Pickups created by the current user
            if (pickup.createdBy === user.uid) {
              userCreated.push(pickup);
            }

            // Pickups accepted by the current user
            if (pickup.acceptedBy?.uid === user.uid) {
              userAccepted.push(pickup);
            }

            // Filter visible pickups (not accepted yet)
            if (!pickup.isAccepted) {
              visible.push(pickup);
            }

            // Completed pickups
            if (pickup.isCompleted) {
              completed.push(pickup);
            }
          });

          // Update states with the filtered arrays
          setPickups(allPickups); // All pickups
          setUserCreatedPickups(userCreated); // Pickups created by the current user
          setUserAcceptedPickups(userAccepted); // Pickups accepted by the current user
          setVisiblePickups(visible); // Pickups that are visible
          setCompletedPickups(completed); // Completed pickups
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  // Create a new pickup
  const createPickup = async (pickupData) => {
    // Check how many active pickups the user has (i.e., pickups that are not completed)
    const activePickups = userCreatedPickups.filter((pickup) => !pickup.isCompleted);
  
    if (activePickups.length >= 2) {
      toast.error("You can only have 2 active pickups at a time.");
      return; // Exit the function if they have reached the limit
    }
  
    // Proceed to create a new pickup if under the limit
    const newPickupId = uuidv4(); // Generate a unique ID for the new pickup
    const newPickup = {
      ...pickupData,
      id: newPickupId,
      createdAt: new Date(), // Use JavaScript Date instead of serverTimestamp()
      isAccepted: false,
      isCompleted: false,
      createdBy: user.uid, // Ensure the current user is marked as the creator
    };
  
    try {
      const pickupDocRef = doc(db, "pickups", newPickupId);
      await setDoc(pickupDocRef, newPickup);
  
      // Update the user's profile with the new pickup ID
      const userProfileDocRef = doc(db, "profiles", user.uid);
      await updateDoc(userProfileDocRef, {
        pickups: arrayUnion(newPickupId), // Add the new pickup ID to the array
      });
  
      toast.success("Pickup added successfully!");
    } catch (error) {
      console.error("Error adding pickup:", error);
      toast.error("Error adding pickup. Please try again.");
    }
  };
  

  // Accept a pickup
  const acceptPickup = async (pickupId) => {
    if (!user) {
      toast.error("You must be logged in to accept pickups.");
      return;
    }

    try {
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
        acceptedBy: {
          uid: user.uid,
          driverName: profile.displayName,
        },
      };

      await updateDoc(pickupDocRef, updatedPickup);
      toast.success("Pickup accepted successfully!");
    } catch (error) {
      console.error("Error accepting pickup:", error);
      toast.error("Error accepting pickup. Please try again.");
    }
  };

  // Complete a pickup
  const completePickup = async (pickupId, weight) => {
    if (!user) {
      toast.error("You must be logged in to complete pickups.");
      return;
    }

    try {
      const pickupDocRef = doc(db, "pickups", pickupId);
      const docSnapshot = await getDoc(pickupDocRef);

      if (!docSnapshot.exists()) {
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
        },
      };

      const batch = writeBatch(db);
      batch.update(pickupDocRef, updatedData);

      // Update the user's profile with the completed pickup
      const userProfileDocRef = doc(db, "profiles", user.uid);
      const userProfileDoc = await getDoc(userProfileDocRef);

      const completedPickups = userProfileDoc.data().stats?.completedPickups || [];
      const updatedProfileData = {
        stats: {
          ...userProfileDoc.data().stats,
          completedPickups: [...completedPickups, pickupId],
        },
      };

      batch.update(userProfileDocRef, updatedProfileData);

      await batch.commit();

      toast.success("Pickup completed successfully!");
    } catch (error) {
      console.error("Error completing pickup:", error);
      toast.error("Error completing pickup. Please try again.");
    }
  };

  // Delete a pickup
  const deletePickup = async (pickupId) => {
    if (!user) {
      toast.error("You must be logged in to delete pickups.");
      return;
    }

    try {
      const pickupRef = doc(db, "pickups", pickupId);
      const pickupSnapshot = await getDoc(pickupRef);

      if (!pickupSnapshot.exists()) {
        toast.error("Pickup does not exist.");
        return;
      }

      if (pickupSnapshot.data().createdBy !== user.uid) {
        toast.error("You are not authorized to delete this pickup.");
        return;
      }

      await deleteDoc(pickupRef);
      setPickups((prev) => prev.filter((pickup) => pickup.id !== pickupId));

      toast.success("Pickup deleted successfully!");
    } catch (error) {
      console.error("Error deleting pickup:", error);
      toast.error("Error deleting pickup. Please try again.");
    }
  };

  return (
    <PickupContext.Provider
      value={{
        createPickup,
        pickups, // All pickups
        userCreatedPickups, // Pickups created by the current user
        userAcceptedPickups, // Pickups accepted by the current user
        visiblePickups, // Pickups visible to everyone (not accepted yet)
        completedPickups, // Completed pickups
        acceptPickup,
        completePickup,
        deletePickup,
      }}
    >
      {children}
    </PickupContext.Provider>
  );
};
