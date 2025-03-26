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
  IonModal
} from "@ionic/react";
import {useEffect, useState, Suspense, lazy} from "react";
import {useProfile} from "../context/ProfileContext";
import {
  leafOutline,
  navigateCircleOutline,
  personCircleOutline,
  statsChartOutline
} from "ionicons/icons";
import {useAuth} from "../context/AuthContext"; // Import useAuth

// Lazy load components
const Profile = lazy(() => import("../components/Profile/Profile"));
const Pickups = lazy(() => import("../components/Pickups/Pickups"));
const Map = lazy(() => import("../components/Map/Map"));
const Stats = lazy(() => import("../components/Stats/Stats"));
const ProfileSetup = lazy(() => import("../components/Profile/ProfileSetup"));

type TabOption = "profile" | "pickups" | "map" | "stats";

const Account: React.FC = () => {
  const {profile, createProfile, updateProfile} = useProfile(); // Add createProfile
  const {user} = useAuth(); // Get currentUser from useAuth
  const [activeTab, setActiveTab] = useState<TabOption>("profile");
  const [loading, setLoading] = useState<boolean>(true);
  const [showProfileSetup, setShowProfileSetup] = useState<boolean>(false);

  useEffect(() => {
    const loadTab = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
      setLoading(false);
    };
    loadTab();
  }, [activeTab]);

  useEffect(() => {
    const ensureProfile = async () => {
      if (user && !profile) {
        try {
          await createProfile({
            displayName: `user${Math.floor(Math.random() * 10000)}`,
            email: user.email || "",
            photoURL: "",
            uid: user.uid,
            locations: [],
            pickups: [],
            accountType: "user"
          });
        } catch (error) {
          console.error("Error creating profile:", error);
        }
      }
    };

    ensureProfile();
  }, [user, profile, createProfile]);

  // Open modal if displayName is missing
  useEffect(() => {
    if (profile && !profile.displayName) {
      setShowProfileSetup(true);
    } else {
      setShowProfileSetup(false);
    }
  }, [profile]);

  // ✅ Correctly update displayName and close modal
  const handleProfileSave = async (displayName: string) => {
    if (!profile?.uid) return; // Ensure profile exists

    try {
      await updateProfile("displayName", displayName, "update"); // Save to Firestore
      setShowProfileSetup(false); // Close modal after successful save
    } catch (error) {
      console.error("Error updating profile:", error);
    }
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
          renderActiveTab()
        )}
      </IonContent>

      {/* Profile Setup Modal */}
      <IonModal isOpen={showProfileSetup} backdropDismiss={false}>
        <Suspense fallback={<IonSpinner />}>
          <ProfileSetup onSave={handleProfileSave} />
        </Suspense>
      </IonModal>

      <IonFooter className="h-[8svh] flex items-center justify-center border-t-green border-t-2">
        <IonToolbar
          color="secondary"
          className="flex items-center justify-center h-full"
        >
          <IonSegment
            className="max-w-2xl mx-auto"
            value={activeTab}
            onIonChange={(e: CustomEvent) =>
              setActiveTab(e.detail.value as TabOption)
            }
          >
            <IonSegmentButton value="profile">
              <IonLabel className="text-xs">Profile</IonLabel>
              <IonIcon icon={personCircleOutline}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton value="pickups">
              <IonLabel className="text-xs">Pickups</IonLabel>
              <IonIcon icon={leafOutline}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton value="map">
              <IonLabel className="text-xs">Map</IonLabel>
              <IonIcon icon={navigateCircleOutline}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton value="stats">
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
