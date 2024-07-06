import React, { createContext, useContext, useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const LocationsContext = createContext();

export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState([]);

  const addLocation = async (uid, locationData) => {
    const locationsCollectionRef = collection(db, "locations");
    await addDoc(locationsCollectionRef, { uid, ...locationData });
  };

  const fetchLocations = async (uid) => {
    const locationsCollectionRef = collection(db, "locations");
    const q = query(locationsCollectionRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const locationsData = [];
    querySnapshot.forEach((doc) => {
      locationsData.push(doc.data());
    });
    setLocations(locationsData);
  };

  const value = {
    locations,
    addLocation,
    fetchLocations,
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
