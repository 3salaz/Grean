import { useAuthProfile } from "../../context/AuthProfileContext";
import { IonHeader } from "@ionic/react";
import avatar from "../../assets/avatar.svg";
import userIcon from "../../assets/icons/user.png";
import driverIcon from "../../assets/icons/driver.png";
import { Link } from "react-router-dom";
import { settingsOutline } from "ionicons/icons";

function UserHeader() {
  const { profile } = useAuthProfile();
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
    <IonHeader className="w-full h-[12%] flex items-center justify-between bg-slate-800 p-4">
      <div className="flex items-center justify-center gap-2 h-full">
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
    </IonHeader>
  );
}

export default UserHeader;
