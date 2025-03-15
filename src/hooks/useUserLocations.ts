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
    // console.log("useUserLocations received IDs:", locationIds);
    const fetchLocations = async () => {
      try {
        // Limit to the first 5 location IDs.
        const limitedIds = locationIds.slice(0, 5);
        const promises = limitedIds.map((id) =>
          getDoc(doc(db, "locations", id))
        );
        const results = await Promise.allSettled(promises);
        results.forEach((result, idx) => {
          if (result.status === "fulfilled") {
          } else {
            console.error(
              `Error fetching document ${limitedIds[idx]}:`,
              result.reason
            );
          }
        });
        const data = results
          .filter(
            (result): result is PromiseFulfilledResult<any> =>
              result.status === "fulfilled" && result.value.exists()
          )
          .map((result) => ({
            id: result.value.id,
            ...result.value.data()
          })) as LocationData[];
        // console.log("Fetched location data:", data);
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
      console.log("No location IDs provided.");
      setLocations([]);
      setLoading(false);
    }
  }, [locationIds, locationIds.length]);

  return {locations, loading};
};
