import { useEffect, useState } from "react";
import Profile from "../components/Layout/Tabs/Profile/Profile";
import Stats from "../components/Layout/Tabs/Stats/Stats";
import Map from "../components/Layout/Tabs/Map/Map";
import CreateProfile from "../components/Common/CreateProfile/CreateProfile";
import { useAuthProfile } from "../context/AuthProfileContext";
// import TabBar from "../components/Layout/TabBar";
import {
  IonPage,
  IonContent,
  IonModal,
  IonSpinner,
  IonFooter,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import {
  navigateCircleOutline,
  personCircleOutline,
  statsChartOutline,
} from "ionicons/icons";

function Account() {
  const { profile } = useAuthProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState();

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
    case "profile":
      ActiveTab = Profile;
      break;
    case "map":
      ActiveTab = Map;
      break;
    case "stats":
      ActiveTab = Stats;
      break;
    default:
      ActiveTab = Map;
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <IonPage className="mx-auto">
      <IonModal isOpen={isModalOpen} onDidDismiss={handleCloseModal}>
        <CreateProfile handleClose={handleCloseModal} />
      </IonModal>
      <IonContent>
        {profile && profile.accountType && (
          <div className="h-[84svh] w-full">
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
      <IonFooter>
        <IonToolbar color="primary" className="h-[8svh] mx-auto flex items-center justify-center rounded-t-lg px-2">
          <IonSegment className="max-w-2xl mx-auto" value={activeTab} onIonChange={(e) => setActiveTab(e.detail.value)}>
            <IonSegmentButton value="profile">
              <IonLabel>Profile</IonLabel>
              <IonIcon icon={personCircleOutline}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton value="map">
              <IonLabel>Map</IonLabel>
              <IonIcon icon={navigateCircleOutline}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton value="stats">
              <IonLabel>Stats</IonLabel>
              <IonIcon icon={statsChartOutline}></IonIcon>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonFooter>
      {/* <TabBar active={activeTab} setActive={setActiveTab} /> */}
    </IonPage>
  );
}

export default Account;
