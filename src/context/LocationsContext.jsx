import { createContext, useContext, useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase"; // Import Firebase functions
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const LocationsContext = createContext();

export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const { user } = useAuth();

  const createLocation = async (locationData) => {
    try {
      const createLocationFn = httpsCallable(functions, "createLocation");
      const response = await createLocationFn(locationData);
      toast.success("Location created successfully!");
      return response.data.locationId;
    } catch (error) {
      console.error("Error creating location: ", error);
      toast.error("Failed to create location.");
    }
  };

  const deleteLocation = async (locationId) => {
    try {
      const deleteLocationFn = httpsCallable(functions, "deleteLocation");
      await deleteLocationFn({ locationId });
      toast.success("Location deleted successfully!");
    } catch (error) {
      console.error("Error deleting location: ", error);
      toast.error("Failed to delete location.");
    }
  };

  const updateLocation = async (locationId, updates) => {
    try {
      const updateLocationFn = httpsCallable(functions, "updateLocation");
      await updateLocationFn({ locationId, updates });
      toast.success("Location updated successfully!");
    } catch (error) {
      console.error("Error updating location: ", error);
      toast.error("Failed to update location.");
    }
  };

  const value = {
    locations,
    createLocation,
    deleteLocation,
    updateLocation,
  };

  return <LocationsContext.Provider value={value}>{children}</LocationsContext.Provider>;
}

export function useLocations() {
  return useContext(LocationsContext);
}
