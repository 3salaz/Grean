import {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase";

export interface LocationData {
  id: string;
  locationType: string;
  address: string;
  latitude?: number;
  longitude?: number;
  homeName?: string;
  businessName?: string;
  businessPhoneNumber?: string;
  category?: string;
  uid: string;
}

export const useUserLocations = (locationIds: string[]) => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Limit to the first 5 location IDs.
        const limitedIds = locationIds.slice(0, 5);
        const promises = limitedIds.map((id) =>
          getDoc(doc(db, "locations", id))
        );
        const docs = await Promise.all(promises);
        const data = docs
          .filter((docSnap) => docSnap.exists())
          .map(
            (docSnap) => ({id: docSnap.id, ...docSnap.data()} as LocationData)
          );
        setLocations(data);
      } catch (error) {
        console.error("Error fetching user locations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (locationIds.length) {
      fetchLocations();
    } else {
      setLocations([]);
      setLoading(false);
    }
  }, [locationIds]);

  return {locations, loading};
};
