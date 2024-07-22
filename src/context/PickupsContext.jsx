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
  query,
  where,
  getDocs
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
      const unsubscribe = onSnapshot(
        doc(db, "pickups", user.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            const userPickups = docSnap.data().pickups || [];
            const currentUserAccepted = [];
            const currentCompleted = [];
            const currentUserPickups = [];

            userPickups.forEach((pickup) => {
              currentUserPickups.push(pickup);

              if (pickup.isAccepted && !pickup.isComplete) {
                currentUserAccepted.push(pickup);
              }

              if (pickup.isComplete) {
                currentCompleted.push(pickup);
              }
            });

            setUserCreatedPickups(currentUserPickups);
            setUserAcceptedPickups(currentUserAccepted);
            setCompletedPickups(currentCompleted);
          } else {
            setUserCreatedPickups([]);
            setUserAcceptedPickups([]);
            setCompletedPickups([]);
          }
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  const createPickup = async (pickupData) => {
    const newPickup = {
      ...pickupData,
      id: uuidv4(),
      createdAt: new Date(), // Use JavaScript Date instead of serverTimestamp()
      isAccepted: false,
      isCompleted: false,
      createdBy: user.uid,
    };

    try {
      const userDocRef = doc(db, "pickups", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // If the user document exists, update it with the new pickup
        await updateDoc(userDocRef, {
          pickups: [...userDocSnap.data().pickups, newPickup],
        });
      } else {
        // If the user document does not exist, create it with the new pickup
        await setDoc(userDocRef, {
          pickups: [newPickup],
        });
      }

      toast.success("Pickup added successfully!");
    } catch (error) {
      console.error("Error adding pickup:", error);
      toast.error("Error adding pickup. Please try again.");
    }
  };

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, "pickups"), (querySnapshot) => {
        const allPickups = [];
        const currentUserAccepted = [];
        const allAccepted = [];
        const createdPickups = [];

        querySnapshot.forEach((doc) => {
          const userPickups = doc.data().pickups || [];

          userPickups.forEach((pickup) => {
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
          });
        });

        setPickups(allPickups);
        setUserAcceptedPickups(currentUserAccepted);
        setAllAcceptedPickups(allAccepted);
        setUserCreatedPickups(createdPickups);

        const filteredVisiblePickups = allPickups.filter(
          (pickup) => !pickup.isAccepted
        );
        const filterIsCompleted = allPickups.filter((pickup) => pickup.isCompleted);
        setCompletedPickups(filterIsCompleted);
        setVisiblePickups(filteredVisiblePickups);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const acceptPickup = async (pickupId) => {
    if (!user) {
      toast.error("You must be logged in to accept pickups.");
      return;
    }

    try {
      // Fetch all user documents in the "pickups" collection
      const userDocsSnapshot = await getDocs(collection(db, "pickups"));
      let foundPickup = null;
      let pickupOwnerRef = null;

      for (const userDoc of userDocsSnapshot.docs) {
        const userData = userDoc.data();
        const userPickups = userData.pickups || [];
        const pickupIndex = userPickups.findIndex((pickup) => pickup.id === pickupId);
        if (pickupIndex !== -1) {
          foundPickup = userPickups[pickupIndex];
          pickupOwnerRef = userDoc.ref;
          userPickups[pickupIndex] = {
            ...foundPickup,
            isAccepted: true,
            acceptedBy: user.uid,
          };
          // Update the document with the modified array
          await updateDoc(pickupOwnerRef, { pickups: userPickups });
          toast.success("Pickup accepted successfully!");
          return;
        }
      }

      if (!foundPickup) {
        toast.error("Pickup not found.");
      }
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
      const pickupRef = doc(db, "pickups", pickupId);
      await updateDoc(pickupRef, {
        isCompleted: true,
        ...(weight && { weight: weight }),
      });

      const completedPickup = userAcceptedPickups.find(pickup => pickup.id === pickupId);
      if (completedPickup) {
        setUserAcceptedPickups(prev => prev.filter(pickup => pickup.id !== pickupId));
        setCompletedPickups(prev => [...prev, { ...completedPickup, isCompleted: true }]);
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
