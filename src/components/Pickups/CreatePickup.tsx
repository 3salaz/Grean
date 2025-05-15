import React, {useEffect, useState} from "react";
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
  IonList,
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonGrid
} from "@ionic/react";
import dayjs from "dayjs";
import {closeOutline} from "ionicons/icons";
import {toast, ToastContainer} from "react-toastify";
import {Pickup, usePickups} from "../../context/PickupsContext";
import {useUserLocations} from "../../hooks/useUserLocations";
import {UserProfile} from "../../context/ProfileContext";
import Navbar from "../Layout/Navbar";

// Define type for local state (matching Pickup type)
type PickupData = Omit<Pickup, "id" | "createdAt" | "isAccepted" | "isCompleted" | "createdBy">;

interface CreatePickupProps {
  handleClose: () => void;
  profile: UserProfile | null;
}

const CreatePickup: React.FC<CreatePickupProps> = ({handleClose, profile}) => {
  const locationIds = Array.isArray(profile?.locations) ? profile.locations : [];
  const {locations: userLocations} = useUserLocations(locationIds);
  const {createPickup, availablePickups} = usePickups();

  const [creating, setCreating] = useState(false);

  // ✅ Use full ISO time and clean date/time parsing
  const now = dayjs();
  const [formData, setFormData] = useState<PickupData>({
    pickupDate: now.format("YYYY-MM-DD"),
    pickupTime: now.format("HH:mm"),
    pickupNote: "",
    addressData: {address: ""},
    materials: []
  });

  // ✅ Log formData for debugging
  useEffect(() => {
    console.log("🔍 formData updated:", formData);
  }, [formData]);

  const handleChange = (name: keyof PickupData, value: any) => {
    if (name === "addressData" && typeof value === "string") {
      console.warn("Invalid address data received, skipping update.");
      return;
    }

    setFormData((prev) => ({
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

      if (!formData.addressData.address) {
        toast.error("Please select a valid address.");
        return;
      }

      if (!formData.pickupDate || !formData.pickupTime) {
        toast.error("Please select a valid pickup date and time.");
        return;
      }

      if (formData.materials.length === 0) {
        toast.error("Please select at least one material.");
        return;
      }

      const activePickups = (availablePickups ?? []).filter(
        (pickup) => pickup.createdBy?.userId === profile.uid
      );

      if (activePickups.length >= 2) {
        toast.error("You can only have 2 active pickups at a time.");
        return;
      }

      console.log("🚀 Sending pickup data to backend:", formData);

      await createPickup(formData);
      handleClose();
    } catch (error) {
      console.error("Error creating pickup:", error);
      toast.error("There was an error creating the pickup. Please try again.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <Navbar />
      </IonHeader>
      <IonContent>
        <IonGrid className="w-full h-full overflow-auto flex flex-col">
          <IonRow className="flex-grow container w-full h-full overflow-auto ion-padding bg-orange-400">
            <ToastContainer autoClose={5000} />
            <IonList className="w-full ion-padding bg-orange rounded-md">
              {/* Address Selection */}
              <IonCol size="12">
                <IonLabel position="stacked">Select Address</IonLabel>
                <IonSelect
                  value={formData.addressData.address || ""}
                  className="w-full px-2 bg-slate-50 text-center rounded-md"
                  onIonChange={(e) => {
                    const selectedLocation = userLocations.find(
                      (location) => location.address === e.detail.value
                    );

                    if (selectedLocation) {
                      handleChange("addressData", {
                        address: selectedLocation.address
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
                  value={formData.materials}
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
                  value={`${formData.pickupDate}T${formData.pickupTime}`}
                  onIonChange={(e) => {
                    const value = e.detail.value?.toString();
                    if (value) {
                      const parsed = dayjs(value);
                      handleChange("pickupDate", parsed.format("YYYY-MM-DD"));
                      handleChange("pickupTime", parsed.format("HH:mm"));
                    }
                  }}
                  min={dayjs().toISOString()}
                  presentation="date-time"
                  minuteValues="0,15,30,45"
                />
              </IonCol>

              {/* Pickup Notes */}
              {/* <IonCol>
                <IonLabel position="stacked">Pickup Notes</IonLabel>
                <IonTextarea
                  rows={3}
                  value={formData.pickupNote ?? ""}
                  onIonChange={(e) => handleChange("pickupNote", e.detail.value ?? "")}
                />
              </IonCol> */}
            </IonList>
          </IonRow>

          {/* Buttons Row */}
          <IonRow class="ion-padding border-[#75B657] border-t-2">
            <IonCol size="auto" className="flex gap-1 mx-auto justify-center items-center">
              <IonButton size="small" expand="block" color="primary" onClick={handleSubmit}>
                Create Pickup
              </IonButton>
              </IonCol>
              <IonCol size="auto" className="flex gap-1 mx-auto justify-center items-center">
              <IonButton size="small" color="danger" onClick={handleClose}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CreatePickup;
