import React, {useState} from "react";
import {IonButton, IonCol, IonGrid, IonRow, IonText, IonModal, IonIcon} from "@ionic/react";
import CreatePickup from "./CreatePickup";
import {calendarNumberOutline, listCircleSharp} from "ionicons/icons";
import {UserProfile} from "../../context/ProfileContext";
import {ToastContainer} from "react-toastify";
import {usePickups} from "../../context/PickupsContext";
import ViewPickups from "./ViewPickups";
import PickupsQueue from "./PickupsQueue";
import CreateLocation from "../Profile/CreateLocation";
import Schedule from "../Map/Schedule";

interface PickupsProps {
  profile: UserProfile | null;
}
// All supported modal keys
type ModalKeys = "createPickupOpen" | "createLocationOpen" | "scheduleOpen";

const Pickups: React.FC<PickupsProps> = ({profile}) => {
  const [modalState, setModalState] = useState<Record<ModalKeys, boolean>>({
    createPickupOpen: false,
    createLocationOpen: false,
    scheduleOpen: false
  });

  const openModal = (modalName: ModalKeys) => {
    setModalState((prev) => ({...prev, [modalName]: true}));
  };

  const closeModal = (modalName: ModalKeys) => {
    setModalState((prev) => ({...prev, [modalName]: false}));
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
    <IonGrid className="h-full overflow-auto flex flex-col justify-end ion-no-padding bg-gradient-to-t from-grean to-blue-300">
      <ToastContainer />

      {/* Create Pickup Modal */}
      <IonModal
        isOpen={modalState.createPickupOpen}
        onDidDismiss={() => closeModal("createPickupOpen")}
      >
        <CreatePickup profile={profile} handleClose={() => closeModal("createPickupOpen")} />
      </IonModal>

      {/* Create Location Modal */}
      <IonModal
        isOpen={modalState.createLocationOpen}
        onDidDismiss={() => closeModal("createLocationOpen")}
      >
        <CreateLocation profile={profile} handleClose={() => closeModal("createLocationOpen")} />
      </IonModal>

      <IonModal isOpen={modalState.scheduleOpen} onDidDismiss={() => closeModal("scheduleOpen")}>
        <Schedule handleClose={() => closeModal("scheduleOpen")} />
      </IonModal>

      {/* Main Section */}
      <main className="container h-full max-w-2xl mx-auto flex justify-end flex-col overflow-auto drop-shadow-xl rounded-t-md">
        {profile.accountType === "User" ? (
          // User View
          <IonRow className="ion-no-margin ion-padding overflow-y-auto flex-grow flex flex-col justify-end">
            {profile.locations.length > 0 ? (
              <IonCol className="flex">
                <ViewPickups />
              </IonCol>
            ) : (
              <IonCol className="rounded-md flex items-center justify-center text-center bg-amber-50">
                <IonText className="text-base">Please add a location to get started</IonText>
              </IonCol>
            )}

            <IonCol size="auto" className="flex-grow mx-auto p-2">
              <IonButton
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
        )}
      </main>
    </IonGrid>
  );
};

export default Pickups;
