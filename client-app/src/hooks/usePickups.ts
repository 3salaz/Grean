import {useEffect, useState} from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import {db} from "../firebase";

export interface PickupsData {
  id: string;
  pickupType: string;
  address: string;
  latitude?: number;
  longitude?: number;
  pickupTime: string;
  uid: string;
  status: string; // Assuming status field indicates if a pickup is accepted or completed
}

export const usePickups = (
  pickupIds: string[],
  uid: string,
  isDriver: boolean
) => {
  const [pickups, setPickups] = useState<PickupsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        if (isDriver) {
          // Fetch all unaccepted or uncompleted pickups for drivers
          const q = query(
            collection(db, "pickups"),
            where("status", "in", ["unaccepted", "uncompleted"])
          );
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as PickupsData[];
          setPickups(data);
        } else {
          // Fetch user's profile pickups based on pickup IDs
          const promises = pickupIds.map((id) =>
            getDoc(doc(db, "pickups", id))
          );
          const results = await Promise.allSettled(promises);
          const data = results
            .filter(
              (result): result is PromiseFulfilledResult<any> =>
                result.status === "fulfilled" && result.value.exists()
            )
            .map((result) => ({
              id: result.value.id,
              ...result.value.data()
            })) as PickupsData[];
          setPickups(data.filter((pickup) => pickup.uid === uid));
        }
      } catch (error) {
        console.error("Error fetching pickups:", error);
      } finally {
        setLoading(false);
      }
    };

    if (pickupIds.length || isDriver) {
      fetchPickups();
    } else {
      console.log("No pickup IDs provided or user is not a driver.");
      setPickups([]);
      setLoading(false);
    }
  }, [pickupIds, uid, isDriver]);

  return {pickups, loading};
};
