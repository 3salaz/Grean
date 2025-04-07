import React, {useState, useEffect} from "react";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonText,
  IonModal,
  IonIcon
} from "@ionic/react";
import CreatePickup from "./CreatePickup";
import {
  calendarNumberOutline,
  checkmarkCircleOutline,
  chevronForward,
  closeCircleOutline,
  listCircleSharp
} from "ionicons/icons";
import {UserProfile} from "../../context/ProfileContext";
import {ToastContainer} from "react-toastify";
import {usePickups} from "../../context/PickupsContext"; // Import usePickups and Pickup i
import ViewPickups from "./ViewPickups";
import PickupsQueue from "./PickupsQueue";

interface PickupsProps {
  profile: UserProfile | null;
}

const Pickups: React.FC<PickupsProps> = ({profile}) => {
  const [modalState, setModalState] = useState({createPickupOpen: false});
  const {userCreatedPickups, fetchUserCreatedPickups} = usePickups();

  useEffect(() => {
    if (profile?.uid) {
      fetchUserCreatedPickups(profile.uid);
    }
  }, [profile, fetchUserCreatedPickups]);

  const openModal = (modalName: "createPickupOpen") => {
    setModalState((prevState) => ({...prevState, [modalName]: true}));
  };

  const closeModal = (modalName: "createPickupOpen") => {
    setModalState((prevState) => ({...prevState, [modalName]: false}));
  };

  if (!profile) {
    return (
      <IonGrid className="h-full flex items-center justify-center">
        {" "}
        <IonRow>
          {" "}
          <IonCol className="text-center">
            {" "}
            <IonButton color="primary" expand="block">
              {" "}
              Loading Profile...{" "}
            </IonButton>{" "}
          </IonCol>{" "}
        </IonRow>{" "}
      </IonGrid>
    );
  }

  return (
    <IonGrid className="h-full overflow-auto flex flex-col justify-end ion-no-padding bg-gradient-to-t from-grean to-blue-300">
      {" "}
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
      {/* Main Section */}
      <main className="container h-full max-w-2xl mx-auto flex justify-end flex-col overflow-auto drop-shadow-xl rounded-t-md">
        {profile.accountType === "User" ? (
          <>
            <IonRow className="ion-no-margin ion-padding overflow-y-auto flex-grow flex flex-col justify-end">
              {profile.locations.length > 0 ? (
                <IonCol className="flex">
                  <ViewPickups />
                </IonCol>
              ) : (
                <IonCol className="rounded-md flex items-center justify-center text-center bg-amber-50">
                  <IonText className="text-base">
                    Please add a location to get started
                  </IonText>
                </IonCol>
              )}

              {profile.locations.length > 0 ? (
                <IonCol size="auto" className="flex-grow mx-auto p-2">
                  <IonButton onClick={() => openModal("createPickupOpen")}>
                    Create Pickup
                  </IonButton>
                </IonCol>
              ) : (
                <IonCol size="auto" className="flex-grow mx-auto p-2">
                  <IonButton onClick={() => openModal("createPickupOpen")}>
                    Add Location
                  </IonButton>
                </IonCol>
              )}
            </IonRow>
          </>
        ) : (
          <IonRow className="ion-no-margin ion-padding overflow-y-auto flex-grow flex flex-col justify-end">
            <IonCol>
              {/*  Pickup Queue */}
              <PickupsQueue />
            </IonCol>
            <IonCol size="auto" className="mx-auto w-full flex gap-2">
              <IonButton onClick={() => openModal("createPickupOpen")}>
                <IonIcon icon={calendarNumberOutline} slot="start">
                  dhsd
                </IonIcon>
              </IonButton>
              <IonButton>
                <IonIcon icon={listCircleSharp} slot="start">
                  ashddsfh
                </IonIcon>
              </IonButton>
            </IonCol>
          </IonRow>
        )}
      </main>
    </IonGrid>
  );
};

export default Pickups;
