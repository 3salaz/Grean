import {useEffect, useState} from "react";
import CreateLocation from "./CreateLocation";
import ProfileHeader from "./ProfileHeader";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonModal,
  IonRow
} from "@ionic/react";
import MyForest from "./MyForest";
import MyLocations from "./MyLocations";
import Impact from "./Impact";
import {addCircleOutline} from "ionicons/icons";
import {UserProfile} from "../../context/ProfileContext";
import {ToastContainer} from "react-toastify";
import MyRoutes from "./MyRoutes";

// **Define Props Interface**
interface ProfileProps {
  profile: UserProfile | null;
}

const Profile: React.FC<ProfileProps> = ({profile}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fixTouchEvent = (event: TouchEvent) => {};

    document.addEventListener("touchstart", fixTouchEvent, {passive: true});
    document.addEventListener("touchmove", fixTouchEvent, {passive: true});

    return () => {
      document.removeEventListener("touchstart", fixTouchEvent);
      document.removeEventListener("touchmove", fixTouchEvent);
    };
  }, []);

  if (!profile) {
    return (
      <IonGrid className="h-full flex items-center justify-center">
        <IonRow>
          <IonCol className="text-center">Loading Profile...</IonCol>
        </IonRow>
      </IonGrid>
    );
  }

  return (
    <IonGrid className="h-full overflow-auto flex flex-col justify-end ion-no-padding bg-gradient-to-t from-grean to-blue-300 sm:px-8">
      <ToastContainer />
      {/* Modal for Add Location */}
      <IonModal
        isOpen={isModalVisible}
        onDidDismiss={() => setIsModalVisible(false)}
      >
        <CreateLocation
          profile={profile}
          handleClose={() => setIsModalVisible(false)}
        />
      </IonModal>

      <main className="container max-w-2xl mx-auto flex-grow overflow-auto ion-padding">
        <ProfileHeader profile={profile} />
        <MyForest />
        <Impact />
        {profile?.accountType === "User" && <MyLocations profile={profile} />}
        {profile?.accountType === "Driver" && <MyRoutes profile={profile} />}
      </main>

      {profile?.accountType === "User" && profile.locations.length < 1 && (
        <IonRow className="container max-w-2xl mx-auto w-full rounded-t-md">
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
    </IonGrid>
  );
};

export default Profile;
