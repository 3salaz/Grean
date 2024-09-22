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
} from "@ionic/react";
import { usePickups } from "../../../../context/PickupsContext";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import dayjs from "dayjs";
import homeIcon from "../../../../assets/icons/home.png";
import { closeOutline } from "ionicons/icons";
import { arrayUnion } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";

function RequestPickup({ handleClose }) {
  const { createPickup } = usePickups();
  const { profile, updateProfileData } = useAuthProfile();
  const [profileLocations, setProfileLocations] = useState([]);

  const initialFormData = useMemo(
    () => ({
      pickupDateTime: dayjs().toISOString(), // Default to current date and time
      pickupNote: "",
    }),
    [profile]
  );

  const [pickupRequestData, setPickupRequestData] = useState(initialFormData);

  useEffect(() => {
    if (profile?.addresses) {
      setProfileLocations(profile.addresses);
    }
  }, [profile]);

  const handleChange = useCallback((name, value) => {
    setPickupRequestData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async () => {
    // Check if the user has selected an address
    console.log("buttonClicked");
    const selectedAddress = profileLocations.find(
      (address) => address.street === pickupRequestData.address
    );
  
    if (!selectedAddress) {
      console.error("Selected address not found or not chosen.");
      alert("Please select a valid address.");
      return;
    }
  
    // Check if the date and time are provided
    if (!pickupRequestData.pickupDateTime) {
      console.error("Pickup date and time are required.");
      alert("Please select a valid pickup date and time.");
      return;
    }
  
    const pickupData = {
      pickupDate: dayjs(pickupRequestData.pickupDateTime).format("YYYY-MM-DD"),
      pickupTime: dayjs(pickupRequestData.pickupDateTime).format("HH:mm"),
      pickupNote: pickupRequestData.pickupNote || "",  // Set default empty note
      addressData: selectedAddress,
      isAccepted: false,
      isCompleted: false,
      createdBy: {
        displayName: profile?.displayName || "No Name",
        photoURL: profile?.profilePic || "",
        userId: profile?.uid,
        email: profile?.email,
      },
    };
  
    try {
      const newPickupId = await createPickup(pickupData);
  
      if (newPickupId) {
        await updateProfileData(profile?.uid, {
          pickups: arrayUnion(newPickupId),
        });
        alert("Pickup request created successfully!");
        handleClose();
      }
    } catch (error) {
      console.error("Error creating pickup or updating profile:", error);
      alert("There was an error creating the pickup. Please try again.");
    }
  };
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Request Pickup</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-no-padding" color="light">
        <IonGrid className="h-full flex flex-col items-center justify-center">
          <IonRow className="flex-grow bg-white w-full">
            <IonCol size="12" className="ion-align-self-center">
              <IonList className="flex flex-col gap-2 h-full justify-between items-center w-full p-2">
                <IonItem className="mx-auto text-center">
                  <IonLabel color="dark" position="stacked" className="w-full">
                    Address
                  </IonLabel>
                  <IonSelect
                    className="mx-auto"
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

                {/* Single IonDatetime for both Date and Time */}
                <IonItem className="w-full">
                  <IonLabel position="stacked">Pickup Date & Time</IonLabel>
                  <IonDatetime
                    presentation="date-time" // Show both date and time
                    value={pickupRequestData.pickupDateTime}
                    onIonChange={(e) => handleChange("pickupDateTime", e.detail.value)}
                    placeholder="Select Date and Time"
                  />
                </IonItem>

                <IonItem className="w-full">
                  <IonLabel position="stacked">Pickup Notes</IonLabel>
                  <IonTextarea
                    rows={5}
                    value={pickupRequestData.pickupNote}
                    className="bg-slate-100 mt-2 pl-2 rounded-sm"
                    onIonChange={(e) =>
                      handleChange("pickupNote", e.detail.value)
                    }
                  />
                </IonItem>
              </IonList>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12" className="flex justify-center items-center w-full gap-2">
              {/* Trigger handleSubmit on button click */}
              <IonButton color="primary" onClick={handleSubmit}>
                Submit
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonFooter>
        <IonToolbar color="primary">
          <IonRow className="ion-justify-content-center">
            <IonCol size="auto" className="ion-no-padding">
              <IonButton
                color="danger"
                shape="round"
                size="large"
                fill="solid"
                onClick={handleClose}
              >
                <IonIcon slot="icon-only" icon={closeOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonFooter>

    </IonPage>
  );
}

export default RequestPickup;

