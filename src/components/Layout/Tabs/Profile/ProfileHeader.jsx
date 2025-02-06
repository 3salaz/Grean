import { useState } from "react";
import {
  IonButton,
  IonCol,
  IonIcon,
  IonRow,
  IonText,
  IonSpinner,
} from "@ionic/react";
import userIcon from "../../../../assets/icons/user.png";
import { addCircleOutline, settingsOutline } from "ionicons/icons";

function ProfileHeader({ profile }) {

  // State to check image loading status
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Debugging
  // console.log("Profile Data:", profile);
  // console.log("Profile Picture URL:", profile?.profilePic);

  return (
    <IonRow className="ion-align-items-end gap-2 ion-padding rounded-t-lg ion-justify-content-between bg-white">

      {/* Profile Info Section */}
      <IonCol size="auto" className="flex justify-end  rounded-md bg-grean bg-opacity-80">
        {/* Profile Image Section */}
        <div className="h-full w-16 aspect-square rounded-full overflow-hidden flex items-center justify-center relative">
          {isImageLoading && (
            <IonSpinner
              name="crescent"
              className="absolute w-16 h-16 text-gray-400"
            />
          )}
          <img
            className={`object-cover w-16 h-16 p-2  rounded-full transition-opacity duration-500 ${
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

        <div className="flex p-2 flex-col items-start justify-end rounded-lg">
          <IonText className="text-xl font-bold">
            {profile?.displayName || "User Name"}
          </IonText>
          <IonText className="text-xs bg-green-50 font-bold rounded-lg">
            Email: {profile?.email || "No Email"}
          </IonText>
        </div>
      </IonCol>

      {/* Action Buttons */}
      <IonCol size="auto" className="flex flex-col items-end justify-end">
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
