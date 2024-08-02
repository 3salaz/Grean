import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore instance
import { useAuth } from './AuthContext'; // Make sure this is the correct import for your AuthContext

const LocationsContext = createContext();

export const useLocations = () => useContext(LocationsContext);

export const LocationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const querySnapshot = await getDocs(collection(db, 'locations'));
      setLocations(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchLocations();
  }, []);

  const addLocation = async (newLocation) => {
    await addDoc(collection(db, 'locations'), newLocation);
    // Optionally, re-fetch locations here or update the state directly
  };
  
  const updateLocation = async (locationData) => {
    if (user?.uid) {
      const docRef = doc(db, 'locations', locationData.id); // Ensure you have an id for the locationData
  
      // Check if the document exists before deciding between setDoc and updateDoc
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, locationData);
      } else {
        await setDoc(docRef, locationData);
      }
      // Optionally, re-fetch locations here or update the state directly
      setLocations((prevLocations) => prevLocations.map(location => 
        location.id === locationData.id ? { ...location, ...locationData } : location
      ));
    }
  };

  const deleteLocation = async (id) => {
    const locationDoc = doc(db, 'locations', id);
    await deleteDoc(locationDoc);
    // Optionally, re-fetch locations here or update the state directly
    setLocations((prevLocations) => prevLocations.filter(location => location.id !== id));
  };

  const updateProfileLocation = async (profileId, locationData) => {
    if (user?.uid) {
      const profileDocRef = doc(db, 'profiles', profileId); // Adjust according to your Firestore structure
  
      const profileDocSnap = await getDoc(profileDocRef);
      if (profileDocSnap.exists()) {
        const profileData = profileDocSnap.data();
        const updatedAddresses = profileData.addresses.map((address) => 
          address.id === locationData.id ? locationData : address
        );

        await updateDoc(profileDocRef, { addresses: updatedAddresses });
      }
    }
  };

  return (
    <LocationsContext.Provider value={{ locations, addLocation, updateLocation, deleteLocation, updateProfileLocation }}>
      {children}
    </LocationsContext.Provider>
  );
};

