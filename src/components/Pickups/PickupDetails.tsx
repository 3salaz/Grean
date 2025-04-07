import React from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import {closeOutline} from "ionicons/icons";

interface Pickup {
  id: string;
  addressData: {address: string};
  pickupDate: string;
  pickupTime: string;
  pickupNote?: string;
  isAccepted: boolean;
}

interface PickupDetailsProps {
  pickup: Pickup;
  onClose: () => void;
}

const PickupDetails: React.FC<PickupDetailsProps> = ({pickup, onClose}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pickup Details</IonTitle>
          <IonButton slot="end" fill="clear" onClick={onClose}>
            <IonIcon icon={closeOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Pickup Information</h2>
        <p>
          <strong>Date:</strong> {pickup.pickupDate}
        </p>
        <p>
          <strong>Time:</strong> {pickup.pickupTime}
        </p>
        <p>
          <strong>Address:</strong> {pickup.addressData.address},{" "}
        </p>
        {pickup.pickupNote && (
          <p>
            <strong>Note:</strong> {pickup.pickupNote}
          </p>
        )}
        <p>
          <strong>Status:</strong>{" "}
          {pickup.isAccepted ? "Accepted" : "Not Accepted"}
        </p>
        <IonButton expand="block" color="primary" onClick={onClose}>
          Close
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PickupDetails;
