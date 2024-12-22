import { createContext, useContext, useState, useEffect } from "react";
import { collection, doc, onSnapshot, setDoc, updateDoc, writeBatch, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useAuthProfile } from "./AuthProfileContext";

const PickupContext = createContext();

export const usePickups = () => useContext(PickupContext);

export const PickupsProvider = ({ children }) => {
  const [pickups, setPickups] = useState([]);
  const { user, profile } = useAuthProfile();

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, "pickups"), (querySnapshot) => {
        const fetchedPickups = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPickups(fetchedPickups);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const createPickup = async (pickupData) => {
    try {
      // Generate a unique ID for the new pickup
      const newPickupId = uuidv4();
  
      // Build the complete pickup object
      const newPickup = {
        ...pickupData,
        id: newPickupId, // Include the unique ID
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
  
      // Begin a Firebase batch operation
      const batch = writeBatch(db);
  
      // Add the new pickup to the Pickups collection
      batch.set(doc(db, "pickups", newPickupId), newPickup);
  
      // Update the profile document to include the full pickup object in the pickups array
      batch.update(doc(db, "profiles", user?.uid), {
        pickups: arrayUnion(newPickup), // Add the full pickup object to the array
      });
  
      // Commit the batch
      await batch.commit();
  
      toast.success("Pickup created successfully!");
    } catch (error) {
      console.error("Error creating pickup:", error);
      toast.error("Error creating pickup. Please try again.");
    }
  };
  

  const updatePickup = async (pickupId, updates) => {
    try {
      await updateDoc(doc(db, "pickups", pickupId), updates);
      toast.success("Pickup updated successfully!");
    } catch (error) {
      console.error("Error updating pickup:", error);
      toast.error("Error updating pickup. Please try again.");
    }
  };

  return (
    <PickupContext.Provider
      value={{
        pickups,
        userCreatedPickups: pickups.filter((pickup) => pickup.createdBy?.userId === user?.uid),
        userAcceptedPickups: pickups.filter((pickup) => pickup.acceptedBy?.uid === user?.uid),
        visiblePickups: pickups.filter((pickup) => !pickup.isAccepted),
        completedPickups: pickups.filter((pickup) => pickup.isCompleted),
        createPickup,
        updatePickup,
      }}
    >
      {children}
    </PickupContext.Provider>
  );
};
