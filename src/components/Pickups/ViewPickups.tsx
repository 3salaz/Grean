import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonRow
} from "@ionic/react";
import {
  calendarNumberOutline,
  checkmarkCircleOutline,
  chevronForward,
  closeCircleOutline
} from "ionicons/icons";
import {usePickups} from "../../context/PickupsContext";
import {useEffect, useState} from "react";
import PickupDetails from "./PickupDetails";
import {useProfile} from "../../context/ProfileContext";

interface Pickup {
  id: string;
  addressData: {street: string; city: string};
  pickupDate: string;
  pickupTime: string;
  pickupNote?: string;
  isAccepted: boolean;
}

const ViewPickups: React.FC = () => {
  const {profile} = useProfile(); // Assuming you have a user context or similar
  const {fetchUserOwnedPickups} = usePickups(); // Assuming you have a function to fetch user pickups

  useEffect(() => {
    if (profile) {
      fetchUserOwnedPickups(profile.uid);
    }
  }, [profile, fetchUserOwnedPickups]);

  const {userOwnedPickups} = usePickups();

  // Internal state to manage modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);

  // Open modal with selected pickup details
  const openPickupDetailsModal = (pickup: Pickup) => {
    setSelectedPickup(pickup);
    setIsModalOpen(true);
  };

  // Close modal
  const closePickupDetailsModal = () => {
    setSelectedPickup(null);
    setIsModalOpen(false);
  };

  return (
    <IonCard className="w-full">
      {/* Pickup Details Modal (Managed Internally) */}
      <IonModal isOpen={isModalOpen} onDidDismiss={closePickupDetailsModal}>
        {selectedPickup && (
          <PickupDetails pickup={selectedPickup} handleClose={closePickupDetailsModal} />
        )}
      </IonModal>
      <IonCardHeader>
        <IonCardTitle color="sage" className="text-2xl font-bold text-orange ion-padding">
          My Pickups: {userOwnedPickups.length}
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList lines="none" className="w-full overflow-auto rounded-md ion-no-padding">
          <IonListHeader class="">
            <IonLabel className="text-2xl font-bold text-orange"></IonLabel>
          </IonListHeader>
          {userOwnedPickups.map((pickup) => (
            <IonItem key={pickup.id} className="w-full flex flex-col">
              <IonRow className="w-full py-2 ion-justify-content-start border-b-2 border-[#75b657] m-1">
                <IonCol size="1" className="flex items-center justify-center">
                  <IonIcon size="large" icon={calendarNumberOutline} />
                </IonCol>
                <IonCol size="10" className="pl-2 ion-align-self-center">
                  <div className="text-xs">
                    <strong>Date:</strong> {pickup.pickupDate}
                  </div>
                  <div className="text-xs">
                    <strong>Time:</strong> {pickup.pickupTime}
                  </div>
                </IonCol>

                <IonCol size="1" className="flex items-center">
                  <IonButton
                    fill="clear"
                    color="primary"
                    onClick={() => openPickupDetailsModal(pickup)}
                  >
                    <IonIcon color="primary" icon={chevronForward} />
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default ViewPickups;
