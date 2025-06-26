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
import { usePickups } from "../../context/PickupsContext";
import type { MaterialType } from "../../types/pickups";
import { useProfile } from "../../context/ProfileContext";
import dayjs from "dayjs";
import noPickupIcon from "../../assets/no-pickups.svg";
import { useAuth } from "../../context/AuthContext";

const DriverPickups: React.FC = () => {
  const { user } = useAuth();
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
      <div className="flex-none ion-padding">
        <IonCardHeader className="drop-shadow-none">
          <IonCardTitle>
            {availablePickups.length === 0
              ? "No Pickups"
              : `Pickups (${availablePickups.length})`}
          </IonCardTitle>
          <IonCardSubtitle>Current Pickups Available</IonCardSubtitle>
        </IonCardHeader>
      </div>

      {/* Scrollable main content */}
      <div className="flex-grow overflow-auto ion-padding-vertical">
        {acceptingPickupId ? (
          <div className="flex h-full items-center justify-center bg-white rounded-md">
            <IonText className="text-base font-medium text-gray-700 mr-2">Accepting...</IonText>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : availablePickups.length > 0 ? (
          <IonAccordionGroup className="bg-white rounded-md" expand="compact">
            {availablePickups.map((pickup) => (
              <IonAccordion key={pickup.id} value={pickup.id}>
                <IonItem slot="header" className="bg-red-400">
                  <IonCol>
                    <IonText className="text-sm font-medium block">
                      {dayjs(pickup.pickupTime).format("dddd, MMM D • h:mm A")}
                    </IonText>
                    <div className="text-xs text-slate-200">{pickup.addressData.address}</div>
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
          <div className="flex flex-col h-full items-center justify-center bg-white rounded-md p-4">
            <img src={noPickupIcon} alt="No pickups" className="w-16 h-16" />
            <IonText className="text-base text-gray-500 font-bold">No pickups to display</IonText>
          </div>
        )}
      </div>
    </div>
  );
};


export default DriverPickups;
