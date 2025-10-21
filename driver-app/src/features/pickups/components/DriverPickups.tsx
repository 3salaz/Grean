import React from "react";
import {
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonSpinner,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonAccordionGroup,
  IonAccordion,
  IonItem
} from "@ionic/react";
import { usePickups } from "@/context/PickupsContext";
import { useProfile } from "@/context/ProfileContext";
import dayjs from "dayjs";
import noPickupIcon from "@/assets/no-pickups.svg";
import PickupInProgress from "./PickupInProgress";

const DriverPickups: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const { availablePickups, updatePickup } = usePickups();
  const [acceptingPickupId, setAcceptingPickupId] = React.useState<string | null>(null);
  const [weights, setWeights] = React.useState<Record<string, Record<string, string>>>({});

  const handleWeightChange = (pickupId: string, materialType: string, value: string) => {
    setWeights(prev => ({
      ...prev,
      [pickupId]: {
        ...(prev[pickupId] || {}),
        [materialType]: value
      }
    }));
  };

  const handleAcceptPickup = async (pickupId: string) => {
    if (!profile?.uid) return;
    setAcceptingPickupId(pickupId);

    try {
      // 1. Update the pickup itself
      await updatePickup(pickupId, {
        acceptedBy: {
          uid: profile.uid,
          displayName: profile.displayName,
          email: profile.email,
          photoURL: profile.photoURL,
        },
        status: "accepted"
      });

      // 2. Add pickupId to driver's profile
      await updateProfile("pickups", pickupId, "addToArray");
    } catch (err) {
      console.error("Error accepting pickup", err);
    } finally {
      setAcceptingPickupId(null);
    }
  };


  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <header className="flex-none ion-padding">
        <IonCardHeader className="drop-shadow-none">
          <IonCardTitle>
            {availablePickups.length === 0
              ? "No Pickups"
              : `Pickups (${availablePickups.length})`}
          </IonCardTitle>
          <IonCardSubtitle className="text-white">Current Pickups Available</IonCardSubtitle>
        </IonCardHeader>
      </header>

      {/* Scrollable main content */}
      <main className="flex-grow overflow-auto ion-padding-vertical flex flex-col justify-between gap-2">
        {acceptingPickupId ? (
          <div className="flex h-full items-center justify-center bg-white rounded-md">
            <IonText className="text-base font-medium text-gray-700 mr-2">Accepting...</IonText>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : availablePickups.length > 0 ? (
          <IonAccordionGroup className="flex flex-col gap-1 justify-end h-full bg-white/40 rounded-md p-2" expand="compact">
            {availablePickups.map((pickup) => (
              <IonAccordion className="rounded-md" key={pickup.id} value={pickup.id}>
                <IonItem slot="header">
                  <IonCol>
                    <IonText className="text-sm font-medium block">
                      {dayjs(pickup.pickupTime).format("dddd, MMM D • h:mm A")}
                    </IonText>
                    <p className="text-xs text-gray-500">
                      {pickup.addressData?.address?.split(",").slice(0, 2).join(", ") || "Unknown Address"}
                    </p>
                  </IonCol>
                </IonItem>
                <div slot="content" className="ion-padding bg-slate-50 border-t border-gray-300">
                  <div className="text-xs">
                    {pickup.materials.map(m => m.type.charAt(0).toUpperCase() + m.type.slice(1)).join(", ")}
                  </div>
                  <IonButton
                    size="small"
                    color="success"
                    onClick={() => handleAcceptPickup(pickup.id)}
                  >
                    Accept
                  </IonButton>
                </div>
              </IonAccordion>
            ))}
          </IonAccordionGroup>
        ) : (
          <IonAccordionGroup className="flex flex-col gap-1 justify-center items-center w-full h-full bg-white/40 rounded-md p-2">
            <img src={noPickupIcon} alt="No pickups" className="w-16 h-16" />
            <IonText className="text-base text-gray-500 font-bold">No pickups to display</IonText>
          </IonAccordionGroup>
        )}

        <PickupInProgress />
      </main>
    </div>
  );
};


export default DriverPickups;
