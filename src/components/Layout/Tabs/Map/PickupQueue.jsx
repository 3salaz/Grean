import { usePickups } from "../../../../context/PickupsContext";
import noPickupIcon from "../../../../assets/no-pickups.svg";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
  IonListHeader,
  IonAccordionGroup,
  IonAccordion,
  IonButtons,
  IonCard,
} from "@ionic/react";
import { checkmarkCircle, closeOutline } from "ionicons/icons";

function PickupQueue({ handleClose }) {
  const { visiblePickups, acceptPickup, removePickup } = usePickups();

  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert hour 0 to 12
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <IonPage>
      <IonHeader color="primary" translucent={true}>
        <IonToolbar>
          <IonTitle>Pickup Queue</IonTitle>
          <IonButtons collapse={true} slot="end">
            <IonButton>History</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" className="ion-no-padding ion-no-margin">
        <IonCard className="bg-slate-800 p-2">
          <IonList className="bg-blue-300 ion-no-padding ion-no-margin">
            <IonListHeader className="ion-no-padding bg-white">
              <IonRow className="w-full">
                <IonCol size="12" className="mx-auto border-b border-b-light">
                  <h1 className="px-2">
                    {visiblePickups === null
                      ? "Loading..."
                      : `Pickups Available (${visiblePickups?.length || 0})`}
                  </h1>
                </IonCol>
              </IonRow>
            </IonListHeader>

            <IonAccordionGroup className="bg-slate-300">
              {Array.isArray(visiblePickups) && visiblePickups.length > 0 ? (
                visiblePickups.map((pickup) => (
                  <IonAccordion key={pickup.id} value={`pickup-${pickup.id}`}>
                    <IonItem slot="header">
                      <IonLabel>
                        Pickup from {pickup?.addressData?.street || "Unknown address"}
                      </IonLabel>
                    </IonItem>
                    <div className="ion-padding" slot="content">
                      <IonGrid className="rounded-lg bg-blue-200">
                        <IonRow>
                          <IonCol size="2">
                            <img
                              src={pickup?.createdBy?.photoURL || noPickupIcon}
                              alt="Owner"
                              className="rounded-full"
                            />
                          </IonCol>
                          <IonCol size="10">
                            <IonText>
                              <h2>{pickup?.addressData?.street || "Unknown address"}</h2>
                              <p>Date: {pickup?.pickupDate || "Unknown date"}</p>
                              <p>Time: {pickup?.pickupTime ? convertTo12HourFormat(pickup.pickupTime) : "Unknown time"}</p>
                            </IonText>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size="12" className="bg-slate-200 text-center">
                            <IonText>{pickup?.pickupNote || "No notes"}</IonText>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size="auto">
                            <IonButton color="danger" onClick={() => removePickup(pickup.id)}>
                              Dismiss
                            </IonButton>
                            <IonButton color="success" onClick={() => acceptPickup(pickup.id)}>
                              <IonText className="text-white">Accept</IonText>
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </div>
                  </IonAccordion>
                ))
              ) : (
                <IonItem>
                  <IonRow className="ion-text-center h-full">
                    <IonCol size="6" className="ion-align-self-center mx-auto">
                      <img src={noPickupIcon} alt="No pickups to display" className="ion-margin" />
                      <IonText>No pickups to display</IonText>
                    </IonCol>
                  </IonRow>
                </IonItem>
              )}
            </IonAccordionGroup>
          </IonList>
        </IonCard>
      </IonContent>

      <IonFooter>
        <IonToolbar color="primary">
          <IonRow className="ion-justify-content-center p-0 m-0">
            <IonCol size="auto" className="p-0 m-0">
              <IonButton color="danger" shape="round" size="large" fill="solid" onClick={handleClose}>
                <IonIcon slot="icon-only" icon={closeOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}

export default PickupQueue;
