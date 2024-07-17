import { createContext, useContext, useState, useEffect } from "react";
import { collection, doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
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

  const updateLocation = async (uid, locationData, collectionName) => {
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
        accountType: "User",
        email: "dominic@gmail.com", // Replace with actual email
        displayName: "dominic" // Replace with actual display name
      });
      await getUserLocation(uid, collectionName); // Refresh the user's locations
    }
  };

  const value = {
    locations,
    businessLocations,
    usersLocation,
    updateLocation,
    getUserLocation,
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
