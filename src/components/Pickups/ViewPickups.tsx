import {
  IonButton,
  IonCol,
  IonIcon,
  IonModal,
  IonRow,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardContent
} from "@ionic/react";
import {closeCircleOutline} from "ionicons/icons";

interface Pickup {
  id: string;
  addressData: {street: string; city: string};
  pickupDate: string;
  pickupTime: string;
  pickupNote?: string;
  isAccepted: boolean;
}

interface ViewPickupsProps {
  isOpen: boolean;
  selectedPickup: Pickup | null;
  profile: {
    uid: string;
    displayName?: string;
    email?: string;
    profilePic?: string;
    accountType?: "User" | "Driver";
  };
  onClose: () => void;
  onAcceptPickup: (pickupId: string) => void;
}

const ViewPickups: React.FC<ViewPickupsProps> = ({
  isOpen,
  selectedPickup,
  profile,
  onClose,
  onAcceptPickup
}) => {
  if (!selectedPickup) return null;

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <main className="container mx-auto h-full flex items-center justify-center bg-grean">
        <div className="bg-white shadow-xl rounded-md">
          <IonRow className="text-center ion-padding">
            <IonCol size="12">
              <IonCard className="px-16 shadow-none">
                <IonCardHeader>
                  <IonText className="text-xl font-bold">
                    Pickup Details
                  </IonText>
                </IonCardHeader>
                <IonCardContent className=" p-2 pickup-details bg-orange-300">
                  <p>
                    <strong className="underline">Address:</strong>
                    <br />
                    {selectedPickup.addressData.street},{" "}
                    {selectedPickup.addressData.city}
                  </p>
                  <p>
                    <strong className="underline">Date:</strong>
                    <br />
                    {new Date(selectedPickup.pickupDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric"
                      }
                    )}
                  </p>
                  <p>
                    <strong className="underline">Time:</strong>
                    <br />
                    {new Date(
                      `1970-01-01T${selectedPickup.pickupTime}Z`
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    })}
                  </p>
                  <p>
                    <strong className="underline">Pickup Note:</strong>
                    <br />
                    {selectedPickup.pickupNote || "None"}
                  </p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            {profile?.accountType === "User" ? (
              <IonCol size="auto" className="mx-auto flex">
                <IonButton expand="block" color="secondary">
                  Edit Pickup
                </IonButton>
                <IonButton expand="block" color="danger" onClick={onClose}>
                  <IonIcon slot="icon-only" icon={closeCircleOutline} />
                </IonButton>
              </IonCol>
            ) : (
              <IonCol size="auto" className="mx-auto flex">
                <IonButton
                  expand="block"
                  color="primary"
                  onClick={() => onAcceptPickup(selectedPickup.id)}
                >
                  Accept Pickup
                </IonButton>
                <IonButton expand="block" color="danger" onClick={onClose}>
                  <IonIcon slot="icon-only" icon={closeCircleOutline} />
                </IonButton>
              </IonCol>
            )}
          </IonRow>
        </div>
      </main>
    </IonModal>
  );
};

export default ViewPickups;
