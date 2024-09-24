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
} from "@ionic/react";
import { usePickups } from "../../../../context/PickupsContext";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import dayjs from "dayjs";
import homeIcon from "../../../../assets/icons/home.png";
import { closeOutline } from "ionicons/icons";
import { arrayUnion } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

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
      toast.error("Please select a valid address.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    // Check if the date and time are provided
    if (!pickupRequestData.pickupDateTime) {
      toast.error("Please select a valid pickup date and time.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    // Build the pickup data with materials included
    const pickupData = {
      pickupDate: dayjs(pickupRequestData.pickupDateTime).format("YYYY-MM-DD"),
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

    try {
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
      console.error("Error creating pickup or updating profile:", error);
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
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Request Pickup</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-no-padding" color="light">
        <IonGrid className="h-full">
          <IonRow className="flex-grow bg-white w-full">
            <IonCol size="12" className="ion-align-self-center">
              <IonList className="h-full justify-between items-center w-full p-2">
                <IonItem
                  color="light"
                  lines="none"
                  className="w-full rounded-lg"
                >
                  {/* <IonLabel color="secondary" position="stacked" className="w-full">
                    Address
                  </IonLabel> */}
                  <IonSelect
                    className="ion-align-self-center"
                    placeholder="Select your address"
                    onIonChange={(e) => handleChange("address", e.detail.value)}
                    value={pickupRequestData.address}
                  >
                    {profileLocations.map((address, index) => (
                      <IonSelectOption key={index} value={address.street}>
                        <div className="flex items-center gap-4">
                          <img
                            className="w-10"
                            src={homeIcon}
                            alt="Home Icon"
                          />
                          {address.street}
                        </div>
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>

                {/* Single IonDatetime for both Date and Time */}
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

                <IonItem lines="none" className="w-full p-0 m-0">
                  <IonLabel
                    className=" w-full rounded-lg text-center"
                    position="stacked"
                  >
                    Type of material
                  </IonLabel>
                  <IonList className="flex flex-wrap w-full">
                    {Object.keys(materials).map((material, index) => (
                      <IonItem
                        className="bg-orange basis-1/2 sm:basis-1/4"
                        key={index}
                      >
                        <IonLabel>
                          {material.charAt(0).toUpperCase() + material.slice(1)}
                        </IonLabel>
                        <IonCheckbox
                          slot="start"
                          labelPlacement="stacked"
                          alignment="center"
                          checked={materials[material]}
                          onIonChange={() => handleMaterialChange(material)}
                        />
                      </IonItem>
                    ))}
                  </IonList>
                </IonItem>

                <IonItem lines="none" className="w-full">
                  <IonLabel className=" w-full rounded-lg text-center" position="stacked">Pickup Notes</IonLabel>
                  <IonTextarea
                    rows={3}
                    value={pickupRequestData.pickupNote}
                    className="bg-slate-50 rounded-md p-2"
                    onIonChange={(e) =>
                      handleChange("pickupNote", e.detail.value)
                    }
                  />
                </IonItem>
              </IonList>
            </IonCol>
            <IonCol
              size="12"
              className="flex justify-center items-center w-full gap-2"
            >
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
          <IonRow className="ion-justify-content-center p-0 m-0">
            <IonCol size="auto" className="p-0 m-0">
              <IonButton color="danger" shape="round" size="large" fill="solid" onClick={handleClose}>
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
