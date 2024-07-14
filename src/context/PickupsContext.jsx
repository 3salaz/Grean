import { createContext, useContext, useState } from "react";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, writeBatch, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const PickupsContext = createContext();

export function PickupsProvider({ children }) {
  const [pickups, setPickups] = useState([]);

  const createPickup = async (uid, pickupData) => {
    console.log(`Creating pickup for user with UID: ${uid}`);
    const pickupDocRef = doc(db, "pickups", uid);
    await setDoc(pickupDocRef, pickupData);
  };

  const getUserPickups = async (uid) => {
    try {
      const pickupsCollectionRef = collection(db, "pickups");
      const q = query(pickupsCollectionRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const userPickups = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userPickups.push(data);
      });

      return userPickups;
    } catch (error) {
      console.error("Error fetching user pickups: ", error);
      return [];
    }
  };

  const updatePickup = async (uid, pickupData) => {
    console.log(`Updating pickup for user with UID: ${uid}`);
    const pickupDocRef = doc(db, "pickups", uid);
    await updateDoc(pickupDocRef, pickupData);
  };

  const deletePickup = async (uid) => {
    console.log(`Deleting pickup for user with UID: ${uid}`);
    const pickupDocRef = doc(db, "pickups", uid);
    await deleteDoc(pickupDocRef);
  };

  const batchUpdatePickups = async (pickups) => {
    const batch = writeBatch(db);
    pickups.forEach(pickup => {
      const pickupDocRef = doc(db, "pickups", pickup.uid);
      batch.set(pickupDocRef, pickup);
    });
    await batch.commit();
  };

  const value = {
    pickups,
    createPickup,
    getUserPickups,
    updatePickup,
    deletePickup,
    batchUpdatePickups
  };

  return (
    <PickupsContext.Provider value={value}>
      {children}
    </PickupsContext.Provider>
  );
}

export function usePickups() {
  return useContext(PickupsContext);
}
