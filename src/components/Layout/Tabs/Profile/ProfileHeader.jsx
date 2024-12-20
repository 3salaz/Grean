import { useState } from "react";
import {
  IonButton,
  IonCol,
  IonIcon,
  IonRow,
  IonText,
  IonSpinner,
} from "@ionic/react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import userIcon from "../../../../assets/icons/user.png";
import { addCircleOutline, settingsOutline } from "ionicons/icons";

function ProfileHeader({ openModal }) {
  const { profile } = useAuthProfile();

  // State to check image loading status
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Debugging
  console.log("Profile Data:", profile);
  console.log("Profile Picture URL:", profile?.profilePic);

  return (
    <IonRow className="ion-align-items-center rounded-t-lg ion-justify-content-between max-h-40 bg-white">
      {/* Profile Image Section */}
      <IonCol size="3" className="ion-align-items-center ion-text-center">
        <div className="h-full w-full aspect-square rounded-full overflow-hidden flex items-center justify-center relative">
          {isImageLoading && (
            <IonSpinner
              name="crescent"
              className="absolute w-10 h-10 text-gray-400"
            />
          )}
          <img
            className={`object-cover w-20 h-20 bg-white rounded-full transition-opacity duration-500 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            src={profile?.profilePic}
            alt="User Icon"
            onLoad={() => setIsImageLoading(false)} // Hide spinner when image loads
            onError={(e) => {
              console.error("Image failed to load:", e.target.src); // Log the broken URL
              setIsImageLoading(false); // Hide spinner
              // e.target.src = userIcon; // Replace with default image on error
            }}
          />
        </div>
      </IonCol>

      {/* Profile Info Section */}
      <IonCol size="6">
        <div className="flex flex-col items-start justify-center bg-grean bg-opacity-20 p-2 rounded-lg">
          <IonText className="text-xl font-bold">
            {profile?.displayName || "User Name"}
          </IonText>
          <IonText className="text-xs bg-green-50 font-bold rounded-lg">
            ID: {profile?.email || "No Email"}
          </IonText>
        </div>
      </IonCol>

      {/* Action Buttons */}
      <IonCol size="3" className="flex flex-col items-end justify-end px-2">
        <div className="flex flex-col text-xs items-center justify-center font-bold">
          <IonButton size="small" shape="round" color="secondary" onClick={openModal}>
            <IonIcon slot="icon-only" icon={addCircleOutline} />
          </IonButton>
        </div>
        <div className="flex text-xs items-center justify-center">
          <IonButton size="small" shape="round" color="danger">
            <IonIcon slot="icon-only" icon={settingsOutline} />
          </IonButton>
        </div>
      </IonCol>
    </IonRow>
  );
}

export default ProfileHeader;
