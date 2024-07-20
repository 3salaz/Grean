import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDocs, collection, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

const LocationsContext = createContext();

export function LocationsProvider({ children }) {
  const [businessLocations, setBusinessLocations] = useState([]);

  const addLocationToCollection = async (uid, locationData) => {
    const locationDocRef = doc(db, "locations", uid);
    const addressesCollectionRef = collection(locationDocRef, "addresses");
    const newLocationDocRef = doc(addressesCollectionRef); // Generate new document ID

    await setDoc(newLocationDocRef, locationData);
    await fetchBusinessLocations(); // Fetch business locations after adding a new location
  };

  const fetchBusinessLocations = async () => {
    try {
      const locationsCollectionRef = collection(db, "locations");
      const querySnapshot = await getDocs(locationsCollectionRef);
      const allLocations = querySnapshot.docs.map(doc => doc.data());

      const businessLocations = allLocations.flatMap(locationDoc =>
        locationDoc.addresses.filter(address => address.locationType === "Business")
      );
      

      setBusinessLocations(businessLocations);
      return businessLocations;
    } catch (error) {
      console.error("Error fetching business locations: ", error);
      setBusinessLocations([]);
      return [];
    }
  };

  useEffect(() => {
    fetchBusinessLocations();
  }, []);

  const value = {
    businessLocations,
    addLocationToCollection,
    fetchBusinessLocations,
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
