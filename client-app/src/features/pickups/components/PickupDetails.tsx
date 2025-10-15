import React, {useState} from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import {closeOutline} from "ionicons/icons";
import {Pickup, usePickups} from "@/context/PickupsContext";
import {useProfile} from "@/context/ProfileContext";
import Navbar from "@/app/layouts/Navbar";
import {toast} from "react-toastify";

interface PickupDetailsProps {
  pickup: Pickup;
  handleClose: () => void;
}

const PickupDetails: React.FC<PickupDetailsProps> = ({pickup, handleClose}) => {
  const {updatePickup} = usePickups();
  const {profile, updateProfile} = useProfile();
  const [accepting, setAccepting] = useState(false); // Loading state

  const acceptPickup = async () => {
    if (!profile) {
      console.error("User not logged in");
      toast.error("You must be logged in to accept a pickup.");
      return;
    }

    if (!pickup?.id) {
      console.error("Pickup ID is missing");
      toast.error("Invalid pickup details.");
      return;
    }

    setAccepting(true); // Start loading state
    try {
      // Update the pickup
      await updatePickup(pickup.id, {
        acceptedBy: profile.uid,
        isAccepted: true
      });

      // Update the user's profile
      await updateProfile("pickups", pickup.id, "addToArray");

      toast.success("Pickup accepted successfully!");
      handleClose(); // Close the modal
    } catch (error) {
      console.error("❌ Error accepting pickup:", error);
      toast.error("Failed to accept pickup. Please try again.");
    } finally {
      setAccepting(false); // End loading state
    }
  };

  if (!pickup) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Pickup Details</IonTitle>
            <IonButton slot="end" fill="clear" onClick={handleClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>No pickup details available.</p>
          <IonButton expand="block" color="primary" onClick={handleClose}>
            Close
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <Navbar />
        {/* <IonToolbar>
          <IonTitle>Pickup Details</IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleClose}>
            <IonIcon icon={closeOutline} />
          </IonButton>
        </IonToolbar> */}
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid className="h-full flex flex-col gap-8">
          <IonCard className="ion-padding flex-grow">
            <IonCardHeader>
              <IonCardSubtitle>{pickup.id}</IonCardSubtitle>
              <IonCardTitle>{pickup.pickupDate}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="ion-no-padding">
              <IonList>
                <IonItem>
                  <IonLabel>Created by: {pickup.createdBy.displayName}</IonLabel>
                </IonItem>
                <IonListHeader>
                  <IonLabel>Pickup Material</IonLabel>
                </IonListHeader>
                {pickup.materials.map((material, index) => (
                  <IonItem key={index}>
                    <IonLabel>{material}</IonLabel>
                  </IonItem>
                ))}
                <IonListHeader>
                  <IonLabel>Pickup Notes</IonLabel>
                </IonListHeader>
                <IonItem>{pickup.pickupNote}</IonItem>
              </IonList>
              <div></div>
            </IonCardContent>
          </IonCard>
          <IonRow>
            <IonCol size="12" className="flex flex-col gap-2 max-w-xs mx-auto">
              {profile?.accountType === "Driver" && (
                <div className="bg-white">
                  <IonButton
                    expand="block"
                    color="primary"
                    size="small"
                    onClick={acceptPickup}
                    disabled={pickup.isAccepted || accepting}
                  >
                    {accepting ? "Accepting..." : pickup.isAccepted ? "Already Accepted" : "Accept"}
                  </IonButton>
                  <IonButton size="small" expand="block" color="warning">
                    Decline
                  </IonButton>
                </div>
              )}

              <IonButton size="small" expand="block" color="danger" onClick={handleClose}>
                Close
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default PickupDetails;
