import {
  IonBadge,
  IonButton,
  IonCol,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonItem,
  IonList,
  IonModal,
  IonRow,
  IonText,
  IonFooter,
  IonListHeader,
  IonLabel,
  IonCardContent,
  IonCard,
  IonCardHeader,
} from "@ionic/react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { useState } from "react";
import RequestPickup from "../Map/RequestPickup";
import { usePickups } from "../../../../context/PickupsContext";
import {
  calendarNumberOutline,
  checkmarkCircleOutline,
  chevronForward,
  closeCircleOutline,
  notificationsOutline,
} from "ionicons/icons";

function Pickups() {
  const { profile } = useAuthProfile();
  const { userAcceptedPickups, userCreatedPickups, visiblePickups } =
    usePickups();

  const [modalState, setModalState] = useState({
    requestPickupOpen: false,
    viewPickupOpen: false,
  });

  const [selectedPickup, setSelectedPickup] = useState(null); // Holds the selected pickup data

  const openModal = (modalName, pickup = null) => {
    setModalState((prevState) => ({ ...prevState, [modalName]: true }));
    if (modalName === "viewPickupOpen") setSelectedPickup(pickup);
  };

  const closeModal = (modalName) => {
    setModalState((prevState) => ({ ...prevState, [modalName]: false }));
    if (modalName === "viewPickupOpen") setSelectedPickup(null);
  };

  return (
    <IonGrid className="h-full overflow-auto flex flex-col justify-between ion-no-padding bg-gradient-to-t from-grean to-blue-300">
      {/* Request Pickup Modal */}
      <IonModal
        isOpen={modalState.requestPickupOpen}
        onDidDismiss={() => closeModal("requestPickupOpen")}
      >
        <RequestPickup handleClose={() => closeModal("requestPickupOpen")} />
      </IonModal>

      {/* View Pickup Modal */}
      <IonModal
        isOpen={modalState.viewPickupOpen}
        onDidDismiss={() => closeModal("viewPickupOpen")}
      >
        {selectedPickup && (
          <main className="container mx-auto h-full flex items-center justify-center bg-grean">
            <div className="bg-white shadow-xl rounded-md">
              <span></span>
              <IonRow className="text-center ion-padding">
                <IonCol size="12" className="">
                  <IonCard className="px-16 shadow-none">
                    <IonCardHeader>
                      <IonText className="text-xl font-bold">
                        Pickup Details
                      </IonText>
                    </IonCardHeader>
                    <IonCardContent className="pickup-details">
                      <p>
                        <strong className="underline">Address</strong>
                        <br />
                        {selectedPickup.addressData.street},<br />
                        {selectedPickup.addressData.city}
                      </p>
                      <p>
                        <strong className="underline">Date:</strong>
                        <br />
                        {new Date(selectedPickup.pickupDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>

                      <p>
                        <strong className="underline">Time</strong>
                        <br />
                        {new Date(
                          `1970-01-01T${selectedPickup.pickupTime}Z`
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                      <p>
                        <strong className="underline">Pickup Note</strong>
                        <br />
                        {selectedPickup.pickupNote || "None"}
                      </p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="auto" className="mx-auto flex">
                  <IonButton
                    expand="block"
                    color="secondary"
                    onClick={() => openModal("requestPickupOpen")}
                    className="drop-shadow-lg"
                  >
                    Edit Pickup
                  </IonButton>
                  <IonButton
                    expand="block"
                    color="danger"
                    onClick={() => closeModal("viewPickupOpen")}
                  >
                    <IonIcon slot="icon-only" icon={closeCircleOutline} />
                  </IonButton>
                </IonCol>
              </IonRow>
            </div>
          </main>
        )}
      </IonModal>

      {/* Main Section */}
      <main className="container max-w-4xl mx-auto h-[90%] flex flex-end  flex-col overflow-auto">
        <IonRow className="ion-no-margin p-4 pb-0">
          <IonCol size="12">
            <IonText className="text-2xl font-bold">
              Hi there,{" "}
              <span className="text-white">{profile.displayName}</span>
            </IonText>
          </IonCol>
        </IonRow>

        {/* Pickup List */}
        <IonRow className="ion-no-margin ion-padding overflow-y-auto flex-grow flex flex-col justify-end">
          <IonCol className="flex">
            <IonList className="w-full max-h-[60vh] overflow-auto rounded-md">
              <IonListHeader>
                <IonLabel className="text-2xl font-bold  text-orange">
                  <span className="underline">Current Pickups: {userCreatedPickups.length}</span>
                </IonLabel>
              </IonListHeader>

              {/* Render Pickups */}
              {userCreatedPickups.length === 0 ? (
                <IonItem className="w-full text-center">
                  <IonText>Create A Pickup To Get Started!</IonText>
                </IonItem>
              ) : (
                userCreatedPickups.map((pickup) => (
                  <IonItem
                    key={pickup.id}
                    className="w-full bg-orange relative"
                  >
                    <IonRow className="w-full pt-8 ion-justify-content-center">
                      {/* Icon Column */}
                      <IonCol
                        size="1"
                        className="flex items-center justify-center"
                      >
                        <IonIcon size="large" icon={calendarNumberOutline} />
                      </IonCol>

                      {/* Pickup Details Column */}
                      <IonCol size="7" className="pl-2 ion-align-self-center">
                        <div className="text-xs">
                          <strong>Date:</strong>
                          <br />
                          {new Date(pickup.pickupDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </IonCol>

                      {/* Button Column */}
                      <IonCol
                        size="4"
                        className="flex flex-col items-end justify-center"
                      >
                        <div className="sm:text-xs text-xs">
                          <IonIcon
                            icon={
                              pickup.isAccepted
                                ? checkmarkCircleOutline
                                : closeCircleOutline
                            }
                            color={pickup.isAccepted ? "success" : "danger"}
                          />{" "}
                          {pickup.isAccepted ? "Accepted" : "Not Accepted"}
                        </div>
                        <IonButton
                          className="text-xs"
                          onClick={() => openModal("viewPickupOpen", pickup)}
                        >
                          View
                          <IonIcon size="small" icon={chevronForward} />
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonItem>
                ))
              )}
            </IonList>
          </IonCol>
        </IonRow>
      </main>

      {/* Footer */}
      <IonFooter className="mx-auto container h-auto max-w-4xl shadow-none p-8">
        <IonRow className="w-full gap-2 container mx-auto max-w-xl justify-center items-center">
          {profile?.accountType === "User" && profile?.locations.length > 0 && (
            <IonCol size="8">
              <IonButton
                expand="block"
                color="light"
                onClick={() => openModal("requestPickupOpen")}
                className="drop-shadow-lg"
              >
                Request Pickup
              </IonButton>
            </IonCol>
          )}
        </IonRow>
      </IonFooter>
    </IonGrid>
  );
}

export default Pickups;
