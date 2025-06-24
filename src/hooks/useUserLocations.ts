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
    if (locationIds.length === 0) {
      setLocations([]);
      setLoading(false);
      return;
    }
  
    const fetchLocations = async () => {
      try {
        const limitedIds = locationIds.slice(0, 5);
        const promises = limitedIds.map((id) =>
          getDoc(doc(db, "locations", id))
        );
        const results = await Promise.allSettled(promises);
  
        results.forEach((result, idx) => {
          if (result.status !== "fulfilled") {
            console.error(`Error fetching document ${limitedIds[idx]}:`, result.reason);
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
  
        setLocations(data);
      } catch (error) {
        console.error("Error fetching user locations:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLocations();
  }, [JSON.stringify(locationIds)]);
  

  return {locations, loading};
};
