import { useState } from "react";
import AddLocation from "./AddLocation";
import ProfileLocations from "./ProfileLocations";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { IonHeader } from "@ionic/react";
import avatar from "../../../../assets/avatar.svg";
import userIcon from "../../../../assets/icons/user.png";
import driverIcon from "../../../../assets/icons/driver.png"
import { IonModal, IonContent } from "@ionic/react";

function Profile() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { profile } = useAuthProfile();

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const getUserRoleInfo = () => {
    switch (profile?.accountType) {
      case "Driver":
        return { icon: driverIcon, text: "Driver" };
      case "User":
        return { icon: userIcon, text: "User" };
      default:
        return { icon: "person-outline", text: "null" };
    }
  };
  const userRoleInfo = getUserRoleInfo();

  return (
    <IonContent
      id="profile"
      className="w-full h-full z-20 flex flex-col items-center justify-start relative"
    >
      <IonModal
        isOpen={isModalVisible}
        onDidDismiss={handleCloseModal}
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        <AddLocation handleClose={handleCloseModal} />
      </IonModal>

      <IonHeader className="w-full h-[10%] flex items-center justify-between bg-slate-800">
        <div className="flex items-center justify-between gap-2 h-full container mx-auto px-2">
          <div className="flex items-center justify-center">
          <img
            className="rounded-full h-14 aspect-square bg-white"
            alt="profilePic"
            src={profile.profilePic || avatar}
          />
          <div className="flex flex-col items-start justify-center h-full">
            <div className="text-large font-bold text-white">
              {profile.displayName}
            </div>
            <p className="text-xs bg-grean text-white font-bold rounded-lg p-2">
              ID: {profile.email}
            </p>
          </div>
          </div>

          <div className="bg-white aspect-square w-14 h-14 flex flex-col items-center justify-center rounded-md p-3 drop-shadow-lg">
            <img className="w-10" src={userRoleInfo.icon} alt="User Icon"></img>
            <span className="text-sm">{userRoleInfo.text}</span>
          </div>
        </div>
      </IonHeader>

      <main className="w-full h-[88%] flex flex-col justify-between container mx-auto relative">
        {profile.accountType === "User" && <ProfileLocations />}

        {profile.accountType === "Driver" && (
          <IonContent className="w-full h-full flex flex-col justify-between gap-2 container mx-auto">
            <div
              id="DriverDetails"
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none no-scroll p-4 gap-4 bg-orange"
            >
              Driver Content Goes Here
            </div>
          </IonContent>
        )}
      </main>
    </IonContent>
  );
}

export default Profile;
