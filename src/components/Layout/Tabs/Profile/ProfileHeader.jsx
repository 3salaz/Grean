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
import { addCircleOutline, settingsOutline } from "ionicons/icons";

function ProfileHeader({openModal}) {
  const { profile } = useAuthProfile();

  console.log("Profile Data:", profile); // Debugging

  // Debugging image URL directly
  console.log("Profile Picture URL:", profile?.profilePic);

  return (
    <IonRow className="ion-align-items-center rounded-t-lg ion-justify-content-between max-h-40">
      
      <IonCol size="3" className="ion-align-items-center ion-text-center">
        <div className="h-full rounded-full overflow-hidden flex flex-col flex-wrap items-center justify-end">
          <img
            className="object-cover w-20 h-20 bg-white rounded-full"
            src={profile?.profilePic || userIcon} // Debugging with native img tag
            alt="User Icon"
          />
        </div>
      </IonCol>
      
      <IonCol size="6">
        <div className="flex flex-col items-start justify-center px-2">
          <IonText className="text-xl font-bold">
            {profile?.displayName || "User Name"} {/* Fallback for display name */}
          </IonText>
          <IonText className="text-xs bg-grean text-white font-bold rounded-lg p-1">
            ID: {profile?.email || "No Email"} {/* Fallback for email */}
          </IonText>
        </div>
      </IonCol>

      <IonCol
        size="3"
        offset="lg"
        className="flex flex-col items-end h-full w-full justify-end px-2"
      >
        <div className="flex flex-col text-xs items-center justify-center font-bold">
         
          <IonButton shape="round"  color="secondary" onClick={openModal}>
          <IonIcon size="" slot="icon-only" icon={addCircleOutline} />
          
        </IonButton>
        </div>
        <div className="flex text-xs items-center justify-center">
        <IonButton shape="round" color="danger">

          <IonIcon size="" slot="icon-only" icon={settingsOutline} />
        </IonButton>
        </div>

      </IonCol>

    </IonRow>
  );
}

export default ProfileHeader;
