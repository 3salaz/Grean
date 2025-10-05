import React, {useEffect, useState} from "react";
import {IonButton, IonCol, IonGrid, IonRow, IonIcon, IonSpinner} from "@ionic/react";
import {calendar, compassOutline, settings} from "ionicons/icons";
import {useProfile} from "../../context/ProfileContext";
import {usePickups} from "../../context/PickupsContext";
import {useIonLoading} from "@ionic/react";
import DriverPickups from "./DriverPickups";
import DriverRoutes from "./DriverRoutes";
import DriversScheduleCard from "../Common/DriversScheduleCard";

const Pickups: React.FC = () => {
  const [presentLoading, dismissLoading] = useIonLoading();
  const [mainView, setMainView] = useState<
    "DriverPickups" | "DriverRoutes" | "DriversScheduleCard"
  >("DriverPickups");

  const {fetchUserOwnedPickups, availablePickups} = usePickups();
  const {profile} = useProfile();

  // ✅ Load driver’s pickups when profile is available
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
            <IonSpinner name="crescent" color="primary" />
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }

  const renderMainView = () => {
    switch (mainView) {
      case "DriverRoutes":
        return <DriverRoutes />;
      case "DriversScheduleCard":
        return <DriversScheduleCard />;
      case "DriverPickups":
      default:
        return <DriverPickups />;
    }
  };

  return (
    <IonGrid className="container h-full max-w-2xl mx-auto flex flex-col drop-shadow-xl md:py-4 md:rounded-md">
      {/* Header */}
      <IonRow
        id="pickups-header"
        className="border-b border-slate-200 w-full flex ion-padding items-center justify-between"
      >
        <IonCol size="auto">
          <div className="text-sm font-medium text-gray-700">
            👋 Hello, {profile.displayName || "Driver"}
          </div>
        </IonCol>
        <IonCol size="auto">
          <IonButton size="small" fill="clear">
            <IonIcon icon={settings} />
          </IonButton>
        </IonCol>
      </IonRow>

      {/* Main View */}
      <main id="pickups-mainView" className="ion-padding flex flex-col items-center flex-grow">
        {renderMainView()}
      </main>

      {/* Footer Navigation */}
      <footer id="pickups-footer">
        <IonRow className="gap-4 justify-center ion-padding">
          {/* Routes */}
          <IonCol size="auto">
            <IonButton
              size="small"
              fill={mainView === "DriverRoutes" ? "solid" : "clear"}
              onClick={() => setMainView("DriverRoutes")}
            >
              <IonIcon icon={compassOutline} />
            </IonButton>
          </IonCol>

          {/* Pickups (with badge count) */}
          <IonCol size="auto" className="relative">
            {availablePickups?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white w-5 h-5 flex items-center justify-center rounded-full border-[#75B657] border-2 shadow text-xs font-bold text-[#75B657]">
                {availablePickups.length}
              </span>
            )}
            <IonButton
              size="small"
              fill={mainView === "DriverPickups" ? "solid" : "clear"}
              onClick={() => setMainView("DriverPickups")}
            >
              Pickups
            </IonButton>
          </IonCol>

          {/* Schedule */}
          <IonCol size="auto">
            <IonButton
              size="small"
              fill={mainView === "DriversScheduleCard" ? "solid" : "clear"}
              onClick={() => setMainView("DriversScheduleCard")}
            >
              <IonIcon icon={calendar} />
            </IonButton>
          </IonCol>
        </IonRow>
      </footer>
    </IonGrid>
  );
};

export default Pickups;
