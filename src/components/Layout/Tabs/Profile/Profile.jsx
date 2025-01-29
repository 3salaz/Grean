import { useEffect, useRef, useState } from "react";
import AddLocation from "./AddLocation";
import ProfileHeader from "./ProfileHeader";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import {
  IonButton,
  IonGrid,
  IonIcon,
  IonModal,
} from "@ionic/react";
import MyForest from "./MyForest";
import MyLocations from "./MyLocations";
import Impact from "./Impact";
import MyPickups from "../Pickups/MyPickups";
import { addCircleOutline } from "ionicons/icons";

function Profile() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null); // Dynamic content
  const [profileAddresses, setProfileAddresses] = useState([]);
  const { profile } = useAuthProfile();
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

      <main className="container max-w-4xl mx-auto flex-grow p-2 overflow-auto">
        <ProfileHeader openModal={() => handleOpenModal(<AddLocation handleClose={handleCloseModal} />)} />
        <MyForest />
        <Impact />
      </main>

      {profile?.accountType === "User" && profileAddresses.length > 0 ? (
        <MyLocations />
      ) : (
        <footer>
          <div className="flex-none w-full flex justify-center items-end snap-center bg-transparent">
            <IonButton
              fill="primary"
              onClick={() => handleOpenModal(<AddLocation handleClose={handleCloseModal} />)}
              className="text-sm"
            >
              Add Location
              <IonIcon slot="start" icon={addCircleOutline}></IonIcon>
            </IonButton>
          </div>
        </footer>
      )}

      {profile?.accountType === "Driver" && <MyPickups />}
    </IonGrid>
  );
}

export default Profile;
