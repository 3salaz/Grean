import { createContext, useContext, useState } from "react";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const LocationsContext = createContext();

export function LocationsProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [businessLocations, setBusinessLocations] = useState([]);
  const [userLocations, setuserLocations] = useState([])

  const createLocation = async (uid) => {
    console.log(`Creating location for user with UID: ${uid}`);
    const locationDocRef = doc(db, "locations", uid); // Set the document ID to the user's UID
    const initialLocationData = {
      uid: uid,
      addresses: [],
    };
    await setDoc(locationDocRef, initialLocationData);
  };

  const getUserLocation = async (uid) => {
    try {
      const locationsCollectionRef = collection(db, "locations");
      const q = query(locationsCollectionRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const userAddresses = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.addresses && Array.isArray(data.addresses)) {
          userAddresses.push(...data.addresses);
        }
      });

      return userAddresses;
    } catch (error) {
      console.error("Error fetching user addresses: ", error);
      return [];
    }
  };


  const addLocation = async (uid, locationData) => {
    console.log(`Adding location to user with UID: ${uid}`);
    const locationDocRef = doc(db, "locations", uid);
  
    // Check if the document exists
    const docSnap = await getDoc(locationDocRef);
  
    if (docSnap.exists()) {
      // If the document exists, update it
      await updateDoc(locationDocRef, {
        addresses: arrayUnion(locationData),
      });
    } else {
      // If the document does not exist, create it with the initial location data
      await setDoc(locationDocRef, {
        uid: uid,
        addresses: [locationData],
      });
    }
  };

  const fetchLocations = async (uid) => {
    const locationsCollectionRef = collection(db, "locations");
    const q = query(locationsCollectionRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const locationsData = [];
    querySnapshot.forEach((doc) => {
      locationsData.push(doc.data());
    });
    setLocations(locationsData);
  };

  const getUserAddresses = async (uid) => {
    try {
      const locationsCollectionRef = collection(db, "locations");
      const q = query(locationsCollectionRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const userAddresses = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.addresses && Array.isArray(data.addresses)) {
          userAddresses.push(...data.addresses);
        }
      });

      return userAddresses;
    } catch (error) {
      console.error("Error fetching user addresses: ", error);
      return [];
    }
  };

  const fetchBusinessLocations = async () => {
    try {
      const locationsCollectionRef = collection(db, "locations");
      const querySnapshot = await getDocs(locationsCollectionRef);
      const businessLocationsData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.addresses && Array.isArray(data.addresses)) {
          const businessAddresses = data.addresses.filter(
            (address) => address.locationType === "Business"
          );
          businessLocationsData.push(...businessAddresses);
        }
      });

      setBusinessLocations(businessLocationsData);
      // businessLocationsData.forEach(location => console.log(`Location: ${JSON.stringify(location)}`));
    } catch (error) {
      console.error("Error fetching business locations: ", error);
    }
  };

  const value = {
    locations,
    businessLocations,
    addLocation,
    createLocation,
    fetchLocations,
    fetchBusinessLocations,
    getUserAddresses,
    
  };

  return (
    
    <LocationsContext.Provider value={value}>
      {children}
    </LocationsContext.Provider>
  );
}

export function useLocations() {
  return useContext(LocationsContext);
}
