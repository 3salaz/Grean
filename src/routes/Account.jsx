import { useEffect, useState } from "react";
import Profile from "../components/Layout/Tabs/Profile/Profile";
import Stats from "../components/Layout/Tabs/Stats/Stats";
import Map from "../components/Layout/Tabs/Map/Map";
import CreateProfile from "../components/Common/CreateProfile/CreateProfile";
import { useAuthProfile } from "../context/AuthProfileContext";
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
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import {
  navigateCircleOutline,
  personCircleOutline,
  statsChartOutline,
} from "ionicons/icons";

function Account() {
  const { profile } = useAuthProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("map"); // Default to Map tab
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (
      profile &&
      (!profile.accountType || !profile.displayName || !profile.profilePic)
    ) {
      setIsModalOpen(true); // Open modal if profile is incomplete
    } else {
      setIsModalOpen(false);
    }
  }, [profile]);

  useEffect(() => {
    setLoading(true);
    const loadTab = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
      setLoading(false);
    };
    loadTab();
  }, [activeTab]);

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal after profile is updated
  };

  // Component Mapping
  const renderActiveTab = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "map":
        return <Map />;
      case "stats":
        return <Stats />;
      default:
        return <Map />;
    }
  };

  return (
    <IonPage>
      <IonModal isOpen={isModalOpen} onDidDismiss={handleCloseModal}>
        <CreateProfile handleClose={handleCloseModal} />{" "}
        {/* Pass handleClose */}
      </IonModal>

      <IonContent color="light" className="flex flex-col h-full" scroll-y="false">
        {profile && profile.accountType && (
          <>
            {loading ? (
              <IonGrid className="h-full ion-no-padding">
                <IonRow className="h-full">
                  <IonCol className="flex items-center justify-center w-full h-full bg-white">
                    <IonSpinner color="primary" name="crescent" />
                  </IonCol>
                </IonRow>
              </IonGrid>
            ) : (
              renderActiveTab() // Render the active tab component
            )}
          </>
        )}
      </IonContent>
      <IonFooter>
        <IonToolbar
          color="secondary"
          className="flex items-center justify-center"
        >
          <IonSegment
            className="max-w-2xl mx-auto"
            value={activeTab}
            onIonChange={(e) => setActiveTab(e.detail.value)}
          >
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
    </IonPage>
  );
}

export default Account;
