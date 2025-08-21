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
import CreatePickup from "./CreatePickup";
import Schedule from "../Map/Schedule";
import { useProfile } from "../../context/ProfileContext";
import { usePickups } from "../../context/PickupsContext";
import { useUserLocations } from "../../hooks/useUserLocations";
import UserPickups from "./UserPickups";
import DriverPickups from "./DriverPickups";
import DriverRoutes from "./DriverRoutes";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useIonLoading } from "@ionic/react";
import UserScheduleCard from "../Common/UsersScheduleCard";
import DriversScheduleCard from "../Common/DriversScheduleCard";

const Pickups: React.FC = () => {
  const [mainView, setMainView] = useState<
    "UserPickupForm" | "UsersScheduleCard" | "DriversScheduleCard" | "DriverPickups" | "DriverRoutes" | null
  >(null);




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
            <IonButton color="primary" expand="block">Loading Profile...</IonButton>
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
        return (
          <UserPickups
            userLocations={userLocations}
          />
        );
    }
  };



  return (
    <IonGrid className="container h-full max-w-2xl mx-auto flex flex-col drop-shadow-xl md:py-4 md:rounded-md">
      <header className="ion-padding-horizontal">
        <IonRow id="pickups-header" className="border-b border-slate-200 w-full flex justify-between ion-padding-vertical">
          <IonCol size="auto" className="flex flex-col items-center">
            <div className="text-md text-[#75B657] font-bold bg-white px-4 py-1 rounded-2xl">Hi, {profile.displayName}</div>
            <div className="text-sm px-2 font-semibold pt-2">{profile.accountType}</div>
          </IonCol>
          <IonCol size="auto" className="flex items-end">
            <IonButton color="danger" shape="round" size="small">
              <IonIcon slot="icon-only" icon={settings} />
            </IonButton>
          </IonCol>
        </IonRow>
        <IonRow>

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
