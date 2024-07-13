import { createContext, useContext, useState, useEffect } from "react";
import { collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc, deleteDoc, getDoc, GeoPoint } from "firebase/firestore";
import { db } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useLocations } from "./LocationsContext";
import { useAuthProfile } from "./AuthProfileContext";

const PickupContext = createContext();


export const usePickups = () => useContext(PickupContext);

export const PickupsProvider = ({ children }) => {
  const [pickups, setPickups] = useState([]);
  const [userAcceptedPickups, setUserAcceptedPickups] = useState([]);
  const [allAcceptedPickups, setAllAcceptedPickups] = useState([]);
  const [visiblePickups, setVisiblePickups] = useState([]);
  const [completedPickups, setCompletedPickups] = useState([]);
  const [userCreatedPickups, setUserCreatedPickups] = useState([]);
  const { user } = useAuthProfile();

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, "pickups"), (querySnapshot) => {
        const allPickups = [];
        const currentUserPickups = [];
        const currentUserAccepted = [];
        const allAccepted = [];
        const createdPickups = [];
        const currentCompleted = [];

        querySnapshot.forEach((doc) => {
          const pickup = { id: doc.id, ...doc.data() };
          allPickups.push(pickup);

          if (pickup.createdBy === user.uid) {
            currentUserPickups.push(pickup);
            createdPickups.push(pickup);

            if (pickup.isAccepted && !pickup.isComplete) {
              currentUserAccepted.push(pickup);
            }

            if (pickup.isComplete) {
              currentCompleted.push(pickup);
            }
          }

          if (pickup.isAccepted) {
            allAccepted.push(pickup);
            if (pickup.acceptedBy === user.uid) {
              currentUserAccepted.push(pickup);
            }
          }
        });

        setPickups(allPickups);
        setUserCreatedPickups(currentUserPickups);
        setUserAcceptedPickups(currentUserAccepted);
        setAllAcceptedPickups(allAccepted);
        setCompletedPickups(currentCompleted);

        const filteredVisiblePickups = allPickups.filter((pickup) => !pickup.isAccepted);
        setVisiblePickups(filteredVisiblePickups);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const createPickup = async (pickupData) => {
    const newPickupId = uuidv4();
    const newPickup = {
      ...pickupData,
      id: newPickupId,
      createdAt: serverTimestamp(),
      isAccepted: false,
      isCompleted: false,
      createdBy: user.uid,
    };
  
    try {
      // Check if there is a file to upload
      if (pickupData.applianceImage) {
        const storage = getStorage();
        const storageRef = ref(storage, `pickups/${newPickupId}/applianceImage`);
  
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, pickupData.applianceImage);
        const downloadURL = await getDownloadURL(snapshot.ref);
  
        // Update newPickup with the download URL
        newPickup.applianceImage = downloadURL;
      }
  
      // Remove the applianceImage file object from pickupData if it exists
      delete newPickup.applianceImage;
  
      await setDoc(doc(db, "pickups", newPickupId), newPickup);
      toast.success("Pickup added successfully!");
    } catch (error) {
      console.error("Error adding pickup:", error);
      toast.error("Error adding pickup. Please try again.");
    }
  };

  const requestPickup = async (formData, handleClose) => {
    console.log("Form Data on Submit:", formData);
  
    if (!user?.uid) {
      toast.error("User is not authenticated.");
      return;
    }
  
    try {
      const locationDocRef = doc(db, "locations", user.uid);
      const locationSnapshot = await getDoc(locationDocRef);
  
      if (!locationSnapshot.exists()) {
        toast.error("Location data not found for the user.");
        return;
      }
  
      const locationData = locationSnapshot.data();
      if (!locationData.lat || !locationData.lng) {
        toast.error("Latitude and Longitude are required in location data.");
        return;
      }
  
      const pickupData = {
        ...formData,
        lat: locationData.lat,
        lng: locationData.lng,
        createdBy: user.uid,
        applianceImage: formData.applianceImage, // Ensure this field is passed if needed
      };
  
      await createPickup(pickupData);
  
      handleClose();
    } catch (error) {
      console.error("Error creating pickup:", error);
      toast.error("Failed to create pickup.");
    }
  };
  


  const acceptPickup = async (pickupId) => {
    if (!user) {
      toast.error("You must be logged in to accept pickups.");
      return;
    }

    const pickupRef = doc(db, "pickups", pickupId);
    try {
      await updateDoc(pickupRef, {
        isAccepted: true,
        acceptedBy: user.uid
      });

      setPickups((pickups) =>
        pickups.filter((pickup) => pickup.id !== pickupId)
      );
      toast.success("Pickup accepted successfully!");
    } catch (error) {
      console.error("Error accepting pickup: ", error);
      toast.error("Error accepting pickup. Please try again.");
    }
  };

  const deletePickup = async (pickupId) => {
    if (!user) {
      toast.error("You must be logged in to delete pickups.");
      return;
    }

    const pickupRef = doc(db, "pickups", pickupId);
    const pickupSnapshot = await getDoc(pickupRef);

    if (!pickupSnapshot.exists()) {
      toast.error("Pickup does not exist.");
      return;
    }

    const pickupData = pickupSnapshot.data();
    if (pickupData.createdBy !== user.uid) {
      toast.error("You are not authorized to delete this pickup.");
      return;
    }

    try {
      await deleteDoc(pickupRef);
      setPickups((currentPickups) =>
        currentPickups.filter((pickup) => pickup.id !== pickupId)
      );
      toast.success("Pickup deleted successfully!");
    } catch (error) {
      console.error("Error deleting pickup: ", error);
      toast.error("Error deleting pickup. Please try again.");
    }
  };

  const completePickup = async (pickupId, weight) => {
    if (!user) {
      toast.error("You must be logged in to complete pickups.");
      return;
    }
    try {
      const pickupRef = doc(db, "pickups", pickupId);
      await updateDoc(pickupRef, {
        isCompleted: true,
        ...(weight && { weight: weight }),
      });

      const completedPickup = userAcceptedPickups.find(pickup => pickup.id === pickupId);
      if (completedPickup) {
        setUserAcceptedPickups(prev => prev.filter(pickup => pickup.id !== pickupId));
        setCompletedPickups(prev => [...prev, { ...completedPickup, isCompleted: true }]);
      }

      toast.success("Pickup completed successfully!");
    } catch (error) {
      console.error("Error completing pickup:", error);
      toast.error("Error completing pickup. Please try again.");
    }
  };

  const removePickup = async (pickupId) => {
    try {
      await deleteDoc(doc(db, "pickups", pickupId));
      setUserCreatedPickups((prevPickups) => prevPickups.filter((pickup) => pickup.id !== pickupId));
      toast.success("Pickup removed successfully!");
    } catch (error) {
      console.error("Error removing pickup:", error);
      toast.error("Error removing pickup. Please try again.");
    }
  };

  return (
    <PickupContext.Provider
      value={{
        createPickup,
        requestPickup,
        pickups,
        visiblePickups,
        userAcceptedPickups,
        allAcceptedPickups,
        completedPickups,
        userCreatedPickups,
        acceptPickup,
        deletePickup,
        completePickup,
        removePickup,
      }}
    >
      {children}
    </PickupContext.Provider>
  );
};