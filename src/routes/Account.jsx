import {
  IonPage,
  IonContent,
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
import { useEffect, useState, Suspense, lazy } from "react";
import CreateProfile from "../components/Common/CreateProfile/CreateProfile";
import { useAuthProfile } from "../context/AuthProfileContext";
import {
  leafOutline,
  navigateCircleOutline,
  personCircleOutline,
  statsChartOutline,
} from "ionicons/icons";

// Lazy load components
const Profile = lazy(() => import("../components/Layout/Tabs/Profile/Profile"));
const Stats = lazy(() => import("../components/Layout/Tabs/Stats/Stats"));
const Map = lazy(() => import("../components/Layout/Tabs/Map/Map"));
const Pickups = lazy(() => import("../components/Layout/Tabs/Pickups/Pickups"));

function Account() {
  const { profile } = useAuthProfile(); // Get profile from context
  const [activeTab, setActiveTab] = useState("profile"); // Default tab
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (!profile) return; // Skip loading if profile doesn't exist

    // Simulate loading delay
    const loadTab = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
      setLoading(false);
    };
    loadTab();
  }, [activeTab, profile]);

  const renderActiveTab = () => {
    if (!profile) return <CreateProfile />; // Render CreateProfile if profile is missing

    switch (activeTab) {
      case "profile":
        return (
          <Suspense fallback={<IonSpinner />}>
            <Profile />
          </Suspense>
        );
      case "pickups":
        return (
          <Suspense fallback={<IonSpinner />}>
            <Pickups />
          </Suspense>
        );
      case "map":
        return (
          <Suspense fallback={<IonSpinner />}>
            <Map />
          </Suspense>
        );
      case "stats":
        return (
          <Suspense fallback={<IonSpinner />}>
            <Stats />
          </Suspense>
        );
      default:
        return <div>Invalid tab selected.</div>; // Fallback for invalid tabs
    }
  };

  return (
    <IonPage>
      <IonContent className="flex flex-col h-full">
        {loading ? (
          <IonGrid className="h-full ion-no-padding container mx-auto">
            <IonRow className="h-full">
              <IonCol className="flex items-center justify-center w-full h-full bg-white">
                <IonSpinner color="primary" name="crescent" />
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : (
          renderActiveTab() // Render the active tab component
        )}
      </IonContent>

      <IonFooter className="h-[8svh] flex items-center justify-center border-t-grean border-t-2">
        <IonToolbar
          color="secondary"
          className="flex items-center justify-center h-full"
        >
          <IonSegment
            className="max-w-2xl mx-auto"
            value={activeTab}
            onIonChange={(e) => setActiveTab(e.detail.value)}
          >
            <IonSegmentButton value="profile" aria-label="Profile Tab">
              <IonLabel className="text-xs">Profile</IonLabel>
              <IonIcon icon={personCircleOutline}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton value="pickups" aria-label="Pickups Tab">
              <IonLabel className="text-xs">Pickups</IonLabel>
              <IonIcon icon={leafOutline}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton value="map" aria-label="Map Tab">
              <IonLabel className="text-xs">Map</IonLabel>
              <IonIcon icon={navigateCircleOutline}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton value="stats" aria-label="Stats Tab">
              <IonLabel className="text-xs">Stats</IonLabel>
              <IonIcon icon={statsChartOutline}></IonIcon>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}

export default Account;
