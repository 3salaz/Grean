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
import {Pickup, usePickups} from "@/context/PickupsContext";
import {useState} from "react";
import noPickupIcon from "../../assets/no-pickups.svg";
import PickupDetails from "./PickupDetails";

const PickupsQueue: React.FC = () => {
  const {availablePickups} = usePickups();
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);

  type ModalKeys = "pickupDetailsOpen";

  const [modalState, setModalState] = useState<Record<ModalKeys, boolean>>({
    pickupDetailsOpen: false
  });

  const openModal = (modalName: ModalKeys) => {
    setModalState((prev) => ({...prev, [modalName]: true}));
  };

  const closeModal = (modalName: ModalKeys) => {
    setModalState((prev) => ({...prev, [modalName]: false}));
  };

  return (
    <>
      <IonList lines="none" className="w-full overflow-auto rounded-md ">
        <IonListHeader className="ion-padding flex flex-col">
          <IonLabel className="text-2xl pl-4 font-bold ">
            Available Pickups: {availablePickups?.length || 0}
          </IonLabel>
          <p className="text-xs pl-4">Select a pickup to view details</p>
        </IonListHeader>

        {availablePickups.length > 0 ? (
          availablePickups.map((pickup) => (
            <IonItem key={pickup.id} className="w-full bg-white relative">
              <IonRow className="w-full py-2 ion-justify-content-start gap-1 border-b border-gray-200 m-1">
                <IonCol size="1" className="flex flex-col items-end justify-center">
                  <IonIcon icon={pickup.isAccepted ? checkmarkCircleOutline : closeCircleOutline} />
                </IonCol>
                <IonCol size="1" className="flex items-center justify-center">
                  <IonIcon size="large" icon={calendarNumberOutline} />
                </IonCol>
                <IonCol size="8" className="pl-2 ion-align-self-center">
                  <div className="text-xs">
                    <strong>Street:</strong> {pickup.addressData.address}
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
                    onClick={() => {
                      setSelectedPickup(pickup); // Set the selected pickup first
                      openModal("pickupDetailsOpen"); // Then open the modal
                    }}
                  >
                    <IonIcon color="primary" icon={chevronForward} />
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonItem>
          ))
        ) : (
          <IonRow className="ion-text-center ion-justify-content-center w-full">
            <IonCol size="12" className="flex flex-col justify-center items-center">
              <img src={noPickupIcon} alt="No pickups to display" className="w-32 h-32 my-2" />
              <IonText className="text-base text-gray-500">No pickups to display</IonText>
            </IonCol>
          </IonRow>
        )}
      </IonList>

      {/* Pickup Details Modal */}
      <IonModal isOpen={modalState.pickupDetailsOpen}>
        <PickupDetails
          pickup={selectedPickup}
          handleClose={() => closeModal("pickupDetailsOpen")}
        />
      </IonModal>
    </>
  );
};

export default PickupsQueue;
