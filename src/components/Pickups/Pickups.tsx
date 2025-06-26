// Full updated Pickups component with simplified layout and unified view control

import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonIcon,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle
} from "@ionic/react";
import { calendar, compassOutline, list } from "ionicons/icons";
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
import type { PickupData } from "../../types/pickups";
import UserScheduleCard from "../Common/UsersScheduleCard";
import DriversScheduleCard from "../Common/DriversScheduleCard";

const Pickups: React.FC = () => {
  const [presentLoading, dismissLoading] = useIonLoading();
  const [mainView, setMainView] = useState<
    "UserPickupForm" | "UsersScheduleCard" | "DriversScheduleCard" | "DriverPickups" | "DriverRoutes" | null
  >(null);


  const [formData, setFormData] = useState<PickupData>({
    pickupTime: "",
    addressData: { address: "" },
    materials: [],
    disclaimerAccepted: false,
  });

  const { createPickup, fetchUserOwnedPickups, userOwnedPickups } = usePickups();
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


  const handleSubmit = async () => {
    await presentLoading({ message: "Requesting pickup…", spinner: "crescent" });
    try {
      const activePickups = userOwnedPickups.filter(p => p.status === "pending" || p.status === "accepted");
      if (activePickups.length >= 2) {
        toast.error("You can only have 2 active pickups at a time.");
        return;
      }
      if (!formData.addressData.address || !formData.pickupTime || formData.materials.length === 0) {
        toast.error("Complete all required fields.");
        return;
      }
      const result = await createPickup(formData);
      if (result) {
        setFormData({
          pickupTime: dayjs().add(1, "day").hour(7).minute(0).second(0).toISOString(),
          addressData: { address: "" },
          materials: [],
          disclaimerAccepted: false
        });
      }
    } catch (err) {
      toast.error("Failed to submit pickup.");
    } finally {
      await dismissLoading();
    }
  };

  const handleChange = <K extends keyof typeof formData>(key: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

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
      case "DriversScheduleCard":
        return <DriversScheduleCard />;
      case "DriverRoutes":
        return <DriverRoutes />;
      case "DriverPickups":
        return <DriverPickups />;
      case "UserPickupForm":
      default:
        return (
          <UserPickups
            formData={formData}
            handleChange={handleChange}
            userLocations={userLocations}
            handleSubmit={handleSubmit}
            viewMode="form"
          />
        );
    }
  };



  return (
    <IonGrid className="container h-full max-w-2xl mx-auto flex flex-col drop-shadow-xl md:py-4 md:rounded-md">
      <IonRow className="border-b border-slate-200 w-full flex ion-padding">
        <IonCol size="12">
          <IonCardHeader>
            <IonCardTitle>Hello there, {profile.displayName}</IonCardTitle>
            <IonCardSubtitle></IonCardSubtitle>
          </IonCardHeader>
        </IonCol>
      </IonRow>
      <div className="ion-padding flex flex-col items-center flex-grow">
        {renderMainView()}
      </div>

      <IonRow className="gap-2 justify-center ion-padding">
        {profile.accountType === "User" ? (
          <>
            <IonCol size="auto">
              <IonButton
                size="small"
                fill={mainView === "UserPickupForm" ? "solid" : "outline"}
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
          </>
        ) : (
          <>
            <IonCol size="auto">
              <IonButton
                size="small"
                fill={mainView === "DriverRoutes" ? "solid" : "clear"}
                onClick={() => setMainView("DriverRoutes")}
              >
                <IonIcon icon={compassOutline}></IonIcon>
              </IonButton>
            </IonCol>
            <IonCol size="auto">
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
          </>
        )}
      </IonRow>



    </IonGrid>
  );
};

export default Pickups;
