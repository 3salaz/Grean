import React, { useEffect, useState } from "react";
import { IonButton, IonCol, IonGrid, IonRow, IonText, IonModal, IonIcon, IonContent, IonHeader, IonButtons, IonLabel, IonSelect, IonSelectOption } from "@ionic/react";
import CreatePickup from "./CreatePickup";
import { arrowDown, arrowDownCircleOutline, calendarNumberOutline, list, listCircleSharp } from "ionicons/icons";
import { UserProfile } from "../../context/ProfileContext";
import { usePickups } from "../../context/PickupsContext";
import ViewPickups from "./ViewPickups";
import PickupsQueue from "./PickupsQueue";
import CreateLocation from "../Profile/CreateLocation";
import Schedule from "../Map/Schedule";
import dayjs from "dayjs";
import { useUserLocations } from "../../hooks/useUserLocations";

interface PickupsProps {
  profile: UserProfile | null;
}

// All supported modal keys
type ModalKeys = "createPickupOpen" | "createLocationOpen" | "scheduleOpen";

const Pickups: React.FC<PickupsProps> = ({ profile }) => {
  const [modalState, setModalState] = useState<Record<ModalKeys, boolean>>({
    createPickupOpen: false,
    createLocationOpen: false,
    scheduleOpen: false
  });

  const [formData, setFormData] = useState({
    pickupTime: dayjs().add(1, "day").hour(7).minute(0).second(0).toISOString(),
    pickupNote: "",
    addressData: { address: "" },
    materials: [],
  })

  useEffect(() => {
    console.log("🔍 formData updated:", formData);
  }, [formData]);

  const locationIds = Array.isArray(profile?.locations) ? profile.locations : [];
  const { locations: userLocations } = useUserLocations(locationIds);

  const openModal = (modalName: ModalKeys) => {
    // ✅ Remove focus from any currently focused element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setModalState((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: ModalKeys) => {
    setModalState((prev) => ({ ...prev, [modalName]: false }));
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };


  if (!profile) {
    return (
      <IonGrid className="h-full flex items-center justify-center">
        <IonRow>
          <IonCol className="text-center">
            <IonButton color="primary" expand="block">
              Loading Profile...
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }

  return (
    <main className="container h-full max-w-2xl mx-auto flex flex-col overflow-auto drop-shadow-xl md:py-4 md:rounded-md ion-padding">
      <IonModal
        isOpen={modalState.createPickupOpen}
        backdropDismiss={false}
        onDidPresent={() => {
          // Optional: log or do any other setup
          console.log("Modal presented");
        }}
        onDidDismiss={() => closeModal("createPickupOpen")}
      >
        <CreatePickup profile={profile} handleClose={() => closeModal("createPickupOpen")} />
      </IonModal >

      <IonModal
        isOpen={modalState.createLocationOpen}
        onDidDismiss={() => closeModal("createLocationOpen")}
      >
        <CreateLocation profile={profile} handleClose={() => closeModal("createLocationOpen")} />
      </IonModal >

      <IonModal isOpen={modalState.scheduleOpen} onDidDismiss={() => closeModal("scheduleOpen")}>
        <Schedule handleClose={() => closeModal("scheduleOpen")} />
      </IonModal>

      <IonHeader class="ion-padding-horizontal pt-4">
        <IonText class="text-xl font-bold">
          Hi  There, {profile.displayName}
        </IonText>
      </IonHeader>
      <section className="flex-grow">
        <IonRow className="px-2 pb-2">
          <IonCol size="12">
            <IonSelect
              value={formData.addressData.address || ""}
              label=""
              placeholder="Select address"
              onIonChange={(e) => {
                const selected = userLocations.find((l) => l.address === e.detail.value);
                if (selected) {
                  handleChange("addressData", { address: selected.address });
                }
              }}
            >
              {userLocations.map((loc, idx) => (
                <IonSelectOption key={idx} value={loc.address}>
                  {loc.address}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonCol>
        </IonRow>
        <IonRow className={`bg-white rounded-lg ion-padding-horizontal justify-between ${showDropdown ? 'rounded-b-none' : ''}`}>
          <IonCol>
            <div className="text-sm py-2">What material are you recycling?</div>
          </IonCol>
          <IonCol size="auto">
            <IonButton size="small" onClick={() => setShowDropdown(!showDropdown)}>
              <IonIcon icon={arrowDown} />
            </IonButton>
          </IonCol>
          {/* DropDown Content Here */}
        </IonRow>

        {showDropdown && (
          <div className="w-full bg-green-50 rounded-b-lg py-2 animate-slide-down">
            <IonButton fill="clear" expand="block" onClick={() => console.log("Glass")}>
              Glass
            </IonButton>
            <IonButton fill="clear" expand="block" onClick={() => console.log("Cardboard")}>
              Cardboard
            </IonButton>
          </div>
        )}
      </section>
      <IonRow className="pt-2 flex mx-auto gap-2">

        <IonCol size="auto">
          <IonButton size="small" onClick={() => openModal("createPickupOpen")}>
            Pickup Request
          </IonButton>
        </IonCol>

        <IonCol size="auto">
          <IonButton size="small">
            <IonIcon icon={list}></IonIcon>
          </IonButton>
        </IonCol>

      </IonRow>
    </main >
  );
};

export default Pickups;

{/* <CreatePickup profile={profile} handleClose={() => closeModal("createPickupOpen")} /> */ }
{/* {profile.accountType === "User" ? (
          // User View
          <IonRow className="ion-no-margin ion-padding overflow-y-auto flex-grow flex flex-col justify-end">
            {profile.locations.length > 0 ? (
              <IonCol className="flex">
                <ViewPickups />
              </IonCol>
            ) : (
              <IonCol className="rounded-md flex flex-col items-center justify-center text-center gap-8">
                <IonText className="text-xl font-bold text-slate-600">
                  (Please add a location to get started)
                </IonText>
                <IonIcon size="large" icon={arrowDownCircleOutline} className="text-2xl text-800" />
              </IonCol>
            )}

            <IonCol size="auto" className="flex-grow mx-auto p-2">
              <IonButton
                size="small"
                onClick={() =>
                  profile.locations.length > 0
                    ? openModal("createPickupOpen")
                    : openModal("createLocationOpen")
                }
              >
                {profile.locations.length > 0 ? "Create Pickup" : "Add Location"}
              </IonButton>
            </IonCol>
          </IonRow>
        ) : (
          // Driver View
          <IonRow className="ion-no-margin ion-padding overflow-y-auto flex-grow flex flex-col justify-end gap-2">
            <IonCol className="flex">
              <PickupsQueue />
            </IonCol>
            <IonCol size="auto" className="mx-auto w-full flex gap-2">
              <IonButton onClick={() => openModal("scheduleOpen")}>
                <IonIcon icon={calendarNumberOutline} slot="start" />
              </IonButton>
              <IonButton>
                <IonIcon icon={listCircleSharp} slot="start" />
              </IonButton>
            </IonCol>
          </IonRow>
        )} */}
