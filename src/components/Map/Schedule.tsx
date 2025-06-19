import React, { useEffect, useState } from "react";
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle,
  IonButton, IonItem, IonLabel, IonInput,
  IonGrid, IonRow, IonCol, IonText, IonFooter,
  IonAccordionGroup, IonAccordion, IonCard,
  IonCardHeader, IonCardTitle, IonCardSubtitle
} from "@ionic/react";
import noPickupIcon from "../../assets/no-pickups.svg";
import { usePickups } from "../../context/PickupsContext";
import { formatDateInfo } from "../../utils/dateUtils";
import { useProfile } from "../../context/ProfileContext";
import ScheduleCard from "../Common/Users/ScheduleCard";

interface ScheduleProps {
  handleClose: () => void;
}

const statuses = ["pending", "inProgress", "completed", "cancelled"] as const;

function Schedule({ handleClose }: ScheduleProps) {
  const { userAssignedPickups, userOwnedPickups, fetchUserOwnedPickups } = usePickups();
  const { profile } = useProfile();
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    if (profile?.uid) fetchUserOwnedPickups(profile.uid);
  }, [profile?.uid]);

  const relevantPickups = profile?.accountType === "User"
    ? userOwnedPickups
    : userAssignedPickups;

  // Group pickups by status, guaranteeing each status exists
  const pickupsByStatus: Record<string, typeof relevantPickups> =
    relevantPickups.reduce((acc, p) => {
      acc[p.status] = acc[p.status] || [];
      acc[p.status].push(p);
      return acc;
    }, {} as Record<string, typeof relevantPickups>);

  statuses.forEach(s => { if (!pickupsByStatus[s]) pickupsByStatus[s] = []; });

  const handleInputChange = (pickupId: string, name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [pickupId]: { ...(prev[pickupId] || {}), [name]: value }
    }));
  };

  const renderPickupItem = (pickup: any) => {
    const { dayOfWeek, monthName, day, year } = formatDateInfo(pickup.pickupTime);
    return (
      <IonAccordion key={pickup.id} value={pickup.id} className="rounded-md my-1">
        <IonItem color="primary" slot="header" className="ml-0 pl-0">
          <IonLabel className="m-0">
            <IonText><h2>{`${dayOfWeek}, ${monthName} ${day}, ${year}`}</h2></IonText>
            <IonText className="text-xs">{pickup.addressData.address || "Unknown Address"}</IonText>
          </IonLabel>
        </IonItem>
        <div slot="content" className="border-t-2 border-[#75B657]">
          <IonGrid className="ion-padding">
            <IonRow><IonCol><IonText>Pickup Notes: {pickup.pickupNote || "No Notes"}</IonText></IonCol></IonRow>
            <IonRow>
              {pickup.materials.map((material: { type: string; weight: number }) => (
                <IonCol size="12" sizeMd="6" key={material.type}>
                  <IonInput
                    label={`${material.type.charAt(0).toUpperCase() + material.type.slice(1)} (lbs)`}
                    value={formData[pickup.id]?.[`${material.type}Weight`] || ""}
                    onIonChange={e => handleInputChange(pickup.id, `${material.type}Weight`, e.detail.value!)}
                  />
                </IonCol>
              ))}

            </IonRow>
            <IonRow className="gap-2 ion-padding-top">
              <IonCol size="auto">
                <IonButton expand="block" color="primary" size="small">
                  {profile?.accountType === "User" ? "Edit Pickup" : "Begin Pickup"}
                </IonButton>
              </IonCol>
              {profile?.accountType !== "User" && (
                <IonCol size="auto">
                  <IonButton expand="block" color="danger" size="small">
                    Cancel Pickup
                  </IonButton>
                </IonCol>
              )}
            </IonRow>
          </IonGrid>
        </div>
      </IonAccordion>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="text-center">
            {relevantPickups.length === 0
              ? "No Pickups"
              : `Scheduled Pickups (${relevantPickups.length})`}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" className="flex items-center justify-center">
        <IonGrid className="h-full flex flex-col items-center justify-center ion-padding">
          <ScheduleCard />
        </IonGrid>
      </IonContent>

      <IonFooter>
        <IonRow className="ion-justify-content-center ion-padding bg-[#75B657]">
          <IonCol size="auto">
            <IonButton color="danger" shape="round" size="small" fill="solid" onClick={handleClose}>
              Close
            </IonButton>
          </IonCol>
        </IonRow>
      </IonFooter>
    </IonPage>
  );
}

export default Schedule;
