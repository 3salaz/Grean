import { useEffect, useState } from "react";
import AddLocation from "./AddLocation";
import ProfileHeader from "./ProfileHeader";
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
import { UserProfile } from "../../../context/ProfileContext";

// **Define Props Interface**
interface ProfileProps {
  profile: UserProfile | null;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [profileAddresses, setProfileAddresses] = useState<string[]>([]);

  useEffect(() => {
    // Ensure locations are an array before setting state
    if (profile?.locations && Array.isArray(profile.locations)) {
      setProfileAddresses(profile.locations);
    } else {
      setProfileAddresses([]); // Default to an empty array if null/undefined
    }
  }, [profile]);

  const handleOpenModal = (content: JSX.Element) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };

  return (
    <IonGrid className="h-full overflow-auto flex flex-col justify-end ion-no-padding bg-gradient-to-t from-grean to-blue-300 sm:px-8">
      {/* Modal for Add Location */}
      <IonModal
        isOpen={isModalVisible}
        onDidDismiss={handleCloseModal}
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        {modalContent}
      </IonModal>

      <main className="container max-w-2xl mx-auto flex-grow overflow-auto ion-padding">
        <ProfileHeader
          profile={profile}
          openModal={() =>
            handleOpenModal(<AddLocation handleClose={handleCloseModal} />)
          }
        />
        <MyForest />
        <Impact />
      </main>

      {/* Ensure `locations` is an array before using `.length` */}
      {profile?.accountType === "User" && profileAddresses.length > 0 ? (
        <MyLocations />
      ) : (
        <IonRow className="container max-w-2xl mx-auto w-full bg-white rounded-t-md drop-shadow-xl">
          <IonCol size="auto" className="mx-auto ion-padding-horizontal py-2">
            <IonButton
              fill="outline"
              size="small"
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
};

export default Profile;
