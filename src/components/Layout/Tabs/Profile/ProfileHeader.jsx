import {
  IonButton,
  IonCol,
  IonIcon,
  IonImg,
  IonRow,
  IonText,
} from "@ionic/react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import userIcon from "../../../../assets/icons/user.png";
import { settingsOutline } from "ionicons/icons";

function ProfileHeader() {
  const { profile } = useAuthProfile();

  console.log("Profile Data:", profile); // Debugging

  // Debugging image URL directly
  console.log("Profile Picture URL:", profile?.profilePic);

  return (
    <IonRow className="ion-align-items-center rounded-lg ion-justify-content-between h-20 px-4">
      <IonCol size="2" className="ion-align-items-center ion-text-center px-2">
        <div className="h-16 w-16 bg-white rounded-full overflow-hidden flex flex-col flex-wrap items-center justify-end">
          <img
            className="w-full h-full object-cover"
            src={profile?.profilePic || userIcon} // Debugging with native img tag
            alt="User Icon"
          />
        </div>
      </IonCol>

      <IonCol size="8">
        <div className="flex flex-col items-start justify-center px-2">
          <IonText className="text-2xl font-bold">
            {profile?.displayName || "User Name"} {/* Fallback for display name */}
          </IonText>
          <IonText className="text-xs bg-grean text-white font-bold rounded-lg p-1">
            ID: {profile?.email || "No Email"} {/* Fallback for email */}
          </IonText>
        </div>
      </IonCol>

      <IonCol
        size="2"
        offset="lg"
        className="flex items-end h-full w-full justify-end px-2"
      >
        <IonButton shape="round" color="danger" size="small">
          <IonIcon size="small" slot="icon-only" icon={settingsOutline} />
        </IonButton>
      </IonCol>
    </IonRow>
  );
}

export default ProfileHeader;
