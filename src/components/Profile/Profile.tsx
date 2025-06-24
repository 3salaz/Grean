
import ProfileHeader from "./ProfileHeader";
import MyForest from "./MyForest";
import MyLocations from "./MyLocations";
import Impact from "./Impact";
import { useProfile} from "../../context/ProfileContext";
import MyRoutes from "./MyRoutes";

const Profile: React.FC = () => {
  const { profile } = useProfile();

  return (

      <main className="container max-w-2xl mx-auto flex-grow overflow-auto ion-padding">
        <ProfileHeader profile={profile} />
        <MyForest />
        <Impact />
        {profile?.accountType === "User" && <MyLocations profile={profile} />}
        {profile?.accountType === "Driver" && <MyRoutes profile={profile} />}
      </main>
  );
};

export default Profile;