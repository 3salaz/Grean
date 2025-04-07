import {
  IonButton,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonRow,
  IonText
} from "@ionic/react";
import {
  calendarNumberOutline,
  checkmarkCircleOutline,
  chevronForward,
  closeCircleOutline
} from "ionicons/icons";
import {usePickups} from "../../context/PickupsContext";
import {useEffect, useState} from "react";
import noPickupIcon from "../../assets/no-pickups.svg";
import {useAuth} from "../../context/AuthContext";

interface Pickup {
  id: string;
  addressData: {street: string; city: string};
  pickupDate: string;
  pickupTime: string;
  pickupNote?: string;
  isAccepted: boolean;
  materials: string[];
}

const PickupsQueue: React.FC = () => {
  const {visiblePickups, acceptPickup, removePickup} = usePickups();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);

  const openPickupDetailsModal = (pickup: Pickup) => {
    setSelectedPickup(pickup);
    setIsModalOpen(true);
  };

  const closePickupDetailsModal = () => {
    setSelectedPickup(null);
    setIsModalOpen(false);
  };

  console.log(visiblePickups);

  return (
    <>
      <IonList lines="none" className="w-full overflow-auto rounded-md">
        <IonListHeader className="ion-no-padding">
          <IonLabel className="text-2xl pl-4 font-bold text-orange">
            Available Pickups: {visiblePickups?.length || 0}
          </IonLabel>
        </IonListHeader>

        {Array.isArray(visiblePickups) && visiblePickups.length > 0 ? (
          visiblePickups.map((pickup) => (
            <IonItem key={pickup.id} className="w-full bg-white relative">
              <IonRow className="w-full py-2 ion-justify-content-start gap-1 border-b border-gray-200 m-1">
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
                    <strong>Street:</strong> {pickup.addressData.street}
                  </div>
                  <div className="text-xs">
                    <strong>City:</strong> {pickup.addressData.city}
                  </div>
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
          ))
        ) : (
          <IonItem lines="none">
            <IonRow className="ion-text-center w-full py-6">
              <IonCol size="12" className="flex flex-col items-center">
                <img
                  src={noPickupIcon}
                  alt="No pickups to display"
                  className="w-32 h-32 my-2"
                />
                <IonText className="text-base text-gray-500">
                  No pickups to display
                </IonText>
              </IonCol>
            </IonRow>
          </IonItem>
        )}
      </IonList>

      {/* Pickup Details Modal */}
      <IonModal isOpen={isModalOpen} onDidDismiss={closePickupDetailsModal}>
        {selectedPickup && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Pickup Details</h2>
            <p>
              <strong>Address:</strong> {selectedPickup.addressData.street},{" "}
              {selectedPickup.addressData.city}
            </p>
            <p>
              <strong>Date:</strong> {selectedPickup.pickupDate}
            </p>
            <p>
              <strong>Time:</strong> {selectedPickup.pickupTime}
            </p>
            {selectedPickup.pickupNote && (
              <p>
                <strong>Note:</strong> {selectedPickup.pickupNote}
              </p>
            )}
            <div className="mt-4">
              <strong>Materials:</strong>
              <ul className="list-disc list-inside">
                {selectedPickup.materials.map((material, index) => (
                  <li key={index}>{material}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between mt-6 gap-2">
              <IonButton
                expand="block"
                onClick={() => {
                  acceptPickup(selectedPickup.id);
                  closePickupDetailsModal();
                }}
              >
                Accept
              </IonButton>
              <IonButton
                expand="block"
                color="danger"
                onClick={() => {
                  removePickup(selectedPickup.id);
                  closePickupDetailsModal();
                }}
              >
                Remove
              </IonButton>
            </div>

            <div className="mt-4 text-right">
              <IonButton onClick={closePickupDetailsModal} fill="clear">
                Close
              </IonButton>
            </div>
          </div>
        )}
      </IonModal>
    </>
  );
};

export default PickupsQueue;
