import {
  IonBadge,
  IonButton,
  IonCol,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonFooter,
  IonListHeader,
  IonLabel,
} from "@ionic/react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { useState } from "react";
import RequestPickup from "../Map/RequestPickup";
import { usePickups } from "../../../../context/PickupsContext";
import {
  calendarNumberOutline,
  chevronForward,
  leafOutline,
  notificationsOutline,
} from "ionicons/icons";

function Pickups() {
  const { profile } = useAuthProfile();
  const { userAcceptedPickups, userCreatedPickups, visiblePickups } =
    usePickups(); // Using updated context
  const [modalState, setModalState] = useState({
    requestPickupOpen: false,
  });

  const openModal = (modalName) => {
    setModalState((prevState) => ({ ...prevState, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModalState((prevState) => ({ ...prevState, [modalName]: false }));
  };

  return (
    <IonGrid className="h-full overflow-auto flex flex-col ion-no-padding bg-gradient-to-t from-grean to-blue-300 sm:px-8">
      {/* Request Pickup Modal */}
      <IonModal
        isOpen={modalState.requestPickupOpen}
        onDidDismiss={() => closeModal("requestPickupOpen")}
      >
        <RequestPickup handleClose={() => closeModal("requestPickupOpen")} />
      </IonModal>
      <main className="container max-w-4xl mx-auto h-[90%] flex flex-col overflow-auto">
        <IonRow className="ion-no-margin ion-padding pb-0">
          <IonCol size="12">
            <IonText className="text-2xl font-bold">
              Hi there,{" "}
              <span className="text-white">{profile.displayName}</span>
            </IonText>
          </IonCol>
        </IonRow>
        {/* Main Content */}
        <IonRow className="ion-no-margin ion-padding overflow-y-auto flex-grow flex flex-col justify-end">
          <IonCol className="flex">
            <IonList className="w-full max-h-[60vh] overflow-auto rounded-md">
              {/* Example List Items */}
              <IonListHeader>
                <IonLabel className="text-2xl font-bold underline text-grean">
                  Current Pickups: {userCreatedPickups.length}
                </IonLabel>
              </IonListHeader>
              {userCreatedPickups.map((pickup, index) => (
                <IonItem key={index} className="w-full ">
                  <IonRow className="w-full">
                    <IonCol
                      size="1"
                      className="flex items-center justify-center"
                    >
                      <IonIcon
                        size="large"
                        icon={calendarNumberOutline}
                      ></IonIcon>
                    </IonCol>
                    <IonCol size="10" className="pl-2">
                      <div>Date:{pickup.date}</div>
                      <div className="text-sm">
                        Materials:{" "}
                        {Object.entries(pickup.materials || {}).map(
                          ([key, value], idx) => (
                            <span key={idx}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                              {value}
                              {idx < Object.entries(pickup.materials).length - 1
                                ? ", "
                                : ""}
                            </span>
                          )
                        )}
                      </div>
                    </IonCol>
                    <IonCol
                      size="1"
                      className="flex items-center justify-center"
                    >
                      <IonIcon size="small" icon={chevronForward}></IonIcon>
                    </IonCol>
                  </IonRow>
                </IonItem>
              ))}
            </IonList>
          </IonCol>
        </IonRow>
      </main>

      {/* Fixed Footer Row */}
      <IonFooter className="mx-auto container h-auto max-w-4xl bg-white drop-shadow-xl rounded-t-md border-t-grean border-2 border-l-transparent border-r-transparent border-b-0 border-b-transparent p-2">
        <IonRow className="w-full gap-2 container mx-auto max-w-xl justify-center items-center">
          {profile?.accountType === "User" && profile?.locations.length > 0 && (
            <IonCol size="8">
              <IonButton
                expand="block"
                color="primary"
                onClick={() => openModal("requestPickupOpen")}
                className="drop-shadow-lg"
              >
                Request Pickup
              </IonButton>
            </IonCol>
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
      </IonFooter>
    </IonGrid>
  );
}

export default Pickups;
