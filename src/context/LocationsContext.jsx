// src/context/LocationsContext.js
import { createContext, useContext, useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  setDoc,
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

      await fetchLocations(); // Fetch business locations after adding a new location
    } catch (error) {
      console.error("Error adding location: ", error);
      throw error; // Propagate the error for handling
    }
  };

  const fetchLocations = async () => {
    if (user) {
      try {
        // 1. Get a reference to the 'locations' collection in Firestore
        const locationsCollectionRef = collection(db, "locations");

        // 2. Fetch all documents (locations) from the 'locations' collection
        const querySnapshot = await getDocs(locationsCollectionRef);
        incrementReadCount();

        // 3. Map through the documents and extract id and data from each document
        const locations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLocations(locations);

        // 4. Flatten the array of all locations and filter for 'Business' addresses
        const businessLocations = locations.flatMap((locationDoc) => {
          // Check if addresses array exists and is not empty
          if (locationDoc.addresses && Array.isArray(locationDoc.addresses)) {
            return locationDoc.addresses.filter(
              (address) => address.locationType === "Business"
            );
          } else {
            return []; // Return an empty array if addresses is undefined or not an array
          }
        });
        // 5. Set the state with the filtered business locations
        setBusinessLocations(businessLocations);
      } catch (error) {
        // Handle errors if any occur during the fetch operation
        console.error("Error fetching business locations: ", error);
        setBusinessLocations([]); // Set business locations to an empty array on error
      }
    }
  };

  const value = {
    addLocationToCollection,
    fetchLocations,
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
