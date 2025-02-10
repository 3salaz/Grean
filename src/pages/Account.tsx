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
import { useProfile } from "../context/ProfileContext";
import { UserProfile } from "../context/ProfileContext";
import {
  leafOutline,
  navigateCircleOutline,
  personCircleOutline,
  statsChartOutline,
} from "ionicons/icons";

// Lazy load components and define types
const Profile = lazy(() => import("../components/Layout/Tabs/Profile/Profile")) as React.ComponentType<{ profile: UserProfile | null }>;
const Pickups = lazy(() => import("../components/Layout/Tabs/Pickups/Pickups")) as React.ComponentType<{ profile: UserProfile | null }>;
const Map = lazy(() => import("../components/Layout/Tabs/Map/Map")) as React.ComponentType<{ profile: UserProfile | null }>;
const Stats = lazy(() => import("../components/Layout/Tabs/Stats/Stats")) as React.ComponentType<{ profile: UserProfile | null }>;

// Define tab options
type TabOption = "profile" | "pickups" | "map" | "stats";

const Account: React.FC = () => {
  const { profile }: { profile: UserProfile | null } = useProfile(); // Get profile from context
  const [activeTab, setActiveTab] = useState<TabOption>("profile"); // Default tab
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const loadTab = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
      setLoading(false);
    };
    loadTab();
  }, [activeTab, profile]);

  // Function to render active tab component
  const renderActiveTab = () => {
    switch (activeTab) {
      case "profile":
        return (
          <Suspense fallback={<IonSpinner />}>
            
            <Profile profile={profile} />
          </Suspense>
        );
      case "pickups":
        return (
          <Suspense fallback={<IonSpinner />}>
            <Pickups profile={profile} />
          </Suspense>
        );
      case "map":
        return (
          <Suspense fallback={<IonSpinner />}>
            <Map profile={profile} />
          </Suspense>
        );
      case "stats":
        return (
          <Suspense fallback={<IonSpinner />}>
            <Stats profile={profile} />
          </Suspense>
        );
      default:
        return <div>Invalid tab selected.</div>; // Fallback for invalid tabs
    }
  };

  return (
    <IonPage>
      <IonContent scroll-y="false" className="flex flex-col h-full">
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
            onIonChange={(e: CustomEvent) => setActiveTab(e.detail.value as TabOption)}
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
};

export default Account;
