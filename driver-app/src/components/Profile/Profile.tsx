
import ProfileHeader from "./ProfileHeader";
import MyForest from "./MyForest";
import MyLocations from "./MyLocations";
import Impact from "./Impact";
import { useProfile } from "../../context/ProfileContext";

const Profile: React.FC = () => {
  const { profile } = useProfile();

  return (

    <main className="container max-w-2xl mx-auto flex-grow overflow-auto snap-y snap-mandatory h-screen">
      <ProfileHeader profile={profile} />
      <MyForest />
      <Impact />
      <MyLocations profile={profile} />
    </main>
  );
};

export default Profile;