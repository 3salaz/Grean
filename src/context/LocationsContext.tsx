import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";

// Define types for location
export interface Location {
  id?: string;
  locationType: string;
  address: string;
  latitude?: number;
  longitude?: number;
  homeName?: string;
  businessName?: string;
  businessPhoneNumber?: string;
  businessBio?: string;
  businessLogo?: string,
  category?: string;
}

export interface LocationContextType {
  locations: Location[];
  businessLocations: Location[];
  profileLocations: Location[];
  currentLocation: Location | null;
  setCurrentLocation: (location: Location | null) => void;
  createLocation: (locationData: Location) => Promise<string | undefined>;
  deleteLocation: (locationId: string) => Promise<void>;
  updateLocation: (locationId: string, updates: Partial<Location>) => Promise<void>;
  loading: boolean;
}

// Create Context
const LocationsContext = createContext<LocationContextType | null>(null);

export function LocationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [businessLocations, setBusinessLocations] = useState<Location[]>([]);
  const [profileLocations, setProfileLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const businessQuery = query(
      collection(db, "locations"),
      where("locationType", "==", "Business")
    );

    const unsubscribeBusiness = onSnapshot(businessQuery, (snapshot) => {
      const businessLocations: Location[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Location)
      }));
      setBusinessLocations(businessLocations);
      setLoading(false);
    });

    const fetchProfileLocations = async () => {
      try {
        const userProfileRef = doc(db, "profiles", user.uid);
        const userProfileSnap = await getDoc(userProfileRef);

        if (!userProfileSnap.exists()) {
          console.warn("User profile not found");
          setProfileLocations([]);
          return;
        }

        const userLocationIds: string[] = userProfileSnap.data().locations || [];

        if (userLocationIds.length > 0) {
          const locationPromises = userLocationIds.map(async (locationId) => {
            const locationRef = doc(db, "locations", locationId);
            const locationSnap = await getDoc(locationRef);
            return locationSnap.exists()
              ? { id: locationSnap.id, ...(locationSnap.data() as Location) }
              : null;
          });

          const resolvedUserLocations: Location[] = (await Promise.all(locationPromises)).filter(
            Boolean
          ) as Location[];

          setProfileLocations(resolvedUserLocations);
          setLocations(resolvedUserLocations);

          // ✅ Set default active location if not already set
          if (!currentLocation && resolvedUserLocations.length > 0) {
            setCurrentLocation(resolvedUserLocations[0]);
          }
        } else {
          setProfileLocations([]);
          setLocations([]);
          setCurrentLocation(null); // Clear if no locations
        }
      } catch (error) {
        console.error("Error fetching user locations:", error);
      }
    };

    fetchProfileLocations();

    return () => {
      unsubscribeBusiness();
    };
  }, [user]);

  const createLocation = async (locationData: Location): Promise<string | undefined> => {
    try {
      console.log("🚀 Creating location with data:", locationData);
      const token = await user.getIdToken();
      const response = await axios.post(
        "https://us-central1-grean-de04f.cloudfunctions.net/api/createLocationFunction",
        locationData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data && typeof response.data === "object" && "locationId" in response.data) {
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
        { locationId }
      );
      toast.success("Location deleted successfully!");
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location.");
    }
  };

  const updateLocation = async (locationId: string, updates: Partial<Location>): Promise<void> => {
    try {
      await axios.post("https://us-central1-grean-de04f.cloudfunctions.net/api/updateLocationFunction", {
        locationId,
        updates
      });
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
        profileLocations,
        currentLocation,
        setCurrentLocation,
        createLocation,
        deleteLocation,
        updateLocation,
        loading
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
