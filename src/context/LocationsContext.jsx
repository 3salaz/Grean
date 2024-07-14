import { createContext, useContext, useState } from "react";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, arrayUnion, getDoc, writeBatch, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const LocationsContext = createContext();

export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [businessLocations, setBusinessLocations] = useState([]);
  const [userLocations, setUserLocations] = useState([]);

  const createLocation = async (uid, accountType) => {
    console.log(`Creating location for user with UID: ${uid}`);
    const locationDocRef = doc(db, "locations", uid);
    const initialLocationData = {
      uid: uid,
      addresses: [],
      accountType: accountType
    };
    await setDoc(locationDocRef, initialLocationData);
  };

  const getUserLocation = async (uid) => {
    try {
      const locationsCollectionRef = collection(db, "locations");
      const q = query(locationsCollectionRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const userAddresses = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.addresses && Array.isArray(data.addresses)) {
          userAddresses.push(...data.addresses);
        }
      });

      return userAddresses;
    } catch (error) {
      console.error("Error fetching user addresses: ", error);
      return [];
    }
  };

  const addLocation = async (uid, locationData) => {
    console.log(`Adding location to user with UID: ${uid}`);
    const locationDocRef = doc(db, "locations", uid);
    const docSnap = await getDoc(locationDocRef);

    if (docSnap.exists()) {
      await updateDoc(locationDocRef, {
        addresses: arrayUnion(locationData),
      });
    } else {
      await setDoc(locationDocRef, {
        uid: uid,
        addresses: [locationData],
      });
    }
  };

  const updateLocation = async (uid, locationData) => {
    console.log(`Updating location for user with UID: ${uid}`);
    const locationDocRef = doc(db, "locations", uid);
    await updateDoc(locationDocRef, locationData);
  };

  const deleteLocation = async (uid) => {
    console.log(`Deleting location for user with UID: ${uid}`);
    const locationDocRef = doc(db, "locations", uid);
    await deleteDoc(locationDocRef);
  };

  const batchUpdateLocations = async (locations) => {
    const batch = writeBatch(db);
    locations.forEach(location => {
      const locationDocRef = doc(db, "locations", location.uid);
      batch.set(locationDocRef, location);
    });
    await batch.commit();
  };

  const getBusinessLocations = async () => {
    try {
      const locationsCollectionRef = collection(db, "locations");
      const q = query(locationsCollectionRef, where("locationType", "==", "Business"));
      const querySnapshot = await getDocs(q);
      const businessLocations = [];

      querySnapshot.forEach((doc) => {
        businessLocations.push(doc.data());
      });

      setBusinessLocations(businessLocations);
      return businessLocations;
    } catch (error) {
      console.error("Error fetching business locations: ", error);
      return [];
    }
  };

  const value = {
    locations,
    businessLocations,
    createLocation,
    getUserLocation,
    addLocation,
    updateLocation,
    deleteLocation,
    batchUpdateLocations,
    getBusinessLocations
  };

  return (
    <LocationsContext.Provider value={value}>
      {children}
    </LocationsContext.Provider>
  );
}

export function useLocations() {
  return useContext(LocationsContext);
}
