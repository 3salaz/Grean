import { useEffect, useState } from "react";
import Profile from "../components/Layout/Tabs/Profile/Profile";
import Stats from "../components/Layout/Tabs/Stats/Stats";
import Map from "../components/Layout/Tabs/Map/Map";
import CreateProfile from "../components/Common/CreateProfile";
import { useAuthProfile } from "../context/AuthProfileContext";
import TabBar from "../components/Layout/TabBar";
import { IonPage, IonContent, IonModal, IonSpinner } from "@ionic/react";

function Account() {
  const { profile } = useAuthProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state

  let ActiveTab;

  useEffect(() => {
    if (
      profile &&
      (!profile.accountType ||
        profile.accountType === "" ||
        !profile.displayName ||
        profile.displayName === "" ||
        !profile.profilePic ||
        profile.profilePic === "")
    ) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [profile]);

  useEffect(() => {
    setLoading(true); // Start loading when tab changes

    // Simulate data fetching or initialization
    const loadTab = async () => {
      // Simulate a delay for data loading or WebGL initialization
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false); // End loading
    };

    loadTab();
  }, [activeTab]);

  switch (activeTab) {
    case 0:
      ActiveTab = Profile;
      break;
    case 1:
      ActiveTab = Map;
      break;
    case 2:
      ActiveTab = Stats;
      break;
    default:
      ActiveTab = Map;
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <IonPage className="container mx-auto">
      <IonModal isOpen={isModalOpen} onDidDismiss={handleCloseModal}>
        <CreateProfile handleClose={handleCloseModal} />
      </IonModal>
      <IonContent>
        {profile && profile.accountType && (
          <div className="h-[82svh] w-full relative">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <IonSpinner name="crescent" />
              </div>
            ) : (
              <ActiveTab />
            )}
          </div>
        )}
      </IonContent>
      <TabBar active={activeTab} setActive={setActiveTab} />
    </IonPage>
  );
}

export default Account;
