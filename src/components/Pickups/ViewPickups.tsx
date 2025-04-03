import {
  IonButton,
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
import {useState} from "react";
import PickupDetails from "./PickupDetails";

interface Pickup {
  id: string;
  addressData: {street: string; city: string};
  pickupDate: string;
  pickupTime: string;
  pickupNote?: string;
  isAccepted: boolean;
}

const ViewPickups: React.FC = () => {
  const {userCreatedPickups} = usePickups();

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
    <>
      <IonList lines="none" className="w-full overflow-auto rounded-md">
        <IonListHeader>
          <IonLabel className="text-2xl pl-4 font-bold text-orange">
            My Pickups: {userCreatedPickups.length}
          </IonLabel>
        </IonListHeader>
        {userCreatedPickups.map((pickup) => (
          <IonItem key={pickup.id} className="w-full bg-orange relative">
            <IonRow className="w-full py-2 ion-justify-content-start gap-1 border-b-2 border-[#75b657] m-1">
              <IonCol
                size="1"
                className="flex flex-col items-end justify-center"
              >
                <IonIcon
                  icon={
                    pickup.isAccepted
                      ? checkmarkCircleOutline
                      : closeCircleOutline
                  }
                />
              </IonCol>
              <IonCol size="1" className="flex items-center justify-center">
                <IonIcon size="large" icon={calendarNumberOutline} />
              </IonCol>
              <IonCol size="8" className="pl-2 ion-align-self-center">
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

      {/* Pickup Details Modal (Managed Internally) */}
      <IonModal isOpen={isModalOpen} onDidDismiss={closePickupDetailsModal}>
        {selectedPickup && (
          <PickupDetails
            pickup={selectedPickup}
            onClose={closePickupDetailsModal}
          />
        )}
      </IonModal>
    </>
  );
};

export default ViewPickups;
