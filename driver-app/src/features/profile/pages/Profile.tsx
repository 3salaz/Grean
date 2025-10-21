
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import MyForest from "@/features/profile/components/MyForest";
import MyRoutes from "@/features/profile/components/MyRoutes";
import { useProfile } from "@/context/ProfileContext";
import { IonRow } from "@ionic/react";


const Profile: React.FC = () => {
  const {profile} = useProfile();

  return (
    <main id="profileTab" className="mx-auto max-w-6xl flex-grow overflow-auto snap-y snap-mandatory h-full ion-padding flex flex-col gap-2">
      <ProfileHeader profile={profile} />
      <IonRow className="gap-2 flex">
        <MyForest />
        <MyRoutes profile={profile} />
      </IonRow>
    </main>
  );
};

export default Profile;