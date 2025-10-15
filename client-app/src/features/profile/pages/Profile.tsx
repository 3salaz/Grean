
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import MyForest from "@/features/profile/components/MyForest";
import MyLocations from "@/features/profile/components/MyLocations";
import Impact from "@/features/profile/components/Impact";
import { useProfile } from "@/context/ProfileContext";

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

        <div className="snap-start">
          <MyLocations profile={profile} />
        </div>

    </main>
  );
};

export default Profile;