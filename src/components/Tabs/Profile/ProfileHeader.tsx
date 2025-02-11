import { useState } from "react";
import {
  IonButton,
  IonCol,
  IonIcon,
  IonRow,
  IonText,
  IonModal,
} from "@ionic/react";
import { settingsOutline } from "ionicons/icons";
import ProfileEdit from "./ProfileEdit";
import { UserProfile } from "../../../context/ProfileContext";
import { useProfile } from "../../../context/ProfileContext";

// ✅ Define props interface
interface ProfileHeaderProps {
  profile: UserProfile | null;
  openModal?: () => void; // Make this optional
}


const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, openModal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <IonRow className="ion-align-items-end ion-padding rounded-t-lg ion-justify-content-between bg-white">
        {/* Profile Info Section */}
        <IonCol
          size="9"
          className="flex justify-start p-0 rounded-md bg-grean bg-opacity-60"
        >
          <div className="flex px-2 p-1 flex-col items-start justify-end rounded-lg">
            <IonText className="text-xl font-bold">
              {profile?.displayName || "User 1"}
            </IonText>
            <IonText className="text-xs bg-green-50 font-bold rounded-lg">
              Email: {profile?.email || "No Email"}
            </IonText>
          </div>
        </IonCol>

        {/* Action Buttons */}
        <IonCol size="3" className="flex flex-col items-end justify-end">
          <div className="flex text-xs items-center justify-center">
            <IonButton
              onClick={() => setIsModalOpen(true)}
              size="small"
              shape="round"
              color="danger"
            >
              <IonIcon slot="icon-only" icon={settingsOutline} />
            </IonButton>

            {/* ✅ Optional Add Location Button (openModal) */}
            {/* {!profile?.locations && (
              <IonButton onClick={openModal} size="small" shape="round" color="primary">
                Add Location
              </IonButton>
            )} */}
          </div>
        </IonCol>
      </IonRow>

      {/* Modal for Profile Editing */}
      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <ProfileEdit profile={profile} onClose={() => setIsModalOpen(false)} />
      </IonModal>
    </>
  );
};

export default ProfileHeader;
