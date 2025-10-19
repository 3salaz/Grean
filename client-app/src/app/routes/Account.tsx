import {
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { useEffect, useState, Suspense, lazy } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useAuth } from "@/context/AuthContext";
import { useTab } from "@/context/TabContext";
import { TabOption } from "@/types/tabs";
import { ToastContainer } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

// Lazy-loaded pages
const Profile = lazy(() => import("@/features/profile/pages/Profile"));
const Pickups = lazy(() => import("@/features/pickups/pages/Pickups"));
const Map = lazy(() => import("@/features/map/pages/Map"));
const Stats = lazy(() => import("@/features/stats/pages/Stats"));

const Account: React.FC = () => {
  const { activeTab, setActiveTab } = useTab();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const savedTab = (localStorage.getItem("activeTab") as TabOption) || "profile";
    setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    if (activeTab) localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const loadTab = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    };
    loadTab();
  }, [activeTab]);

  useEffect(() => {
    const hasWelcomed = sessionStorage.getItem("hasWelcomedUser");
    if (user && !hasWelcomed) {
      setShowWelcome(true);
      sessionStorage.setItem("hasWelcomedUser", "true");
      setTimeout(() => setShowWelcome(false), 1000);
    }
  }, [user]);

  const renderActiveTab = () => {
    const fallback = <IonSpinner name="crescent" color="primary" />;
    if (!profile) return null;

    switch (activeTab) {
      case "profile":
        return <Suspense fallback={fallback}><Profile /></Suspense>;
      case "pickups":
        if (
          (Array.isArray(profile.locations) && profile.locations.length > 0) ||
          profile.accountType === "Driver"
        ) {
          return <Suspense fallback={fallback}><Pickups /></Suspense>;
        }
        return (
          <IonText className="text-center w-full p-4">
            📍 Please add at least one location to request pickups.
          </IonText>
        );
      case "map":
        return <Suspense fallback={fallback}><Map /></Suspense>;
      case "stats":
        return profile.stats ? (
          <Suspense fallback={fallback}><Stats /></Suspense>
        ) : (
          <IonText className="text-center w-full p-4">
            📊 No stats available yet. Complete a pickup to get started!
          </IonText>
        );
      default:
        return <IonText className="text-center w-full p-4">Invalid tab selected.</IonText>;
    }
  };

  return (
    <div className="relative h-full max-w-full bg-gradient-to-t from-grean to-blue-300">
      {/* Toast */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
      />

      {/* Welcome animation */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
          >
            <IonText className="text-2xl font-bold animate-fade-in-out">
              👋 Hello, {profile?.displayName || "there"}!
            </IonText>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {loading ? (
        <IonGrid className="h-full ion-no-padding">
          <IonRow className="h-full">
            <IonCol className="flex items-center justify-center h-full bg-white">
              <IonSpinner color="primary" name="crescent" />
            </IonCol>
          </IonRow>
        </IonGrid>
      ) : (
        <IonGrid className="h-full overflow-auto ion-no-padding">
          {renderActiveTab()}
        </IonGrid>
      )}
    </div>
  );
};

export default Account;
