import { usePickups } from "../../../../context/PickupsContext";
import noPickupIcon from "../../../../assets/no-pickups.svg";
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
} from "@ionic/react";
import { checkmarkCircle, closeOutline } from "ionicons/icons";

function Alerts({ handleClose }) {
  const { visiblePickups, acceptPickup, userCreatedPickups, removePickup } = usePickups();
  const { profile } = useAuthProfile(); // Access the user's profile, including the userRole

  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert hour 0 to 12
    return `${hours}:${minutes} ${ampm}`;
  };

  const sortedPickups = userCreatedPickups.sort((a, b) => {
    if (!a.isAccepted && b.isAccepted) return -1;
    if (a.isAccepted && !b.isAccepted) return 1;
    if (a.isAccepted && !a.isCompleted && b.isAccepted && b.isCompleted) return -1;
    if (a.isAccepted && a.isCompleted && b.isAccepted && !b.isCompleted) return 1;
    return 0;
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{profile?.accountType === "User" ? "Alerts" : "Pickups Available"}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding shadow-none">
        {profile?.accountType === "User" ? (
          <IonList class="h-full">
            {sortedPickups.length > 0 ? (
              sortedPickups.map((pickup) => {
                const addressParts = pickup.addressData.street.split(",");
                const street = addressParts[0] || "";
                const city = addressParts[1] || "";

                const dateParts = pickup.pickupDate.split("-");
                const formattedDate = `${dateParts[1]}/${dateParts[2]}`;

                const formattedTime = convertTo12HourFormat(pickup.pickupTime);

                return (
                  <IonItem key={pickup.id} className="ion-padding-vertical">
                    <IonLabel>
                      <IonText>
                        <h2>{`${street}, ${city}`}</h2>
                      </IonText>
                      <IonText>
                        <p>{formattedDate}</p>
                        <p>{formattedTime}</p>
                      </IonText>
                      {pickup.isAccepted && (
                        <IonText color="success">
                          <p>Accepted by: {pickup.acceptedBy.substring(0, 8)}</p>
                        </IonText>
                      )}
                      {!pickup.isAccepted && (
                        <IonText color="danger">
                          <p>Not Accepted</p>
                        </IonText>
                      )}
                      {pickup.isCompleted && (
                        <IonGrid>
                          <IonRow>
                            <IonCol size="auto">
                              <IonIcon icon={checkmarkCircle} size="large" color="success" />
                            </IonCol>
                            <IonCol>
                              <IonButton
                                color="tertiary"
                                onClick={() => removePickup(pickup.id)}
                              >
                                Remove
                              </IonButton>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      )}
                    </IonLabel>
                  </IonItem>
                );
              })
            ) : (
              <div className="ion-text-center h-full flex flex-col items-center justify-center">
                <img src={noPickupIcon} alt="No pickups to display" className="ion-margin" />
                <IonText>No pickups to display</IonText>
              </div>
            )}
          </IonList>
        ) : (
          <IonList>
            {visiblePickups.length > 0 ? (
              visiblePickups.map((pickup) => (
                <IonItem key={pickup.id} className="ion-padding-vertical">
                  <IonLabel>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="auto">
                          <img src={pickup.ownerImg} alt="Owner" className="rounded-full" />
                        </IonCol>
                        <IonCol>
                          <IonText>
                            <h2>{pickup.addressData.street}</h2>
                          </IonText>
                          <IonText>
                            <p>{pickup.ownerEmail}</p>
                          </IonText>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol>
                          <IonText>{pickup.pickupNote || "No notes"}</IonText>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol>
                          <IonButton
                            expand="block"
                            color="success"
                            onClick={() => acceptPickup(pickup.id)}
                          >
                            Accept
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonLabel>
                </IonItem>
              ))
            ) : (
              <div className="ion-text-center">
                <img src={noPickupIcon} alt="No pickups to display" className="ion-margin" />
                <IonText>No pickups to display</IonText>
              </div>
            )}
          </IonList>
        )}
      </IonContent>

      <IonFooter>
        <IonButton
          color="danger"
          shape="round"
          size="large"
          fill="solid"
          onClick={handleClose}
          className="ion-margin-bottom flex items-center"
        >
          <IonIcon slot="icon-only" icon={closeOutline} size="large" />
        </IonButton>
      </IonFooter>
    </IonPage>
  );
}

export default Alerts;
