import React, {useEffect, useState} from "react";
import {IonButton, IonCol, IonGrid, IonRow, IonIcon, IonText} from "@ionic/react";
import {calendar, settings} from "ionicons/icons";
import {useProfile} from "../../context/ProfileContext";
import {usePickups} from "../../context/PickupsContext";
import {useUserLocations} from "../../hooks/useUserLocations";
import UserPickups from "./UserPickups";
import UserScheduleCard from "../Common/UsersScheduleCard";

const Pickups: React.FC = () => {
  const [mainView, setMainView] = useState<"UserPickupForm" | "UsersScheduleCard">(
    "UserPickupForm"
  );

  const {fetchUserOwnedPickups} = usePickups();
  const {profile} = useProfile();
  const locationIds = Array.isArray(profile?.locations) ? profile.locations : [];
  const {locations: userLocations} = useUserLocations(locationIds);

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

  return (
    <IonGrid className="container h-full max-w-2xl mx-auto flex flex-col drop-shadow-xl md:py-4 md:rounded-md">
      {/* Header */}
      <header className="ion-padding-horizontal">
        <IonRow
          id="pickups-header"
          className="border-b border-slate-200 w-full flex justify-between items-center ion-padding shadow-none"
        >
          <IonCol size="auto" className="flex flex-col items-center">
            <IonText className="text-md text-[#75B657] border-[#75B657] border-1 font-bold bg-white px-4 py-1 rounded-2xl">
              {profile.displayName}
            </IonText>
            <div className="text-sm px-2 font-semibold pt-2">{profile.accountType}</div>
          </IonCol>

          <IonCol size="auto" className="flex">
            <IonButton color="light" shape="round" size="small">
              <IonIcon color="primary" slot="icon-only" icon={settings} />
            </IonButton>
          </IonCol>
        </IonRow>
      </header>

      {/* Main */}
      <main
        id="pickups-mainView"
        className="ion-padding flex flex-col flex-grow overflow-y-auto w-full"
      >
        {mainView === "UsersScheduleCard" ? (
          <UserScheduleCard />
        ) : (
          <UserPickups userLocations={userLocations} />
        )}
      </main>

      {/* Footer */}
      <footer id="pickups-footer">
        <IonRow className="gap-4 justify-center ion-padding">
          {/* Request Pickups */}
          <IonCol size="auto" className="text-center">
            <IonButton
              className="pb-1"
              fill={mainView === "UserPickupForm" ? "solid" : "clear"}
              onClick={() => setMainView("UserPickupForm")}
            >
              Request Pickups
            </IonButton>
            {mainView === "UserPickupForm" && (
              <div className="w-full h-1 bg-[#75B657] rounded-full"></div>
            )}
          </IonCol>

          {/* Schedule */}
          <IonCol size="auto" className="text-center">
            <IonButton
              className="pb-1"
              fill={mainView === "UsersScheduleCard" ? "solid" : "clear"}
              onClick={() => setMainView("UsersScheduleCard")}
            >
              <IonIcon icon={calendar} />
            </IonButton>
            {mainView === "UsersScheduleCard" && (
              <div className="w-full h-1 bg-[#75B657] rounded-full"></div>
            )}
          </IonCol>
        </IonRow>
      </footer>
    </IonGrid>
  );
};

export default Pickups;
