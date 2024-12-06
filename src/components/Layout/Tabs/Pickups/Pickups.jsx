import {
  IonBadge,
  IonButton,
  IonCol,
  IonFabButton,
  IonFooter,
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
} from "@ionic/react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";

import { useState } from "react";
import RequestPickup from "../Map/RequestPickup";
import { usePickups } from "../../../../context/PickupsContext";
import {
  calendarNumberOutline,
  checkmarkCircleOutline,
  leafOutline,
  notificationsOutline,
} from "ionicons/icons";

function Pickups() {
  const { profile } = useAuthProfile();
  const { userAcceptedPickups, userCreatedPickups, visiblePickups } =
    usePickups();
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
    <IonGrid className="h-full w-full ion-no-margin bg-gradient-to-b from-grean to-blue-300">
      
      <IonModal
        isOpen={modalState.requestPickupOpen}
        onDidDismiss={() => closeModal("requestPickupOpen")}
      >
        <RequestPickup handleClose={() => closeModal("requestPickupOpen")} />
      </IonModal>

      <IonRow className="h-[8svh] flex items-center justify-center container mx-auto max-w-xl">
        <IonCol size="12" className="text-center">
          <IonHeader className="shadow-none">
            <IonText className="text-2xl font-bold">
              Hi there, <span>{profile.displayName}</span>
            </IonText>
          </IonHeader>
        </IonCol>
      </IonRow>

      <IonRow className="h-[8svh] container mx-auto max-w-xl px-4">
        <IonCol size="12">
          <IonSelect
            className="bg-white rounded-full px-4 w-full"
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
      </IonRow>
      {/* <IonRow className="max-w-4xl px-4 mx-auto">
        <IonList className="overflow-auto max-h-[50svh] w-full rounded-md mx-auto">
          <IonItem className="w-full">
            <IonRow className="w-full">
              <IonCol size="2" className="flex items-center justify-center">
                <IonIcon size="large" icon={checkmarkCircleOutline}></IonIcon>
              </IonCol>
              <IonCol size="10" className="flex flex-col">
                <div>10/21/24</div>
                <div>Aluminum/Glass</div>
              </IonCol>
            </IonRow>
          </IonItem>

          <IonItem className="w-full">
            <IonRow className="w-full">
              <IonCol size="2" className="flex items-center justify-center">
                <IonIcon size="large" icon={checkmarkCircleOutline}></IonIcon>
              </IonCol>
              <IonCol size="10" className="flex flex-col">
                <div>10/21/24</div>
                <div>Aluminum/Glass</div>
              </IonCol>
            </IonRow>
          </IonItem>

          <IonItem className="w-full">
            <IonRow className="w-full">
              <IonCol size="2" className="flex items-center justify-center">
                <IonIcon size="large" icon={checkmarkCircleOutline}></IonIcon>
              </IonCol>
              <IonCol size="10" className="flex flex-col">
                <div>10/21/24</div>
                <div>Aluminum/Glass</div>
              </IonCol>
            </IonRow>
          </IonItem>

          <IonItem className="w-full">
            <IonRow className="w-full">
              <IonCol size="2" className="flex items-center justify-center">
                <IonIcon size="large" icon={checkmarkCircleOutline}></IonIcon>
              </IonCol>
              <IonCol size="10" className="flex flex-col">
                <div>10/21/24</div>
                <div>Aluminum/Glass</div>
              </IonCol>
            </IonRow>
          </IonItem>

          <IonItem className="w-full">
            <IonRow className="w-full">
              <IonCol size="2" className="flex items-center justify-center">
                <IonIcon size="large" icon={checkmarkCircleOutline}></IonIcon>
              </IonCol>
              <IonCol size="10" className="flex flex-col">
                <div>10/21/24</div>
                <div>Aluminum/Glass</div>
              </IonCol>
            </IonRow>
          </IonItem>

          <IonItem className="w-full">
            <IonRow className="w-full">
              <IonCol size="2" className="flex items-center justify-center">
                <IonIcon size="large" icon={checkmarkCircleOutline}></IonIcon>
              </IonCol>
              <IonCol size="10" className="flex flex-col">
                <div>10/21/24</div>
                <div>Aluminum/Glass</div>
              </IonCol>
            </IonRow>
          </IonItem>

          <IonItem className="w-full">
            <IonRow className="w-full">
              <IonCol size="2" className="flex items-center justify-center">
                <IonIcon size="large" icon={checkmarkCircleOutline}></IonIcon>
              </IonCol>
              <IonCol size="10" className="flex flex-col">
                <div>10/21/24</div>
                <div>Aluminum/Glass</div>
              </IonCol>
            </IonRow>
          </IonItem>

          <IonItem className="w-full">
            <IonRow className="w-full">
              <IonCol size="2" className="flex items-center justify-center">
                <IonIcon size="large" icon={checkmarkCircleOutline}></IonIcon>
              </IonCol>
              <IonCol size="10" className="flex flex-col">
                <div>10/21/24</div>
                <div>Aluminum/Glass</div>
              </IonCol>
            </IonRow>
          </IonItem>

          <IonItem className="w-full">
            <IonRow className="w-full">
              <IonCol size="2" className="flex items-center justify-center">
                <IonIcon size="large" icon={checkmarkCircleOutline}></IonIcon>
              </IonCol>
              <IonCol size="10" className="flex flex-col">
                <div>10/21/24</div>
                <div>Aluminum/Glass</div>
              </IonCol>
            </IonRow>
          </IonItem>

          <IonItem className="w-full">
            <IonRow className="w-full">
              <IonCol size="2" className="flex items-center justify-center">
                <IonIcon size="large" icon={checkmarkCircleOutline}></IonIcon>
              </IonCol>
              <IonCol size="10" className="flex flex-col">
                <div>10/21/24</div>
                <div>Aluminum/Glass</div>
              </IonCol>
            </IonRow>
          </IonItem>
        </IonList>
      </IonRow> */}

      <RequestPickup/>

      <IonFooter className="h-[8svh] absolute bottom-2 gap-2 left-0 ion-align-self-center ion-justify-content-center mx-auto z-50 shadow-none">
        <IonRow className="w-full ion-justify-content-center container mx-auto max-w-xl">
          {profile?.accountType === "User" && profile?.locations.length > 0 && (
            <>
              <IonCol size="8" className="ion-align-self-center">
                <IonButton
                  expand="block"
                  color="primary"
                  onClick={() => openModal("requestPickupOpen")}
                  className="drop-shadow-lg"
                >
                  Request Pickup
                </IonButton>
              </IonCol>
              <IonCol size="auto" className="relative">
                <IonFabButton
                  onClick={() => openModal("alertsOpen")}
                  color="light"
                  className="drop-shadow-lg"
                >
                  <IonIcon color="primary" icon={leafOutline} />
                </IonFabButton>
                <IonBadge className="absolute top-0 right-0 bg-red-500 rounded-full aspect-square w-5 p-1 flex items-center justify-center">
                  {userCreatedPickups.length}
                </IonBadge>
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
      </IonFooter>
    </IonGrid>
  );
}

export default Pickups;
