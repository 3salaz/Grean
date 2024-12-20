import { createContext, useContext, useEffect, useState } from "react";
import {
  doc,
  getDocs,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
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
      const docRef = await addDoc(locationsCollectionRef, {
        ...locationData,
        userId: uid,
        timestamp: serverTimestamp(),
      });
      console.log("Location successfully added with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding location to the collection: ", error);
      throw error;
    }
  };

  const fetchInitialLocations = async () => {
    if (user) {
      try {
        const locationsCollectionRef = collection(db, "locations");
        const querySnapshot = await getDocs(locationsCollectionRef);

        const fetchedLocations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLocations(fetchedLocations);

        const filteredBusinessLocations = fetchedLocations.filter(
          (location) => location.locationType === "Business"
        );

        setBusinessLocations(filteredBusinessLocations);
      } catch (error) {
        console.error("Error fetching initial business locations: ", error);
        setBusinessLocations([]);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchInitialLocations();

      const locationsCollectionRef = collection(db, "locations");
      const unsubscribe = onSnapshot(
        locationsCollectionRef,
        (snapshot) => {
          const fetchedLocations = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setLocations(fetchedLocations);

          const filteredBusinessLocations = fetchedLocations.filter(
            (location) => location.locationType === "Business"
          );

          setBusinessLocations(filteredBusinessLocations);
        },
        (error) => {
          console.error("Error listening to business locations: ", error);
          setBusinessLocations([]);
        }
      );

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

