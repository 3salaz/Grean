import {createContext, useContext, useState, ReactNode} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {useAuth} from "./AuthContext";

// Define types for location
interface Location {
  id?: string;
  locationType: string;
  address: string; // full address stored here
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
  updateLocation: (
    locationId: string,
    updates: Partial<Location>
  ) => Promise<void>;
}

// Create Context
const LocationsContext = createContext<LocationContextType | null>(null);

export function LocationsProvider({children}: {children: ReactNode}) {
  const {user} = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [businessLocations, setBusinessLocations] = useState<Location[]>([]); // Added state for business locations

  const createLocation = async (
    locationData: Location
  ): Promise<string | undefined> => {
    try {
      console.log("🚀 Creating location with data:", locationData);
      const token = await user.getIdToken(); // Assuming `user` is available in the context
      const response = await axios.post(
        "https://us-central1-grean-de04f.cloudfunctions.net/api/createLocationFunction",
        locationData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("✅ Location created successfully:", response.data);

      if (
        response.data &&
        typeof response.data === "object" &&
        "locationId" in response.data
      ) {
        toast.success("Location created successfully!");
        return response.data.locationId as string;
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (error) {
      console.error("❌ Error creating location:", error);
      toast.error("Failed to create location.");
    }
  };

  const deleteLocation = async (locationId: string): Promise<void> => {
    try {
      await axios.post(
        "https://us-central1-grean-de04f.cloudfunctions.net/api/deleteLocationFunction",
        {locationId}
      );
      toast.success("Location deleted successfully!");
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location.");
    }
  };

  const updateLocation = async (
    locationId: string,
    updates: Partial<Location>
  ): Promise<void> => {
    try {
      await axios.post(
        "https://us-central1-grean-de04f.cloudfunctions.net/api/updateLocation",
        {locationId, updates}
      );
      toast.success("Location updated successfully!");
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location.");
    }
  };

  return (
    <LocationsContext.Provider
      value={{
        locations,
        businessLocations,
        createLocation,
        deleteLocation,
        updateLocation
      }}
    >
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
