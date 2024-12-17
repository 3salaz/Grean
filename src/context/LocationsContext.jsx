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
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuthProfile } from "./AuthProfileContext";

const LocationsContext = createContext();

export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [businessLocations, setBusinessLocations] = useState([]);
  const { user } = useAuthProfile();

  const addLocationToCollection = async (uid, locationData) => {
    const locationsCollectionRef = collection(db, "locations");
  
    try {
      // Add a new document to the locations collection
      await addDoc(locationsCollectionRef, {
        ...locationData,
        userId: uid, // Link the location to the user ID
        timestamp: serverTimestamp(), // Optional: add a timestamp
      });
  
      console.log("Location successfully added to the locations collection!");
    } catch (error) {
      console.error("Error adding location to the collection: ", error);
      throw error; // Propagate the error for handling
    }
  };

  const fetchInitialLocations = async () => {
    if (user) {
      try {
        const locationsCollectionRef = collection(db, "locations");
        const querySnapshot = await getDocs(locationsCollectionRef);

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
