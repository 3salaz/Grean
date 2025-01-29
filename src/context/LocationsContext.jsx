import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { toast } from "react-toastify"; // Import toast from react-toastify
import { db } from "../firebase";
import { useAuthProfile } from "./AuthProfileContext";

const LocationsContext = createContext();

export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [businessLocations, setBusinessLocations] = useState([]);
  const { user, profile, updateProfileField } = useAuthProfile(); // Access user and profile

  // Create a new location and sync with profile
  const createLocation = async (locationData) => {
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

      // Add the location ID to the user's profile
      await updateProfileField(user.uid, "locations", newLocationRef.id, "addToArray");

      toast.success("Location created successfully!");
      return newLocationRef.id;
    } catch (error) {
      console.error("Error creating location: ", error);
      toast.error("Failed to create location. Please try again.");
      throw error;
    }
  };

  // Delete a location and sync with profile
  const deleteLocation = async (locationId) => {
    try {
      const locationRef = doc(db, "locations", locationId);

      // Remove location from Firestore and profile.locations
      await deleteDoc(locationRef);
      await updateProfileField(user.uid, "locations", locationId, "removeFromArray");

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
    createLocation, // Renamed from addLocation
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
