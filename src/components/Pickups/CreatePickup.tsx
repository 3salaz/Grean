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
import dayjs from "dayjs";
import {closeOutline} from "ionicons/icons";
import {useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {Pickup, usePickups} from "../../context/PickupsContext";
import {useUserLocations} from "../../hooks/useUserLocations";
import {UserProfile} from "../../context/ProfileContext";

// Define type for local state (matching Pickup type)
type PickupData = Omit<
  Pickup,
  "id" | "createdAt" | "isAccepted" | "isCompleted" | "createdBy"
>;

interface CreatePickupProps {
  handleClose: () => void;
  profile: UserProfile | null;
}

const CreatePickup: React.FC<CreatePickupProps> = ({handleClose, profile}) => {
  const locationIds = Array.isArray(profile?.locations)
    ? profile.locations
    : [];
  const {locations: userLocations, loading} = useUserLocations(locationIds);
  const {createPickup, visiblePickups} = usePickups();

  const [pickupData, setPickupData] = useState<PickupData>({
    pickupDate: dayjs().format("YYYY-MM-DD"),
    pickupTime: dayjs().format("HH:mm"),
    pickupNote: "",
    addressData: {address: ""}, // ✅ Match the expected format
    materials: []
  });

  const handleChange = (name: keyof PickupData, value: any) => {
    if (name === "addressData" && typeof value === "string") {
      console.warn("Invalid address data received, skipping update.");
      return;
    }

    setPickupData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!profile) {
        toast.error("User profile not found. Please try again.");
        return;
      }

      if (!pickupData.addressData.address) {
        toast.error("Please select a valid address.");
        return;
      }

      if (!pickupData.pickupDate || !pickupData.pickupTime) {
        toast.error("Please select a valid pickup date and time.");
        return;
      }

      if (pickupData.materials.length === 0) {
        toast.error("Please select at least one material.");
        return;
      }

      // Limit active pickups to 2
      const activePickups = (visiblePickups ?? []).filter(
        (pickup) => pickup.createdBy?.userId === profile.uid
      );

      if (activePickups.length >= 2) {
        toast.error("You can only have 2 active pickups at a time.");
        return;
      }

      console.log("🚀 Sending pickup data to backend:", pickupData);

      await createPickup(pickupData);
      toast.success("Pickup request successfully created.");
      handleClose();
    } catch (error) {
      console.error("Error creating pickup:", error);
      toast.error("There was an error creating the pickup. Please try again.");
    }
  };

  return (
    <main className="w-full h-full pb-6 overflow-auto">
      <ToastContainer position="top-right" autoClose={5000} />
      <IonRow className="h-[90%] w-full overflow-auto ion-padding">
        <IonList className="w-full ion-padding bg-orange rounded-md">
          {/* Address Selection */}
          <IonCol size="12">
            <IonLabel position="stacked">Select Address</IonLabel>
            <IonSelect
              value={pickupData.addressData.address || ""}
              className="w-full px-2 bg-slate-50 text-center rounded-md"
              onIonChange={(e) => {
                const selectedLocation = userLocations.find(
                  (location) => location.address === e.detail.value
                );

                if (selectedLocation) {
                  handleChange("addressData", {
                    address: selectedLocation.address // ✅ Store full address string
                  });
                }
              }}
              placeholder="Select Address"
            >
              {userLocations.map((location, index) => (
                <IonSelectOption key={index} value={location.address}>
                  {location.address}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonCol>

          {/* Materials Selection */}
          <IonCol>
            <IonLabel position="stacked">Materials</IonLabel>
            <IonSelect
              multiple
              value={pickupData.materials}
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

          {/* Date & Time Selection */}
          <IonCol>
            <IonLabel position="stacked">Pickup Date & Time</IonLabel>
            <IonDatetime
              value={`${pickupData.pickupDate}T${pickupData.pickupTime}`}
              onIonChange={(e) =>
                handleChange(
                  "pickupDate",
                  dayjs(e.detail.value).format("YYYY-MM-DD")
                )
              }
              min={dayjs().toISOString()}
              presentation="date-time"
              minuteValues="0,15,30,45"
            />
          </IonCol>

          {/* Pickup Notes */}
          <IonCol>
            <IonLabel position="stacked">Pickup Notes</IonLabel>
            <IonTextarea
              rows={3}
              value={pickupData.pickupNote}
              onIonChange={(e) => handleChange("pickupNote", e.detail.value!)}
            />
          </IonCol>
        </IonList>
      </IonRow>

      {/* Buttons Row */}
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
};

export default CreatePickup;
