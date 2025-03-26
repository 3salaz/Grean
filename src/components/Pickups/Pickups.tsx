import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonList,
  IonListHeader,
  IonLabel,
  IonRow,
  IonText,
  IonModal
} from "@ionic/react";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import {useState} from "react";
import CreatePickup from "./CreatePickup";
import {Pickup, usePickups} from "../../context/PickupsContext"; // Import usePickups
import {
  calendarNumberOutline,
  checkmarkCircleOutline,
  chevronForward,
  closeCircleOutline
} from "ionicons/icons";
import ViewPickups from "./ViewPickups"; // Import modal content
import {UserProfile} from "../../context/ProfileContext";
import {ToastContainer} from "react-toastify";

interface PickupsProps {
  profile: UserProfile | null;
}

const Pickups: React.FC<PickupsProps> = ({profile}) => {
  const {userCreatedPickups, visiblePickups} = usePickups();

  const [modalState, setModalState] = useState({
    createPickupOpen: false,
    viewPickupOpen: false
  });
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);

  const openModal = (
    modalName: "createPickupOpen" | "viewPickupOpen",
    pickup: Pickup | null = null
  ) => {
    setModalState((prevState) => ({...prevState, [modalName]: true}));
    if (modalName === "viewPickupOpen") setSelectedPickup(pickup);
  };

  const closeModal = (modalName: "createPickupOpen" | "viewPickupOpen") => {
    setModalState((prevState) => ({...prevState, [modalName]: false}));
    if (modalName === "viewPickupOpen") setSelectedPickup(null);
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
        <CreatePickup
          profile={profile}
          handleClose={() => closeModal("createPickupOpen")}
        />
      </IonModal>

      {/* View Pickup Modal */}
      <IonModal
        isOpen={modalState.viewPickupOpen}
        onDidDismiss={() => closeModal("viewPickupOpen")}
      >
        {/* {selectedPickup && (
          <ViewPickups
            selectedPickup={selectedPickup}
            profile={profile}
            onClose={() => closeModal("viewPickupOpen")}
          />
        )} */}
      </IonModal>

      {/* Main Section */}
      <main className="container h-full max-w-2xl mx-auto flex justify-end flex-col overflow-auto drop-shadow-xl rounded-t-md">
        {profile?.accountType === "User" && profile?.locations.length === 0 ? (
          <IonRow className="h-full p-2">
            <IonCol className="rounded-md ion-justify-content-center ion-align-self-center text-center">
              <IonText className="text-lg">
                Please add a location to get started
              </IonText>
              <IonButton>Add Location</IonButton>
            </IonCol>
          </IonRow>
        ) : (
          <IonRow className="ion-no-margin ion-padding overflow-y-auto flex-grow flex flex-col justify-end">
            <IonCol className="flex">
              <IonList className="w-full overflow-auto rounded-md">
                <IonListHeader>
                  <IonLabel className="text-2xl pl-4 font-bold text-orange">
                    {profile?.accountType === "User"
                      ? "My Pickups"
                      : "Driver Pickups"}
                    :{" "}
                    {profile?.accountType === "User"
                      ? userCreatedPickups.length
                      : visiblePickups.length}
                  </IonLabel>
                </IonListHeader>
                {(profile?.accountType === "User"
                  ? userCreatedPickups
                  : visiblePickups
                ).map((pickup) => (
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
                      <IonCol size="7" className="pl-2 ion-align-self-center">
                        <div className="text-xs">
                          <strong>Date:</strong>{" "}
                          {new Date(pickup.pickupDate).toLocaleDateString(
                            "en-US"
                          )}
                        </div>
                      </IonCol>
                      <IonCol
                        size="4"
                        className="flex flex-col items-end justify-center"
                      >
                        <IonIcon
                          icon={
                            pickup.isAccepted
                              ? checkmarkCircleOutline
                              : closeCircleOutline
                          }
                        />
                        <IonButton
                          className="text-xs"
                          onClick={() => openModal("viewPickupOpen", pickup)}
                        >
                          View <IonIcon size="small" icon={chevronForward} />
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
            <IonCol size="auto" className="flex-grow mx-auto p-2">
              <IonButton onClick={() => openModal("createPickupOpen")}>
                Create Pickup
              </IonButton>
            </IonCol>
          </IonRow>
        )}
      </main>
    </IonGrid>
  );
};

export default Pickups;
