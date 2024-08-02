// src/context/LocationsContext.js
import { createContext, useContext, useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  setDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuthProfile } from "./AuthProfileContext";
import {
  incrementReadCount,
  incrementWriteCount,
} from "../utils/requestCounter";

const LocationsContext = createContext();

export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [businessLocations, setBusinessLocations] = useState([]);
  const { user } = useAuthProfile();

  const addLocationToCollection = async (uid, locationData) => {
    const locationDocRef = doc(db, "locations", uid);

    try {
      // Check if the document exists
      const locationDoc = await getDoc(locationDocRef);
      incrementReadCount();
      if (!locationDoc.exists()) {
        // If document doesn't exist, create it with an addresses array containing the new location data
        await setDoc(locationDocRef, { addresses: [locationData] });
        incrementWriteCount();
      } else {
        // Document exists, update addresses array
        await updateDoc(locationDocRef, {
          addresses: [
            ...(locationDoc.data().addresses || []), // existing addresses or empty array
            locationData, // new location data
          ],
        });
        incrementWriteCount();
      }
    } catch (error) {
      console.error("Error adding location: ", error);
      throw error; // Propagate the error for handling
    }
  };

  const fetchInitialLocations = async () => {
    if (user) {
      try {
        const locationsCollectionRef = collection(db, "locations");
        const querySnapshot = await getDocs(locationsCollectionRef);
        incrementReadCount();

        const locations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLocations(locations);

        const businessLocations = locations.flatMap((locationDoc) => {
          if (locationDoc.addresses && Array.isArray(locationDoc.addresses)) {
            return locationDoc.addresses.filter(
              (address) => address.locationType === "Business"
            );
          } else {
            return [];
          }
        });

        setBusinessLocations(businessLocations);
      } catch (error) {
        console.error("Error fetching initial business locations: ", error);
        setBusinessLocations([]);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchInitialLocations(); // Perform initial fetch
      const locationsCollectionRef = collection(db, "locations");
      const unsubscribe = onSnapshot(locationsCollectionRef, (snapshot) => {
        incrementReadCount();

        const locations = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLocations(locations);

        const businessLocations = locations.flatMap((locationDoc) => {
          if (locationDoc.addresses && Array.isArray(locationDoc.addresses)) {
            return locationDoc.addresses.filter(
              (address) => address.locationType === "Business"
            );
          } else {
            return [];
          }
        });

        setBusinessLocations(businessLocations);
      }, (error) => {
        console.error("Error listening to business locations: ", error);
        setBusinessLocations([]);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const value = {
    addLocationToCollection,
    businessLocations,
    locations,
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
