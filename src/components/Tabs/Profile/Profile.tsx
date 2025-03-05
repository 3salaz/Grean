import { useState } from "react";
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
  const profileLocations = profile?.locations || [];
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
    <IonGrid className="h-full overflow-auto flex flex-col justify-end ion-no-padding bg-gradient-to-t from-grean to-blue-300 sm:px-8">
      {/* Modal for Add Location */}
      <IonModal isOpen={isModalVisible} onDidDismiss={() => setIsModalVisible(false)}>
        <AddLocation profile={profile} handleClose={() => setIsModalVisible(false)} />
      </IonModal>

      <main className="container max-w-2xl mx-auto flex-grow overflow-auto ion-padding">
        <ProfileHeader profile={profile} />
        <MyForest />
        <Impact />
      </main>

      {profile?.accountType === "User" && profileLocations.length ? (
        <MyLocations profile={profile} />
      ) : (
        <IonRow className="container max-w-2xl mx-auto w-full bg-white border-t-yellow-300 border-t rounded-t-md drop-shadow-xl">
          <IonCol size="auto" className="mx-auto ion-padding-horizontal py-2">
            <IonButton
              fill="outline"
              size="small"
              color="primary"
              expand="block"
              onClick={() => setIsModalVisible(true)}
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
