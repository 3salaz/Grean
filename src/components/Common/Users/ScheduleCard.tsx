import {
  IonAccordion, IonAccordionGroup, IonButton, IonCard, IonCardHeader,
  IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonInput,
  IonItem, IonLabel, IonRow, IonText
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useProfile } from '../../../context/ProfileContext';
import { usePickups } from '../../../context/PickupsContext';
import { formatDateInfo } from '../../../utils/dateUtils';
import noPickupsIcon from '../../../assets/no-pickups.svg';
import { toast } from 'react-toastify';

const statuses = ["pending", "accepted", "inProgress", "cancelled", "completed"] as const;

function ScheduleCard() {
  const { userAssignedPickups, userOwnedPickups, fetchUserOwnedPickups, fetchUserAssignedPickups, updatePickup } = usePickups();
  const { profile } = useProfile();
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});
  const allStatuses = ["pending", "accepted", "inProgress", "completed", "cancelled"];
  const driverStatuses = ["accepted"];
  const userStatuses = ["pending", "accepted", "inProgress", "completed"];



  useEffect(() => {
    if (profile?.uid) {
      if (profile.accountType === "User") {
        fetchUserOwnedPickups(profile.uid);
      } else {
        fetchUserAssignedPickups(profile.uid); // 🔑 this is missing
      }
    }
  }, [profile?.uid, profile?.accountType]);


  const relevantPickups = profile?.accountType === "User"
    ? userOwnedPickups
    : userAssignedPickups;

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

  const handleCancelPickup = async (pickupId: string) => {
    try {
      await updatePickup(pickupId, {
        acceptedBy: "",
        status: "pending",
      });
      toast.success("Pickup has been reset to pending.");
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error("Failed to cancel the pickup.");
    }
  };



  const activeStatuses = profile?.accountType === "User"
    ? userStatuses
    : driverStatuses;

  const handleStartPickup = async (pickupId: string) => {
    try {
      await updatePickup(pickupId, { status: "inProgress" });
    } catch (err) {
      console.error("Failed to start pickup:", err);
    }
  };

  // User-view pickup item
  const renderUserPickupItem = (pickup: any) => {
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
              {pickup.materials.map((m: { type: string; weight: number }) => (
                <IonCol size="12" sizeMd="6" key={m.type}>
                  <IonInput
                    label={`${m.type.charAt(0).toUpperCase() + m.type.slice(1)} (lbs)`}
                    value={formData[pickup.id]?.[`${m.type}Weight`] || ""}
                    onIonChange={(e) =>
                      handleInputChange(pickup.id, `${m.type}Weight`, e.detail.value!)
                    }
                  />
                </IonCol>
              ))}

            </IonRow>
            <IonRow className="gap-2 ion-padding-top">
              <IonCol size="auto">
                <IonButton expand="block" color="primary" size="small">Edit Pickup</IonButton>
              </IonCol>
              <IonCol size="auto">
                <IonButton expand="block" color="danger" size="small">Delete Pickup</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonAccordion>
    );
  };
  // Driver-view pickup item
  const renderDriverPickupItem = (pickup: any) => {

    const { dayOfWeek, monthName, day, year } = formatDateInfo(pickup.pickupTime);
    return (
      <IonAccordion key={pickup.id} value={pickup.id} className="rounded-md my-1">
        <IonItem slot="header" className="ml-0 pl-0">
          <IonLabel className="m-0">
            <IonText><h2>{`${dayOfWeek}, ${monthName} ${day}, ${year}`}</h2></IonText>
            <IonText className="text-xs">{pickup.addressData.address || "Unknown Address"}</IonText>
          </IonLabel>
        </IonItem>
        <div slot="content" className="border-t-2 border-[#75B657]">
          <IonGrid className="ion-padding">
            <IonRow><IonCol><IonText>Notes: {pickup.pickupNote || "No Notes"}</IonText></IonCol></IonRow>
            <IonRow><IonCol><IonText>
              Materials:{" "}
              {pickup.materials.map((mat: { type: string; weight: number }) => `${mat.type} (${mat.weight} lbs)`).join(", ")}
            </IonText></IonCol></IonRow>
            <IonRow className="gap-2 ion-padding-top">
              <IonCol size="auto">
                {pickup.status !== "inProgress" && (
                  <IonButton
                    expand="block"
                    color="primary"
                    size="small"
                    onClick={() => handleStartPickup(pickup.id)}
                  >
                    Start Pickup
                  </IonButton>
                )}

              </IonCol>
              <IonCol size="auto">
                <IonButton expand="block" color="danger" size="small" onClick={() => handleCancelPickup(pickup.id)}>Cancel Pickup</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonAccordion>
    );
  }

  return (
    <IonCard className="w-full h-full bg-[#75B657] flex flex-col shadow-lg">
      <IonCardHeader className="ion-padding">
        <IonCardTitle>
          {relevantPickups.length === 0
            ? "No Pickups"
            : `Pickups: (${relevantPickups.length})`}
        </IonCardTitle>
        <IonCardSubtitle className="text-white">
          {profile?.accountType === "User"
            ? "View or edit your pickups below"
            : "Your assigned pickups"}
        </IonCardSubtitle>
      </IonCardHeader>

      <main className="flex flex-col bg-white flex-grow justify-center items-center overflow-auto">
        <div className="h-full w-full flex flex-col overflow-auto">
          {relevantPickups.length === 0 ? (
            <div className="h-full flex items-center justify-center ion-padding">
              <img src={noPickupsIcon} alt="No pickups" className="w-32 h-32 my-2" />
              <IonText className="text-base text-gray-500 font-bold">No pickups to display</IonText>
            </div>
          ) : (
            activeStatuses.map(status => (
              <IonAccordionGroup key={status} multiple className="flex flex-col flex-grow ion-padding rounded-md">
                <IonItem lines="full" color="light">
                  <IonLabel><h2 className="capitalize">{`${status} (${pickupsByStatus[status].length})`}</h2></IonLabel>
                </IonItem>
                {pickupsByStatus[status].length > 0 ? (
                  pickupsByStatus[status].map(p =>
                    profile?.accountType === "User"
                      ? renderUserPickupItem(p)
                      : renderDriverPickupItem(p)
                  )
                ) : (
                  <IonItem lines="none">
                    <IonLabel>No {status} pickups</IonLabel>
                  </IonItem>
                )}
              </IonAccordionGroup>
            ))
          )}
        </div>
      </main>
    </IonCard>
  );
}

export default ScheduleCard;
