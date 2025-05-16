import {useEffect, useState} from "react";
import CreateLocation from "./CreateLocation";
import ProfileHeader from "./ProfileHeader";
import {IonButton, IonCol, IonGrid, IonIcon, IonModal, IonRow} from "@ionic/react";
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


  return (
    <IonGrid className="h-full overflow-auto flex flex-col justify-end ion-no-padding bg-gradient-to-t from-grean to-blue-300 sm:px-8">
      {/* Modal for Add Location */}
      <IonModal isOpen={isModalVisible}>
        <CreateLocation profile={profile} handleClose={() => setIsModalVisible(false)} />
      </IonModal>

      <main className="container max-w-lg mx-auto flex-grow overflow-auto ion-padding">
        <ProfileHeader profile={profile} />
        <MyForest />
        <Impact />
        {profile?.accountType === "User" && <MyLocations profile={profile} />}
        {profile?.accountType === "Driver" && <MyRoutes profile={profile} />}
      </main>
      
    </IonGrid>
  );
};

export default Profile;
