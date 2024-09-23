import { usePickups } from "../../../../context/PickupsContext";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
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

function Alerts({ handleClose }) {
  const { userCreatedPickups, removePickup } = usePickups(); // Specifically using userCreatedPickups
  const { profile } = useAuthProfile(); // Access the user profile

  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert hour 0 to 12
    return `${hours}:${minutes} ${ampm}`;
  };

  // Sort userCreatedPickups for display
  const sortedPickups = userCreatedPickups?.sort((a, b) => {
    if (!a.isAccepted && b.isAccepted) return -1;
    if (a.isAccepted && !b.isAccepted) return 1;
    if (a.isAccepted && !a.isCompleted && b.isAccepted && b.isCompleted) return -1;
    if (a.isAccepted && a.isCompleted && b.isAccepted && !b.isCompleted) return 1;
    return 0;
  }) || [];

  return (
    <IonPage color="primary">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>My Created Pickups</IonTitle>
          <IonButtons collapse={true} slot="end">
            <IonButton>History</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" className="ion-no-padding ion-no-margin">
        <IonCard className="h-full p-0 m-0">
          <IonList className="ion-no-margin flex flex-col h-full">
            <IonListHeader className="ion-no-padding bg-white">
              <IonRow className="w-full">
                <IonCol size="12" className="mx-auto border-b-4 border-b-light">
                  <h1 className="px-2">
                    {sortedPickups.length === 0
                      ? "Loading..."
                      : `My Pending Pickups (${sortedPickups.length})`}
                  </h1>
                </IonCol>
              </IonRow>
            </IonListHeader>

            <IonAccordionGroup className="p-2 flex-grow">
              {sortedPickups.length > 0 ? (
                sortedPickups.map((pickup) => {
                  const addressParts = pickup.addressData?.street?.split(",") || [];
                  const street = addressParts[0] || "Unknown street";
                  const city = addressParts[1] || "Unknown city";
                  const dateParts = pickup.pickupDate?.split("-") || [];
                  const formattedDate = dateParts.length > 2 ? `${dateParts[1]}/${dateParts[2]}` : "Unknown date";
                  const formattedTime = pickup.pickupTime ? convertTo12HourFormat(pickup.pickupTime) : "Unknown time";

                  return (
                    <IonAccordion className="p-2" key={pickup.id} value={pickup.id}>
                      <IonItem slot="header">
                        <IonLabel>
                          <IonText>
                            <h2>{`${street}, ${city}`}</h2>
                          </IonText>
                          <IonText>
                            <p>{formattedDate}</p>
                            <p>{formattedTime}</p>
                          </IonText>
                          {pickup.isAccepted ? (
                            <IonText color="success">
                              <p>Accepted by: {pickup.acceptedBy?.driverName || "Unknown"}</p>
                            </IonText>
                          ) : (
                            <IonText color="danger">
                              <p>Not Accepted</p>
                            </IonText>
                          )}
                        </IonLabel>
                      </IonItem>

                      <div slot="content" className="ion-padding">
                        {pickup.isCompleted ? (
                          <IonGrid>
                            <IonRow>
                              <IonCol size="auto">
                                <IonIcon icon={checkmarkCircle} size="large" color="success" />
                              </IonCol>
                              <IonCol>
                                <IonButton color="tertiary" onClick={() => removePickup(pickup.id)}>
                                  Remove
                                </IonButton>
                              </IonCol>
                            </IonRow>
                          </IonGrid>
                        ) : (
                          <IonText>
                            <p>Pickup is still pending</p>
                          </IonText>
                        )}
                      </div>
                    </IonAccordion>
                  );
                })
              ) : (
                <IonItem>
                  <IonRow className="ion-text-center h-full">
                    <IonCol size="6" className="ion-align-self-center mx-auto">
                      <IonText>No pickups created</IonText>
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

export default Alerts;
