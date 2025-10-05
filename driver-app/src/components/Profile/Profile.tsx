
import ProfileHeader from "./ProfileHeader";
import MyForest from "./MyForest";
import MyRoutes from "./MyRoutes";
import { useProfile } from "../../context/ProfileContext";

const Profile: React.FC = () => {
  const { profile } = useProfile();

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto overflow-hidden">
      {/* Header Section (fixed height / auto) */}
      <section className="flex-none">
        <ProfileHeader profile={profile} />
      </section>

      {/* Forest Section (shrinks but keeps content visible) */}
      <section className="flex-none">
        <MyForest />
      </section>

      {/* Routes Section (fills the rest of the screen) */}
      <section className="flex-1 overflow-y-auto snap-start">
        <MyRoutes profile={profile} />
      </section>
    </main>
  );
};

export default Profile;
