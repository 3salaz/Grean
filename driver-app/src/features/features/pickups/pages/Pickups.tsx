import React, {useEffect, useState} from "react";
import {IonButton, IonCol, IonGrid, IonRow, IonIcon} from "@ionic/react";
import {calendar, settings} from "ionicons/icons";
import {useProfile} from "@/context/ProfileContext";
import {usePickups} from "@/context/PickupsContext";
import {useUserLocations} from "@/hooks/useUserLocations";
import UserPickups from "@/features/pickups/components/UserPickups";
import UserScheduleCard from "@/features/pickups/components/UsersScheduleCard";

const Pickups: React.FC = () => {
  const [mainView, setMainView] = useState<"UserPickupForm" | "UsersScheduleCard" | null>(null);

  const { fetchUserOwnedPickups } = usePickups();
  const { profile } = useProfile();
  const locationIds = Array.isArray(profile?.locations) ? profile.locations : [];
  const { locations: userLocations } = useUserLocations(locationIds);

  useEffect(() => {
    if (profile?.uid) {
      fetchUserOwnedPickups(profile.uid);
    }
  }, [profile?.uid]);


  if (!profile) {
    return (
      <IonGrid className="h-full flex items-center justify-center">
        <IonRow>
          <IonCol className="text-center">
            <IonButton color="primary" expand="block">
              Loading Profile...
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }

  const renderMainView = () => {
    switch (mainView) {
      case "UsersScheduleCard":
        return <UserScheduleCard />;
      case "UserPickupForm":
      default:
        return <UserPickups userLocations={userLocations} />;
    }
  };

  return (
    <IonGrid className="container h-full max-w-2xl mx-auto flex flex-col drop-shadow-xl md:py-4 md:rounded-md">
      <header>
        <IonRow id="pickups-header" className="border-b border-slate-200 w-full flex ion-padding">
          <IonCol size="12">
            <IonButton slot="icon-only" size="small">
              <IonIcon icon={settings} />
            </IonButton>
            <div className="text-sm">Hello there, {profile.displayName}</div>
          </IonCol>
        </IonRow>
      </header>

      <main id="pickups-mainView" className="ion-padding flex flex-col items-center flex-grow">
        {renderMainView()}
      </main>
      
      <footer id="pickups-footer">
          <IonRow className="gap-2 justify-center ion-padding">
            <IonCol size="auto">
              <IonButton
                size="small"
                fill={mainView === "UserPickupForm" ? "solid" : "clear"}
                onClick={() => setMainView("UserPickupForm")}
              >
                Request Pickup
              </IonButton>
            </IonCol>
            <IonCol size="auto">
              <IonButton
                size="small"
                fill={mainView === "UsersScheduleCard" ? "solid" : "clear"}
                onClick={() => setMainView("UsersScheduleCard")}
              >
                <IonIcon icon={calendar}></IonIcon>
              </IonButton>
            </IonCol>
          </IonRow>
      </footer>
    </IonGrid>
  );
};

export default Pickups;
