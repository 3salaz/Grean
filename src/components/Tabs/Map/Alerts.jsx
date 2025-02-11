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
import {
  checkmarkCircle,
  checkmarkCircleOutline,
  closeOutline,
} from "ionicons/icons";

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
  const sortedPickups =
    userCreatedPickups?.sort((a, b) => {
      if (!a.isAccepted && b.isAccepted) return -1;
      if (a.isAccepted && !b.isAccepted) return 1;
      if (a.isAccepted && !a.isCompleted && b.isAccepted && b.isCompleted)
        return -1;
      if (a.isAccepted && a.isCompleted && b.isAccepted && !b.isCompleted)
        return 1;
      return 0;
    }) || [];

  return (
    <IonPage color="light">
      <IonHeader translucent={true}>
        <IonToolbar color="primary">
          <IonTitle>Created Pickups</IonTitle>
          <IonButtons collapse={true} slot="end">
            <IonButton>History</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-no-padding ion-no-margin">
        <IonCard className="h-full p-0 m-0">
          <IonList className="ion-no-margin ion-no-padding">
            <IonListHeader className="ion-no-padding">
              <IonRow className="w-full">
                <IonCol size="12" className="mx-auto border-b-4 border-b-light">
                  <h1 className="px-2 text-slate-800">
                    {sortedPickups.length === 0
                      ? "Loading..."
                      : `Pending Pickups (${sortedPickups.length})`}
                  </h1>
                </IonCol>
              </IonRow>
            </IonListHeader>

            <IonAccordionGroup className="flex-grow max-h-[78svh] px-2 overflow-y-auto">
              {sortedPickups.length > 0 ? (
                sortedPickups.map((pickup) => {
                  const addressParts =
                    pickup.addressData?.street?.split(",") || [];
                  const street = pickup.addressData?.street || "Unknown Street";
                  // const city = pickup.addressData?.city || "Unknown City";
                  const date = pickup?.pickupDate || [];
                  const time = pickup.pickupTime
                    ? convertTo12HourFormat(pickup.pickupTime)
                    : "Unknown time";

                  return (
                    <IonAccordion
                      className="p-2"
                      key={pickup.id}
                      value={pickup.id}
                    >
                      <IonItem
                        color="primary"
                        slot="header"
                        className="rounded-t-md"
                      >
                        <IonLabel>
                          <IonText>
                            <h2>{street}</h2>
                          </IonText>
                        </IonLabel>
                      </IonItem>
                      <IonGrid
                        slot="content"
                        className="bg-slate-100 rounded-b-lg"
                      >
                        <IonRow className="w-full">
                          <IonCol size="12" className="mx-auto">
                            <p>
                              {date}
                              {time}
                            </p>
                            <p></p>
                            {pickup.isAccepted ? (
                              <IonText color="success">
                                <p>
                                  Accepted by:{" "}
                                  {pickup.acceptedBy?.driverName || "Unknown"}
                                </p>
                              </IonText>
                            ) : (
                              <IonText color="danger">
                                <p>Not Accepted</p>
                              </IonText>
                            )}
                          </IonCol>
                        </IonRow>
                        {pickup.isCompleted ? (
                          <IonRow className="">
                            <IonCol size="auto">
                              <IonButton shape="round" color="primary">
                                <IonIcon
                                  icon={checkmarkCircleOutline}
                                  color="light"
                                  slot="icon-only"
                                  size="large"
                                />
                              </IonButton>
                            </IonCol>
                            <IonCol
                              size="auto"
                              className="ion-align-self-center"
                            >
                              <IonText>Completed</IonText>
                            </IonCol>
                            {/* <IonCol
                              size="12"
                              className="ion-align-self-center"
                            >
                              <IonButton
                                color="tertiary"
                                size="small"
                                onClick={() => removePickup(pickup.id)}
                              >
                                Clear
                              </IonButton>
                            </IonCol> */}
                          </IonRow>
                        ) : (
                          <IonRow>
                            <IonCol>
                              <IonText>
                                <p>Pickup is still pending</p>
                              </IonText>
                            </IonCol>
                          </IonRow>
                        )}
                      </IonGrid>
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
