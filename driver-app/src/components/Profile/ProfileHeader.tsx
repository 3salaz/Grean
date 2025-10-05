import { useState } from "react";
import {
  IonButton,
  IonCol,
  IonIcon,
  IonRow,
  IonText,
  IonModal,
} from "@ionic/react";
import { addCircle, settings, settingsOutline } from "ionicons/icons";
import ProfileEdit from "./ProfileEdit";
import { UserProfile } from "../../context/ProfileContext";
import { useLocations } from "../../context/LocationsContext";
import { Route } from "react-router-dom";

interface ProfileHeaderProps {
  openModal?: () => void;
  profile: UserProfile | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ openModal, profile }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentLocation } = useLocations();
  const shortAddress = currentLocation?.address
    ?.split(",")
    .slice(0, 2) // keep street and city
    .join(",")
    .trim();

  return (
    <IonRow className="ion-padding flex items-center justify-between border-b border-slate-200">
      {/* Profile Info */}
      <IonCol size="9">
        <div className="flex flex-col items-start justify-end space-y-1">
          <IonText className="text-md text-[#75B657] border-1 font-bold bg-white px-4 py-1 rounded-2xl">
            {profile?.displayName|| "User 1"}
          </IonText>
          {profile?.accountType === "User" ?
            <IonText className="text-xs px-2 font-semibold pt-2">
              Location: {shortAddress || "None selected"}
            </IonText> : <IonText className="">
              {profile?.accountType}
            </IonText>
          }

        </div>
      </IonCol>

      {/* Action Buttons */}
      <IonCol size="auto" className="flex flex-col items-end justify-end ion-padding-vertical">
        <div className="flex items-center justify-center gap-1">
          <IonButton
            onClick={() => setIsModalOpen(true)}
            fill="outline"
            color="primary"
            expand="block"
            shape="round"
            size="small"
            className="text-sm bg-white rounded-full"
          >
            <IonIcon slot="icon-only" icon={settings} />
          </IonButton>
          
          {!profile?.locations?.length && openModal && (
            <IonButton onClick={openModal} size="small" shape="round" fill="clear">
              <IonIcon slot="icon-only" icon={addCircle} />
            </IonButton>
          )}
        </div>
      </IonCol>
      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <ProfileEdit profile={profile} onClose={() => setIsModalOpen(false)} />
      </IonModal>
    </IonRow>
  );
};

export default ProfileHeader;
