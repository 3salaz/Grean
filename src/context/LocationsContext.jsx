import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { toast } from "react-toastify"; // Import toast from react-toastify
import { db } from "../firebase";
import { useAuthProfile } from "./AuthProfileContext";

const LocationsContext = createContext();

export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [businessLocations, setBusinessLocations] = useState([]);
  const { user, profile, updateProfileField } = useAuthProfile(); // Access user and profile

  // Add a new location and sync with profile
  const addLocation = async (locationData) => {
    try {
      const locationsCollectionRef = collection(db, "locations");
      const newLocationRef = doc(locationsCollectionRef);

      const newLocation = {
        ...locationData,
        id: newLocationRef.id,
        userId: user.uid,
        timestamp: serverTimestamp(),
      };

      // Add location to Firestore and update profile.locations
      await setDoc(newLocationRef, newLocation);
      await updateProfileField(user.uid, "locations", newLocation, "addToArray");

      toast.success("Location added successfully!");
      return newLocationRef.id;
    } catch (error) {
      console.error("Error adding location: ", error);
      toast.error("Failed to add location. Please try again.");
      throw error;
    }
  };

  // Delete a location and sync with profile
  const deleteLocation = async (locationId) => {
    try {
      const locationRef = doc(db, "locations", locationId);

      // Remove location from Firestore and profile.locations
      await deleteDoc(locationRef);
      await updateProfileField(user.uid, "locations", { id: locationId }, "removeFromArray");

      toast.success("Location deleted successfully!");
    } catch (error) {
      console.error("Error deleting location: ", error);
      toast.error("Failed to delete location. Please try again.");
      throw error;
    }
  };

  // Update a location and ensure consistency
  const updateLocation = async (locationId, updates) => {
    try {
      const locationRef = doc(db, "locations", locationId);

      // Update Firestore location
      await updateDoc(locationRef, updates);

      // Update profile.locations manually (if needed)
      const updatedLocations = profile.locations.map((loc) =>
        loc.id === locationId ? { ...loc, ...updates } : loc
      );

      await updateProfileField(user.uid, "locations", updatedLocations, "update");

      toast.success("Location updated successfully!");
    } catch (error) {
      console.error("Error updating location: ", error);
      toast.error("Failed to update location. Please try again.");
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
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
          console.error("Error listening to locations: ", error);
          toast.error("Failed to fetch locations. Please try again later.");
          setLocations([]);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  const value = {
    locations,
    businessLocations,
    addLocation,
    deleteLocation,
    updateLocation,
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
