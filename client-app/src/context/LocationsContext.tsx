// src/context/LocationContext.tsx

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Location } from "@shared/types/location"; // ✅ Shared Location type

export interface LocationContextType {
  locations: Location[];
  businessLocations: Location[];
  profileLocations: Location[];
  currentLocation: Location | null;
  setCurrentLocation: (location: Location | null) => void;
  createLocationReq: (locationData: Location) => Promise<string | undefined>;
  deleteLocationReq: (locationId: string) => Promise<void>;
  updateLocationReq: (
    locationId: string,
    updates: Partial<Location>
  ) => Promise<void>;
  loading: boolean;
}

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
        ...(doc.data() as Location),
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

          const resolvedUserLocations: Location[] = (
            await Promise.all(locationPromises)
          ).filter(Boolean) as Location[];

          setProfileLocations(resolvedUserLocations);
          setLocations(resolvedUserLocations);

          if (!currentLocation && resolvedUserLocations.length > 0) {
            setCurrentLocation(resolvedUserLocations[0]);
          }
        } else {
          setProfileLocations([]);
          setLocations([]);
          setCurrentLocation(null);
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

  // 🔁 Renamed API Request Functions

  const createLocationReq = async (
    locationData: Location
  ): Promise<string | undefined> => {
    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        "https://us-central1-grean-de04f.cloudfunctions.net/api/location/create",
        locationData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.locationId) {
        return response.data.locationId;
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (error) {
      console.error("❌ Error creating location:", error);
      toast.error("Failed to create location.");
    }
  };

  const deleteLocationReq = async (locationId: string): Promise<void> => {
    try {
      const token = await user.getIdToken();
      await axios.post(
        "https://us-central1-grean-de04f.cloudfunctions.net/api/location/delete",
        { locationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Location deleted successfully!");
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location.");
    }
  };

  const updateLocationReq = async (
    locationId: string,
    updates: Partial<Location>
  ): Promise<void> => {
    try {
      const token = await user.getIdToken();
      await axios.post(
        "https://us-central1-grean-de04f.cloudfunctions.net/api/location/update",
        { locationId, updates },
        { headers: { Authorization: `Bearer ${token}` } }
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
        profileLocations,
        currentLocation,
        setCurrentLocation,
        createLocationReq,
        deleteLocationReq,
        updateLocationReq,
        loading,
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
