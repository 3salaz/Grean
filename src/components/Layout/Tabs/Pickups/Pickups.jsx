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
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { useState } from "react";
import RequestPickup from "../Map/RequestPickup";
import { usePickups } from "../../../../context/PickupsContext";
import {
  alertCircleOutline,
  calendarNumberOutline,
  checkmarkCircleOutline,
  chevronForward,
  closeCircleOutline,
  leafOutline,
  notificationsOutline,
} from "ionicons/icons";

function Pickups() {
  const { profile } = useAuthProfile();
  const { userAcceptedPickups, userCreatedPickups, visiblePickups, updatePickup } =
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

  const handleAcceptPickup = async (pickupId) => {
    const acceptedBy = {
      uid: profile?.uid,
      displayName: profile?.displayName || "No Name",
      email: profile?.email,
      photoURL: profile?.profilePic || "",
    };

    await updatePickup(pickupId, {
      isAccepted: true,
      acceptedBy,
    });
  };

  return (
    <>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <IonGrid className="h-full overflow-auto flex flex-col justify-end ion-no-padding bg-gradient-to-t from-grean to-blue-300">
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
                  {profile?.accountType === "User" ? (
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
                  ) : (
                    <IonCol size="auto" className="mx-auto flex">
                      <IonButton
                        expand="block"
                        color="primary"
                        onClick={() => handleAcceptPickup(selectedPickup.id)}
                        className="drop-shadow-lg"
                      >
                        Accept Pickup
                      </IonButton>
                      <IonButton
                        expand="block"
                        color="danger"
                        onClick={() => closeModal("viewPickupOpen")}
                      >
                        <IonIcon slot="icon-only" icon={closeCircleOutline} />
                      </IonButton>
                    </IonCol>
                  )}
                </IonRow>
              </div>
            </main>
          )}
        </IonModal>

        {/* Main Section */}
        <main className="container h-full max-w-4xl mx-auto flex justify-end  flex-col overflow-auto">
          <IonRow className="ion-no-margin ion-padding overflow-y-auto flex-grow flex flex-col justify-end">
            {profile?.accountType === "User" ? (
              <IonCol className="flex">
                <IonList className="w-full overflow-auto rounded-md">
                  <IonListHeader>
                    <IonLabel className="text-2xl font-bold  text-orange">
                      <span className="underline">
                        My Pickups: {userCreatedPickups.length}
                      </span>
                    </IonLabel>
                  </IonListHeader>
                  {profile?.locations === 0 && (
                    <IonItem>
                      Add A Location To Start Creating Pickups Requests
                    </IonItem>
                  )}
                  {userCreatedPickups.length < 0 ? (
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
                          <IonCol
                            size="1"
                            className="flex items-center justify-center"
                          >
                            <IonIcon size="large" icon={calendarNumberOutline} />
                          </IonCol>
                          <IonCol
                            size="7"
                            className="pl-2 ion-align-self-center"
                          >
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
                              onClick={() =>
                                openModal("viewPickupOpen", pickup)
                              }
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
            ) : (
              <IonCol className="flex">
                <IonList className="w-full overflow-auto rounded-md">
                  <IonListHeader>
                    <IonLabel className="text-2xl font-bold  text-orange">
                      <span className="underline">
                        Driver Pickups: {visiblePickups.length}
                      </span>
                    </IonLabel>
                  </IonListHeader>
                  {visiblePickups.length < 0 ? (
                    <IonItem className="w-full text-center">
                      <IonText>No Pickups Currently Available</IonText>
                    </IonItem>
                  ) : (
                    visiblePickups.map((pickup) => (
                      <IonItem
                        key={pickup.id}
                        className="w-full bg-orange relative"
                      >
                        <IonRow className="w-full pt-8 ion-justify-content-center">
                          <IonCol
                            size="1"
                            className="flex items-center justify-center"
                          >
                            <IonIcon size="large" icon={calendarNumberOutline} />
                          </IonCol>
                          <IonCol
                            size="7"
                            className="pl-2 ion-align-self-center"
                          >
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
                              onClick={() =>
                                openModal("viewPickupOpen", pickup)
                              }
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
            )}
          </IonRow>
        </main>

        {/* Footer */}
        <IonFooter className="mx-auto container max-w-4xl shadow-none pb-8">
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
            {profile?.accountType === "Driver" && (
              <>
                <IonCol size="auto">
                  <IonButton
                    color="light"
                    onClick={() => openModal()}
                    className="drop-shadow-lg"
                  >
                    Accepted Pickups
                  </IonButton>
                </IonCol>
                <IonCol size="auto">
                  <IonButton
                    color="primary"
                    onClick={() => openModal()}
                    className="drop-shadow-lg"
                  >
                    <IonIcon slot="icon-only" icon={leafOutline} />
                  </IonButton>
                </IonCol>
              </>
            )}
          </IonRow>
        </IonFooter>
      </IonGrid>
    </>
  );
}

export default Pickups;
