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
import { useProfile, UserProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { useTab } from "../context/TabContext";
import { TabOption } from "../types/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToastContainer } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

// Lazy load components
const Profile = lazy(() => import("../components/Profile/Profile"));
const Pickups = lazy(() => import("../components/Pickups/Pickups"));
const Map = lazy(() => import("../components/Map/Map"));
const Stats = lazy(() => import("../components/Stats/Stats"));

const Account: React.FC = () => {

  const { activeTab, setActiveTab } = useTab();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);


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
      setTimeout(() => setShowWelcome(false), 1000);
    }
  }, [user]);

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
  };

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
        if (profile.stats) {
          return <Suspense fallback={fallback}><Stats /></Suspense>;
        }
        return (
          <IonText className="text-center w-full p-4">
            📊 No stats available yet. Complete a pickup to get started!
          </IonText>
        );

      default:
        return (
          <IonText className="text-center w-full p-4">
            Invalid tab selected.
          </IonText>
        );
    }
  };


  return (
    <IonPage>

      <Navbar />

      <IonContent scrollY={false} className="relative bg-gradient-to-t from-grean to-blue-300">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="!z-[999] mt-[50px]" // Adjust the margin-top based on your navbar height
        />
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
              onAnimationComplete={() => {
                // Ensure we hide the welcome overlay from React after animation ends
                setShowWelcome(false);
              }}
            >
              <IonText className="text-2xl font-bold animate-fade-in-out">
                👋 Hello, {profile?.displayName || "there"}!
              </IonText>
            </motion.div>
          )}
        </AnimatePresence>


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
