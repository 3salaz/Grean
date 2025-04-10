import React, {useState, useEffect, useRef} from "react";
import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonAlert,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonList,
  IonSpinner,
  IonRadioGroup,
  IonRadio,
  IonImg,
  IonText,
  IonListHeader,
  IonCardSubtitle,
  IonIcon,
  IonModal
} from "@ionic/react";
import {useProfile} from "../context/ProfileContext";
import {ToastContainer} from "react-toastify";
import noPickupIcon from "../assets/no-pickups.svg";
import {Pickup, usePickups} from "../context/PickupsContext";
import {
  calendarNumberOutline,
  checkmarkCircleOutline,
  chevronForward,
  closeCircleOutline
} from "ionicons/icons";
import CreatePickup from "../components/Pickups/CreatePickup";
import PickupDetails from "../components/Pickups/PickupDetails";

function Testing() {
  const {availablePickups} = usePickups();
  const {profile} = useProfile();
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);

  type ModalKeys = "createPickupOpen" | "selectedPickupOpen";

  const [modalState, setModalState] = useState<Record<ModalKeys, boolean>>({
    createPickupOpen: false,
    selectedPickupOpen: false
  });

  const openModal = (modalName: ModalKeys) => {
    setModalState((prev) => ({...prev, [modalName]: true}));
  };

  const closeModal = (modalName: ModalKeys) => {
    setModalState((prev) => ({...prev, [modalName]: false}));
  };

  return (
    <IonPage>
      <ToastContainer />
      {/* Create Pickup Modal */}
      <IonModal
        isOpen={modalState.createPickupOpen}
        onDidDismiss={() => closeModal("createPickupOpen")}
      >
        <CreatePickup profile={profile} handleClose={() => closeModal("createPickupOpen")} />
      </IonModal>
      <IonModal isOpen={modalState.selectedPickupOpen}>
        <PickupDetails
          pickup={selectedPickup}
          handleClose={() => closeModal("selectedPickupOpen")}
        />
      </IonModal>
      <IonContent>
        <IonGrid class="container mx-auto max-w-xl">
          <IonRow className="ion-no-margin ion-padding overflow-y-auto flex-grow flex flex-col justify-end gap-2">
            <IonCard className="ion-padding ion-margin">
              <IonCardHeader>
                <IonCardTitle>Pickup Functions</IonCardTitle>
                <IonCardSubtitle>Driver</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent class="flex px-0">
                <IonList>
                  <IonListHeader>
                    <IonLabel>Available Pickups:{availablePickups?.length || 0}</IonLabel>
                  </IonListHeader>
                  {availablePickups.length > 0 ? (
                    availablePickups.map((pickup) => (
                      <IonItem key={pickup.id} className="w-full bg-white relative">
                        <IonRow className="w-full py-2 ion-justify-content-start gap-1 border-b border-gray-200 m-1">
                          <IonCol size="1" className="flex flex-col items-end justify-center">
                            <IonIcon
                              icon={pickup.isAccepted ? checkmarkCircleOutline : closeCircleOutline}
                            />
                          </IonCol>
                          <IonCol size="1" className="flex items-center justify-center">
                            <IonIcon size="large" icon={calendarNumberOutline} />
                          </IonCol>
                          <IonCol size="8" className="pl-2 ion-align-self-center">
                            <div className="text-xs">
                              <strong>Address</strong> {pickup.addressData.address}
                            </div>
                            <div className="text-xs">
                              <strong>Date:</strong> {pickup.pickupDate}
                            </div>
                            <div className="text-xs">
                              <strong>Time:</strong> {pickup.pickupTime}
                            </div>
                          </IonCol>
                          <IonCol size="1" className="flex items-center">
                            <IonButton
                              fill="clear"
                              color="primary"
                              onClick={() => {
                                setSelectedPickup(pickup); // Set the selected pickup first
                                openModal("selectedPickupOpen"); // Then open the modal
                              }}
                            >
                              <IonIcon color="primary" icon={chevronForward} />
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      </IonItem>
                    ))
                  ) : (
                    <IonRow className="ion-text-center ion-justify-content-center w-full bg-orange-300">
                      <IonCol size="12" className="flex flex-col justify-center items-center">
                        <img
                          src={noPickupIcon}
                          alt="No pickups to display"
                          className="w-32 h-32 my-2"
                        />
                        <IonText className="text-base text-gray-500">No pickups to display</IonText>
                      </IonCol>
                    </IonRow>
                  )}
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

export default Testing;
