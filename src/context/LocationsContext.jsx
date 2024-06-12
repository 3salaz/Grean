import React, { createContext, useContext, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const LocationContext = createContext();

export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState([]);

  const addLocation = async (uid, location) => {
    const locationsCollectionRef = collection(db, "users", uid, "locations");
    await addDoc(locationsCollectionRef, location);
  };

  const addParentLocation = async (uid, location) => {
    const parentLocationsCollectionRef = collection(db, "locations");
    await addDoc(parentLocationsCollectionRef, { ...location, uid });
  };

  const fetchLocations = async (uid) => {
    const locationsCollectionRef = collection(db, "users", uid, "locations");
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
    addParentLocation,
    fetchLocations,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocations() {
  return useContext(LocationContext);
}
