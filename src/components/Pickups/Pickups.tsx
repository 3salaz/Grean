import React, {useState, useEffect} from "react";
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
import CreatePickup from "./CreatePickup";
import {
  calendarNumberOutline,
  checkmarkCircleOutline,
  chevronForward,
  closeCircleOutline
} from "ionicons/icons";
import {UserProfile} from "../../context/ProfileContext";
import {ToastContainer} from "react-toastify";
import {usePickups} from "../../context/PickupsContext"; // Import usePickups and Pickup i
import ViewPickups from "./ViewPickups";

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
        {profile.accountType === "User" && profile.locations.length === 0 ? (
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
              <ViewPickups />
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
