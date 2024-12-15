import {
  IonContent,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonPage,
  IonList,
  IonDatetime,
  IonCheckbox,
  IonBadge,
  IonFabButton,
  IonText,
} from "@ionic/react";
import { usePickups } from "../../../../context/PickupsContext";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import dayjs from "dayjs";
import homeIcon from "../../../../assets/icons/home.png";
import {
  calendarNumberOutline,
  closeOutline,
  leafOutline,
  notificationsOutline,
} from "ionicons/icons";
import {
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../../../../firebase";

function RequestPickup({ handleClose }) {
  const { createPickup } = usePickups();
  const { profile, updateProfileData } = useAuthProfile();
  const [profileLocations, setProfileLocations] = useState([]);
  const { userAcceptedPickups, userCreatedPickups, visiblePickups } =
    usePickups();

  const initialFormData = useMemo(
    () => ({
      pickupDateTime: dayjs().toISOString(), // Default to current date and time
      pickupNote: "",
    }),
    [profile]
  );

  const [modalState, setModalState] = useState({
    requestPickupOpen: false,
  });

  const openModal = (modalName) => {
    setModalState((prevState) => ({ ...prevState, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModalState((prevState) => ({ ...prevState, [modalName]: false }));
  };

  const [pickupRequestData, setPickupRequestData] = useState(initialFormData);

  useEffect(() => {
    if (profile?.locations) {
      setProfileLocations(profile.locations);
    }
  }, [profile]);

  const handleChange = useCallback((name, value) => {
    setPickupRequestData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  // Build the pickup data with materials included

  const handleSubmit = async () => {
    try {
      // Query for active pickups of the current user (pickups that are not completed or deleted)
      const pickupsRef = collection(db, "pickups"); // Reference to the "pickups" collection
      const activePickupsQuery = query(
        pickupsRef,
        where("createdBy.userId", "==", profile?.uid),
        where("isCompleted", "==", false)
      );

      const querySnapshot = await getDocs(activePickupsQuery);

      // Restrict to only 2 active pickups at a time
      if (querySnapshot.docs.length >= 2) {
        toast.error("You can only have 2 active pickups at a time.", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      // Proceed to create the new pickup if under the limit
      const selectedAddress = profileLocations.find(
        (address) => address.street === pickupRequestData.address
      );

      if (!selectedAddress) {
        toast.error("Please select a valid address.", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      if (!pickupRequestData.pickupDateTime) {
        toast.error("Please select a valid pickup date and time.", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      // Build the pickup data with materials included
      const pickupData = {
        pickupDate: dayjs(pickupRequestData.pickupDateTime).format(
          "YYYY-MM-DD"
        ),
        pickupTime: dayjs(pickupRequestData.pickupDateTime).format("HH:mm"),
        pickupNote: pickupRequestData.pickupNote || "", // Set default empty note
        addressData: selectedAddress,
        isAccepted: false,
        isCompleted: false,
        materials: { ...materials }, // Include the materials object
        createdBy: {
          displayName: profile?.displayName || "No Name",
          photoURL: profile?.profilePic || "",
          userId: profile?.uid,
          email: profile?.email,
        },
      };

      const newPickupId = await createPickup(pickupData);

      if (newPickupId) {
        await updateProfileData(profile?.uid, {
          pickups: arrayUnion(newPickupId),
        });
        toast.success("Pickup request created successfully!", {
          position: "top-right",
          autoClose: 5000,
        });
        handleClose(); // Close the modal on success
      }
    } catch (error) {
      console.error("Error creating pickup or checking active pickups:", error);
      toast.error("There was an error creating the pickup. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Define available materials
  const [materials, setMaterials] = useState({
    plastic: false,
    glass: false,
    aluminum: false,
  });

  // Handle material selection
  const handleMaterialChange = (material) => {
    setMaterials((prevState) => ({
      ...prevState,
      [material]: !prevState[material],
    }));
  };

  return (


    <main className="flex items-center h-full justify-center container mx-auto max-w-md">
        <ToastContainer
      position="top-right"
      className="top-50"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
        <IonRow>

          <IonCol size="12" className="text-center mx-auto rounded-xl">
            <IonItem color="light" lines="none" className="w-full rounded-full">
              {/* <IonLabel color="secondary" position="stacked" className="w-full">
                    Address
                  </IonLabel> */}
              <IonSelect
                className="ion-align-self-center w-full"
                placeholder="Select your address"
                onIonChange={(e) => handleChange("address", e.detail.value)}
                value={pickupRequestData.address}
              >
                {profileLocations.map((address, index) => (
                  <IonSelectOption key={index} value={address.street}>
                    <div className="flex items-center gap-4">
                      <img className="w-10" src={homeIcon} alt="Home Icon" />
                      {address.street}
                    </div>
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonCol>
          <IonCol size="12">
            <IonSelect
              className="bg-grean rounded-full px-4 w-full"
              label="What are you recycling?"
              placeholder="Material"
              multiple={true}
            >
              <IonSelectOption value="aluminum">Aluminum</IonSelectOption>
              <IonSelectOption value="plastic">Plastic</IonSelectOption>
              <IonSelectOption value="glass">Glass</IonSelectOption>
              <IonSelectOption value="cardboard">Cardboard</IonSelectOption>
              <IonSelectOption value="palets">Palets</IonSelectOption>
              <IonSelectOption value="appliances">Appliances</IonSelectOption>
            </IonSelect>
          </IonCol>

          <IonCol size="12">
            <IonItem lines="none" className="w-full">
              <IonLabel className="mx-auto w-full" position="stacked">
                Pickup Date & Time
              </IonLabel>
              <IonDatetime
                presentation="date-time"
                value={pickupRequestData.pickupDateTime}
                className="mx-auto rounded-lg"
                onIonChange={(e) =>
                  handleChange("pickupDateTime", e.detail.value)
                }
                placeholder="Select Date and Time"
                min={dayjs().toISOString()} // Restrict to future date and time
                minuteValues="0,15,30,45" // Only allow 30-minute intervals
              />
            </IonItem>
          </IonCol>


          <IonCol size="12">
            <IonItem lines="none" className="w-full">
              <IonLabel
                className=" w-full rounded-lg text-center"
                position="float"
              >
                Pickup Notes
              </IonLabel>
              <IonTextarea
                rows={3}
                value={pickupRequestData.pickupNote}
                className="bg-slate-50 rounded-md p-1"
                onIonChange={(e) => handleChange("pickupNote", e.detail.value)}
              />
            </IonItem>
          </IonCol>
          {profile?.accountType === "User" && profile?.locations.length > 0 && (
            <>
              <IonCol size="8" className="ion-align-self-center">
                <IonButton
                  expand="block"
                  color="primary"
                  onClick={handleSubmit}
                  className="drop-shadow-lg"
                >
                  Submit
                </IonButton>
              </IonCol>
              <IonCol size="auto" className="relative">
                <IonFabButton
                  onClick={() => handleClose()}
                  color="light"
                  className="drop-shadow-lg"
                >
                  <IonIcon color="danger" icon={closeOutline} />
                </IonFabButton>
                {/* <IonBadge className="absolute top-0 right-0 bg-red-500 rounded-full aspect-square w-5 p-1 flex items-center justify-center">
                  {profile.pickups.length}
                </IonBadge> */}
              </IonCol>
            </>
          )}

          {profile?.accountType === "Driver" && (
            <>
              <IonCol size="auto" className="relative">
                <IonFabButton
                  onClick={() => openModal("scheduleOpen")}
                  color="tertiary"
                >
                  <IonIcon icon={calendarNumberOutline} />
                </IonFabButton>
                <IonBadge className="absolute top-0 right-0 bg-white text-green rounded-full aspect-square w-5">
                  {
                    userAcceptedPickups.filter((pickup) => !pickup.isCompleted)
                      .length
                  }
                </IonBadge>
              </IonCol>
              <IonCol size="auto" className="relative">
                <IonFabButton
                  onClick={() => openModal("pickupQueueOpen")}
                  color="danger"
                  className="relative"
                >
                  <IonIcon icon={notificationsOutline} />
                </IonFabButton>
                <IonBadge className="absolute top-0 right-0 bg-white text-green rounded-full aspect-square w-5">
                  {visiblePickups.length}
                </IonBadge>
              </IonCol>
            </>
          )}
        </IonRow>
    </main>
  );
}

export default RequestPickup;
