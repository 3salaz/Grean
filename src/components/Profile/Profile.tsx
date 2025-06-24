
import ProfileHeader from "./ProfileHeader";
import MyForest from "./MyForest";
import MyLocations from "./MyLocations";
import Impact from "./Impact";
import { useProfile } from "../../context/ProfileContext";
import MyRoutes from "./MyRoutes";

const Profile: React.FC = () => {
  const { profile } = useProfile();

  return (

    <main className="container max-w-2xl mx-auto flex-grow overflow-auto snap-y snap-mandatory h-screen">
      <div className="snap-start">
        <ProfileHeader profile={profile} />
      </div>
      <div className="snap-start">
        <MyForest />
      </div>
      <div className="snap-start">
        <Impact />
      </div>
      {profile?.accountType === "User" && (
        <div className="snap-start">
          <MyLocations profile={profile} />
        </div>
      )}
      {profile?.accountType === "Driver" && (
        <div className="snap-start">
          <MyRoutes profile={profile} />
        </div>
      )}

    </main>
  );
};

export default Profile;