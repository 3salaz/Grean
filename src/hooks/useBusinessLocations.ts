import {useState, useEffect} from "react";
import {query, collection, where, getDocs} from "firebase/firestore";
import {db} from "../firebase";

export interface BusinessLocationData {
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

export const useBusinessLocations = () => {
  const [locations, setLocations] = useState<BusinessLocationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const q = query(
          collection(db, "locations"),
          where("locationType", "==", "Business")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as BusinessLocationData[];
        setLocations(data);
      } catch (error) {
        console.error("Error fetching business locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return {locations, loading};
};
