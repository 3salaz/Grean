import { createContext, useContext, useState, useEffect } from "react";
import { doc, setDoc, updateDoc, arrayUnion, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";

const LocationsContext = createContext();

export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [businessLocations, setBusinessLocations] = useState([]);
  const [usersLocation, setUsersLocation] = useState([]);

  const getLocationDocRef = (uid, collectionName) => {
    return doc(db, collectionName, uid);
  };

  const getUserLocation = async (uid, collectionName) => {
    try {
      const locationDocRef = getLocationDocRef(uid, collectionName);
      const docSnap = await getDoc(locationDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.locations && Array.isArray(data.locations.addresses)) {
          setUsersLocation(data.locations.addresses); // Update the state
          return data.locations.addresses;
        }
      }

      setUsersLocation([]); // Update the state
      return [];
    } catch (error) {
      console.error("Error fetching user addresses: ", error);
      setUsersLocation([]); // Update the state
      return [];
    }
  };

  const createLocation = async (uid, locationData, collectionName) => {
    console.log(`Adding location to user with UID: ${uid} in collection: ${collectionName}`);
    const locationDocRef = getLocationDocRef(uid, collectionName);
    const docSnap = await getDoc(locationDocRef);

    if (docSnap.exists()) {
      await updateDoc(locationDocRef, {
        "locations.addresses": arrayUnion(locationData),
      });
      await getUserLocation(uid, collectionName); // Refresh the user's locations
    } else {
      await setDoc(locationDocRef, {
        uid: uid,
        locations: { addresses: [locationData] },
        stats: {
          overall: 0,
          pickups: []
        },
      });
      await getUserLocation(uid, collectionName); // Refresh the user's locations
      await getAllLocations(); // Refresh all locations
    }
  };

  const getAllLocations = async () => {
    try {
      const locationsCollectionRef = collection(db, "locations");
      const querySnapshot = await getDocs(locationsCollectionRef);
      const allLocations = querySnapshot.docs.map(doc => doc.data());

      setLocations(allLocations); // Update the state with all locations
      return allLocations;
    } catch (error) {
      console.error("Error fetching all locations: ", error);
      setLocations([]); // Update the state
      return [];
    }
  };

  const value = {
    locations,
    businessLocations,
    usersLocation,
    createLocation,
    getUserLocation,
    getAllLocations,
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
