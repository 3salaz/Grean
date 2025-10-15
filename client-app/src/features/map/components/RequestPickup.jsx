import {
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonLabel,
  IonIcon,
  IonRow,
  IonCol,
  IonDatetime,
  IonFabButton,
  IonList
} from "@ionic/react";
import {usePickups} from "@/context/PickupsContext";
import dayjs from "dayjs";
import {closeOutline} from "ionicons/icons";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";

function RequestPickup({handleClose, profile}) {
  const {createPickup, visiblePickups} = usePickups();

  const [pickupRequestData, setPickupRequestData] = useState({
    address: "",
    materials: [],
    pickupDateTime: dayjs().toISOString(),
    pickupNote: ""
  });

  const [profileLocations, setProfileLocations] = useState([]);

  useEffect(() => {
    if (profile?.locations) {
      setProfileLocations(profile.locations);
    }
  }, [profile]);

  const handleChange = (name, value) => {
    setPickupRequestData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!pickupRequestData.address) {
        toast.error("Please select a valid address.");
        return;
      }
      if (!pickupRequestData.pickupDateTime) {
        toast.error("Please select a valid pickup date and time.");
        return;
      }
      if (pickupRequestData.materials.length === 0) {
        toast.error("Please select at least one material.");
        return;
      }

      const activePickups = visiblePickups.filter(
        (pickup) => pickup.createdBy?.userId === profile?.uid
      );

      if (activePickups.length >= 2) {
        toast.error("You can only have 2 active pickups at a time.");
        return;
      }

      const selectedAddress = profileLocations.find(
        (location) => location.street === pickupRequestData.address
      );

      if (!selectedAddress) {
        toast.error("Selected address is invalid.");
        return;
      }

      const pickupData = {
        pickupDate: dayjs(pickupRequestData.pickupDateTime).format(
          "YYYY-MM-DD"
        ),
        pickupTime: dayjs(pickupRequestData.pickupDateTime).format("HH:mm"),
        pickupNote: pickupRequestData.pickupNote,
        addressData: selectedAddress,
        materials: pickupRequestData.materials,
        isAccepted: false,
        isCompleted: false,
        createdBy: {
          userId: profile?.uid,
          displayName: profile?.displayName || "No Name",
          email: profile?.email,
          photoURL: profile?.photoURL || ""
        }
      };

      await createPickup(pickupData);
      handleClose();
    } catch (error) {
      console.error("Error creating pickup:", error);
      toast.error("There was an error creating the pickup. Please try again.");
    }
  };
  console.log(profileLocations);

  return (
    <main className="w-full h-full pb-6  overflow-auto">
      <IonRow className="h-[90%] w-full overflow-auto ion-padding">
        <IonList className="w-full ion-padding bg-orange rounded-md">
          <IonCol size="12">
            {/* <IonLabel position="floating" className="text-center">Select Address</IonLabel> */}
            <IonSelect
              value={pickupRequestData.address}
              className="w-full px-2 bg-slate-50 text-center rounded-md"
              onIonChange={(e) => handleChange("address", e.detail.value)}
              placeholder={profileLocations[0]?.address || "Select Address"}
            >
              {profileLocations.map((address, index) => (
                <IonSelectOption
                  className="bg-orange"
                  key={index}
                  value={address.street}
                >
                  {address.street}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonCol>
          <IonCol>
            <IonLabel position="stacked">Materials</IonLabel>
            <IonSelect
              multiple
              value={pickupRequestData.materials}
              onIonChange={(e) => handleChange("materials", e.detail.value)}
              placeholder="Select materials"
            >
              <IonSelectOption value="plastic">Plastic</IonSelectOption>
              <IonSelectOption value="glass">Glass</IonSelectOption>
              <IonSelectOption value="aluminum">Aluminum</IonSelectOption>
              <IonSelectOption value="cardboard">Cardboard</IonSelectOption>
              <IonSelectOption value="palets">Palets</IonSelectOption>
              <IonSelectOption value="appliances">Appliances</IonSelectOption>
            </IonSelect>
          </IonCol>

          <IonCol>
            <IonLabel position="stacked">Pickup Date & Time</IonLabel>
            <IonDatetime
              value={pickupRequestData.pickupDateTime}
              onIonChange={(e) =>
                handleChange("pickupDateTime", e.detail.value)
              }
              min={dayjs().toISOString()}
              presentation="date-time"
              minuteValues="0,15,30,45"
            />
          </IonCol>

          <IonCol>
            <IonLabel position="stacked">Pickup Notes</IonLabel>
            <IonTextarea
              rows={3}
              value={pickupRequestData.pickupNote}
              onIonChange={(e) => handleChange("pickupNote", e.detail.value)}
            />
          </IonCol>
        </IonList>
      </IonRow>
      <IonRow className="h-[10%] mx-auto ion-justify-content-center ion-align-items-center">
        <IonCol size="auto">
          <IonButton expand="block" color="primary" onClick={handleSubmit}>
            Submit
          </IonButton>
        </IonCol>
        <IonCol size="auto">
          <IonFabButton color="danger" onClick={handleClose}>
            <IonIcon icon={closeOutline} />
          </IonFabButton>
        </IonCol>
      </IonRow>
    </main>
  );
}

export default RequestPickup;
