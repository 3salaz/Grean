import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

// Define types for location
interface Location {
  id?: string;
  locationType: string;
  street: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  homeName?: string;
  businessName?: string;
  businessPhoneNumber?: string;
  category?: string;
}

interface LocationContextType {
  locations: Location[];
  businessLocations: Location[]; // Added business locations
  createLocation: (locationData: Location) => Promise<string | undefined>;
  deleteLocation: (locationId: string) => Promise<void>;
  updateLocation: (locationId: string, updates: Partial<Location>) => Promise<void>;
}

// Create Context
const LocationsContext = createContext<LocationContextType | null>(null);

export function LocationsProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [businessLocations, setBusinessLocations] = useState<Location[]>([]); // Added state for business locations
  const { user } = useAuth();

  const createLocation = async (locationData: Location): Promise<string | undefined> => {
    try {
      const createLocationFn = httpsCallable(functions, "createLocation");
      const response = await createLocationFn(locationData);

      if (response.data && typeof response.data === "object" && "locationId" in response.data) {
        toast.success("Location created successfully!");
        return response.data.locationId as string;
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (error) {
      console.error("Error creating location:", error);
      toast.error("Failed to create location.");
    }
  };

  const deleteLocation = async (locationId: string): Promise<void> => {
    try {
      const deleteLocationFn = httpsCallable(functions, "deleteLocation");
      await deleteLocationFn({ locationId });
      toast.success("Location deleted successfully!");
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location.");
    }
  };

  const updateLocation = async (locationId: string, updates: Partial<Location>): Promise<void> => {
    try {
      const updateLocationFn = httpsCallable(functions, "updateLocation");
      await updateLocationFn({ locationId, updates });
      toast.success("Location updated successfully!");
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location.");
    }
  };

  return (
    <LocationsContext.Provider value={{ locations, businessLocations, createLocation, deleteLocation, updateLocation }}>
      {children}
    </LocationsContext.Provider>
  );
}

export function useLocations() {
  const context = useContext(LocationsContext);
  if (!context) {
    throw new Error("useLocations must be used within a LocationsProvider");
  }
  return context;
}
