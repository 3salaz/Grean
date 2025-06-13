import React from "react";
import {
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonSpinner
} from "@ionic/react";
import { usePickups } from "../../context/PickupsContext";
import { useProfile } from "../../context/ProfileContext";
import dayjs from "dayjs";

const DriverPickups: React.FC = () => {
  const { profile } = useProfile();
  const { availablePickups, updatePickup } = usePickups();
  const [acceptingPickupId, setAcceptingPickupId] = React.useState<string | null>(null);

  const handleAcceptPickup = async (pickupId: string) => {
    if (!profile?.uid) return;
    setAcceptingPickupId(pickupId);
    try {
      await updatePickup(pickupId, {
        acceptedBy: profile.uid
      });
      // Optional: update driver state or profile
    } catch (err) {
      console.error("Error accepting pickup", err);
    } finally {
      setAcceptingPickupId(null);
    }
  };

  return (
    <section className="flex-grow ion-padding-vertical overflow-auto flex flex-col justify-end">
      <IonRow className="ion-padding-bottom">
        <IonCol>
          <IonText className="text-xl font-semibold text-gray-800">Available Pickups</IonText>
        </IonCol>
      </IonRow>

      {acceptingPickupId ? (
        <IonRow className="w-full h-full justify-center items-center">
          <IonCol className="flex justify-center">
            <IonText className="text-base font-medium text-gray-700 mr-2">Accepting...</IonText>
            <IonSpinner name="crescent" color="primary" />
          </IonCol>
        </IonRow>
      ) : availablePickups.length > 0 ? (
        availablePickups.map((pickup) => (
          <IonRow key={pickup.id} className="mb-4 p-2 border border-gray-200 rounded-md bg-white">
            <IonCol size="12">
              <IonText className="font-medium text-base text-xs">
                {pickup.addressData?.address || "No address"}
              </IonText>
              <p className="text-gray-800">
                {dayjs(pickup.pickupTime).format("dddd, MMM D • h:mm A")}
              </p>
              <p className="text-sm">
                Materials: {pickup.materials.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}
              </p>
            </IonCol>
            <IonCol size="12" className="flex justify-start ion-padding-top">
              <IonButton
                size="small"
                color="success"
                onClick={() => handleAcceptPickup(pickup.id)}
              >
                Accept
              </IonButton>
            </IonCol>
          </IonRow>
        ))
      ) : (
        <IonRow className="flex-grow">
          <IonCol className="flex items-center justify-center">
            <IonText className="text-gray-500 font-bold">No pickups available right now.</IonText>
          </IonCol>
        </IonRow>
      )}
    </section>
  );
};

export default DriverPickups;
