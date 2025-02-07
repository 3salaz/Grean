import { useEffect, useRef, useState } from "react";
import AddLocation from "./AddLocation";
import ProfileHeader from "./ProfileHeader";
import { useProfile } from "../../../../context/ProfileContext";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonModal,
  IonRow,
} from "@ionic/react";
import MyForest from "./MyForest";
import MyLocations from "./MyLocations";
import Impact from "./Impact";
import MyPickups from "../Pickups/MyPickups";
import { addCircleOutline } from "ionicons/icons";

function Profile({ profile }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null); // Dynamic content
  const [profileAddresses, setProfileAddresses] = useState([]);
  const addressRefs = useRef([]);

  useEffect(() => {
    if (profile?.locations) {
      setProfileAddresses(profile.locations || []);
    }
  }, [profile]);

  const handleOpenModal = (content) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };

  return (
    <IonGrid className="h-full overflow-auto flex flex-col justify-end ion-no-padding bg-gradient-to-t from-grean to-blue-300 sm:px-8">
      <IonModal
        isOpen={isModalVisible}
        onDidDismiss={handleCloseModal}
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        {modalContent}
      </IonModal>

      <main className="container max-w-2xl mx-auto flex-grow overflow-auto">
        <ProfileHeader
          profile={profile}
          openModal={() =>
            handleOpenModal(<AddLocation handleClose={handleCloseModal} />)
          }
        />
        <MyForest />
        <Impact />
      </main>

      {profile?.accountType === "User" && profileAddresses.length > 0 ? (
        <MyLocations />
      ) : (
        <IonRow className="container mx-auto w-full border-t-2 border-t-grean">
          <IonCol size="auto" className="mx-auto ion-padding">
            <IonButton
              fill="primary"
              color="primary"
              expand="block"
              onClick={() =>
                handleOpenModal(<AddLocation handleClose={handleCloseModal} />)
              }
              className="text-sm"
            >
              Add Location
              <IonIcon slot="start" icon={addCircleOutline}></IonIcon>
            </IonButton>
          </IonCol>
        </IonRow>
      )}

      {profile?.accountType === "Driver" && <MyPickups />}
    </IonGrid>
  );
}

export default Profile;
