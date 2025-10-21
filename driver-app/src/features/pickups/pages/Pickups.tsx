// Full updated Pickups component with simplified layout and unified view control

import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonIcon,
} from "@ionic/react";
import { calendar, compassOutline, settings } from "ionicons/icons";
import { useProfile } from "@/context/ProfileContext";
import { usePickups } from "@/context/PickupsContext";
import { useUserLocations } from "@/hooks/useUserLocations";
import UserPickups from "@/features/pickups/components/UserPickups";
import DriverPickups from "@/features/pickups/components/DriverPickups";
import DriverRoutes from "@/features/pickups/components/DriverRoutes";
import { useIonLoading } from "@ionic/react";
import DriversScheduleCard from "@/features/pickups/components/DriversScheduleCard";

const Pickups: React.FC = () => {
  const [presentLoading, dismissLoading] = useIonLoading();
  const [mainView, setMainView] = useState<
    "UserPickupForm" | "UsersScheduleCard" | "DriversScheduleCard" | "DriverPickups" | "DriverRoutes" | null
  >(null);




  const { createPickup, fetchUserOwnedPickups, userOwnedPickups, availablePickups } = usePickups();
  const { profile } = useProfile();
  const locationIds = Array.isArray(profile?.locations) ? profile.locations : [];
  const { locations: userLocations } = useUserLocations(locationIds);

  useEffect(() => {
    if (profile?.uid) {
      fetchUserOwnedPickups(profile.uid);
    }
  }, [profile?.uid]);

  useEffect(() => {
    if (profile?.accountType) {
      setMainView(profile.accountType === "User" ? "UserPickupForm" : "DriverPickups");
    }
  }, [profile?.accountType]);


  if (!profile) {
    return (
      <IonGrid className="h-full flex items-center justify-center">
        <IonRow>
          <IonCol className="text-center">
            <IonButton color="primary" expand="block">Loading Profile...</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }

  const renderMainView = () => {
    switch (mainView) {
      case "DriversScheduleCard":
        return <DriversScheduleCard />;
      case "DriverRoutes":
        return <DriverRoutes />;
      case "DriverPickups":
        return <DriverPickups />;
      case "UserPickupForm":
      default:
        return (
          <DriverPickups/>
        );
    }
  };



  return (
    <IonGrid className="container h-full max-w-2xl mx-auto flex flex-col drop-shadow-xl md:py-4 md:rounded-md">
      <header>
        <IonRow id="pickups-header" className="border-b border-slate-200 w-full flex ion-padding">
          <IonCol size="12">
            <IonButton slot="icon-only" size="small"><IonIcon icon={settings} />
            </IonButton>
            <div className="text-sm">Hello there, {profile.displayName}</div>
          </IonCol>
        </IonRow>
      </header>

      <main id="pickups-mainView" className="ion-padding flex flex-col items-center flex-grow">
        {renderMainView()}
      </main>

      <footer id="pickups-footer">
        {profile.accountType === "User" ? (
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
        ) : (
          <IonRow className="gap-2 justify-center ion-padding">
            <IonCol size="auto">
              <IonButton
                size="small"
                fill={mainView === "DriverRoutes" ? "solid" : "clear"}
                onClick={() => setMainView("DriverRoutes")}
              >
                <IonIcon icon={compassOutline}></IonIcon>
              </IonButton>
            </IonCol>
            <IonCol size="auto" class="relative">
              {mainView === "DriverPickups" ?
                <span className="absolute top-[-25px] right-[0] w-full">
                  <div className="bg-white w-4 h-4 text-center rounded-full ion-padding flex items-center justify-center border-[#75B657] border-2 shadow-lg text-sm">
                    <div className="font-bold text-[#75B657]">
                      {availablePickups.length}
                    </div>

                  </div>
                </span>
                : <></>
              }
              <IonButton
                size="small"
                fill={mainView === "DriverPickups" ? "solid" : "clear"}
                onClick={() => setMainView("DriverPickups")}
              >
                View Pickups
              </IonButton>
            </IonCol>
            <IonCol size="auto">
              <IonButton
                size="small"
                fill={mainView === "DriversScheduleCard" ? "solid" : "clear"}
                onClick={() => setMainView("DriversScheduleCard")}
              >
                <IonIcon icon={calendar}></IonIcon>
              </IonButton>
            </IonCol>
          </IonRow>
        )}

      </footer>



    </IonGrid>
  );
};

export default Pickups;
