import {
  IonPage,
  IonContent,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/react";
import { useEffect, useState, Suspense, lazy } from "react";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { useTab } from "../context/TabContext";
import { TabOption } from "../types/tabs";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

// Lazy load components
const Profile = lazy(() => import("../components/Profile/Profile"));
const Pickups = lazy(() => import("../components/Pickups/Pickups"));
const Map = lazy(() => import("../components/Map/Map"));
const Stats = lazy(() => import("../components/Stats/Stats"));

const Account = () => {
  const { profile } = useProfile();
  const { activeTab, setActiveTab } = useTab();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // 🔍 Debug logs
  console.log("profile:", profile);
  console.log("user:", user);

  // Restore tab from localStorage or set default
  useEffect(() => {
    const savedTab = (localStorage.getItem("activeTab") as TabOption) || "profile";
    setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    if (activeTab) localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Load tab content on tab change
  useEffect(() => {
    const loadTab = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    };
    loadTab();
  }, [activeTab]);

  // Show profile setup modal
  useEffect(() => {
    if (user && !profile) {
      setShowProfileSetup(true);
    }
  }, [user, profile]);

  // One-time welcome overlay
  useEffect(() => {
    const hasWelcomed = sessionStorage.getItem("hasWelcomedUser");
    if (user && !hasWelcomed) {
      setShowWelcome(true);
      sessionStorage.setItem("hasWelcomedUser", "true");
      setTimeout(() => setShowWelcome(false), 3000);
    }
  }, [user]);

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
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
        return <IonText className="text-center w-full p-4">Invalid tab selected.</IonText>;
    }
  };

  return (
    <IonPage>
      <Navbar />
      <IonContent className="relative bg-gradient-to-t from-grean to-blue-300">
        {showWelcome && (
          <IonGrid className="absolute top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <IonText className="text-2xl font-bold animate-fade-in-out">
              👋 Hello, {profile?.displayName || "there"}!
            </IonText>
          </IonGrid>
        )}

        {loading ? (
          <IonGrid className="h-full ion-no-padding container mx-auto">
            <IonRow className="h-full">
              <IonCol className="flex items-center justify-center w-full h-full bg-white">
                <IonSpinner color="primary" name="crescent" />
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : (
          <IonGrid className="h-full overflow-auto flex flex-col justify-end ion-no-padding bg-gradient-to-t from-grean to-blue-300">
              {renderActiveTab()}
          </IonGrid>
        )}
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default Account;
