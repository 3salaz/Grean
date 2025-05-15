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
  IonModal,
} from "@ionic/react";
import { useEffect, useState, Suspense, lazy } from "react";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

// Lazy load components
const Profile = lazy(() => import("../components/Profile/Profile"));
const Pickups = lazy(() => import("../components/Pickups/Pickups"));
const Map = lazy(() => import("../components/Map/Map"));
const Stats = lazy(() => import("../components/Stats/Stats"));
const ProfileSetup = lazy(() => import("../components/Profile/ProfileSetup"));

type TabOption = "profile" | "pickups" | "map" | "stats";

interface AccountProps {
  activeTab: TabOption;
  setActiveTab: React.Dispatch<React.SetStateAction<TabOption>>;
}

const Account: React.FC<AccountProps> = ({activeTab, setActiveTab}) => {
  const { profile, setProfile } = useProfile();
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [showProfileSetup, setShowProfileSetup] = useState<boolean>(false);

  // Load tab content on change
  useEffect(() => {
    const loadTab = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    };
    loadTab();
  }, [activeTab]);

  // Tab persistence
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab") as TabOption;
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Open modal if no profile
  useEffect(() => {
    if (user && !profile) {
      setShowProfileSetup(true);
    }
  }, [user, profile]);

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
    // Ideally, re-fetch profile or trigger a refetch in ProfileContext
  };

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
        return <div>Invalid tab selected.</div>;
    }
  };

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        {loading ? (
          <IonGrid className="h-full ion-no-padding container mx-auto">
            <IonRow className="h-full">
              <IonCol className="flex items-center justify-center w-full h-full bg-white">
                <IonSpinner color="primary" name="crescent" />
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : (
          renderActiveTab()
        )}
      </IonContent>

      {/* Profile Setup Modal */}
      <IonModal isOpen={showProfileSetup}>
        <Suspense fallback={<IonSpinner />}>
          <ProfileSetup onComplete={handleProfileSetupComplete} />
        </Suspense>
      </IonModal>
      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />

    </IonPage>
  );
};

export default Account;
