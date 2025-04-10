import React, {useState} from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonListHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonFooter,
  IonAccordionGroup,
  IonAccordion,
  IonButtons,
  IonCard
} from "@ionic/react";
import noPickupIcon from "../../assets/no-pickups.svg";
import {usePickups} from "../../context/PickupsContext";
import {formatDateInfo} from "../../utils/dateUtils"; // Utility function
import {useProfile} from "../../context/ProfileContext";

interface ScheduleProps {
  handleClose: () => void;
}

function Schedule({handleClose}: ScheduleProps) {
  const {userAssignedPickups, updatePickup} = usePickups();
  const {profile} = useProfile();
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<{[pickupId: string]: {[key: string]: string}}>({});

  const handleInputChange = (pickupId: string, name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [pickupId]: {
        ...prev[pickupId],
        [name]: value
      }
    }));
  };

  const handleCompletePickup = async (pickupId: string) => {
    if (!profile) {
      setError("User not logged in");
      return;
    }
    setError("");
    try {
      await updatePickup(pickupId, {
        acceptedBy: profile.uid,
        isCompleted: true
      }); // Use the context function
    } catch (err) {
      setError("Failed to complete the pickup. Please try again.");
    }
  };

  return (
    <IonPage color="primary">
      <IonHeader translucent>
        <IonToolbar color="primary">
          <IonTitle>Schedule</IonTitle>
          <IonButtons slot="end">
            <IonButton>History</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" className="ion-no-padding ion-no-margin">
        <IonCard className="h-full p-0 m-0">
          <IonList className="ion-no-margin flex flex-col h-full overflow-auto">
            <IonListHeader className="ion-no-padding bg-white">
              <IonRow className="w-full">
                <IonCol size="12" className="mx-auto border-b border-b-light">
                  <h1 className="px-2">
                    {userAssignedPickups.length === 0
                      ? "No Pickups"
                      : `Pickups (${userAssignedPickups.length})`}
                  </h1>
                </IonCol>
              </IonRow>
            </IonListHeader>

            <IonAccordionGroup className="p-2 flex-grow">
              {userAssignedPickups.length > 0 ? (
                userAssignedPickups.map((pickup) => {
                  const {dayOfWeek, monthName, day, year} = formatDateInfo(pickup.pickupDate);

                  return (
                    <IonAccordion className="p-2" key={pickup.id} value={pickup.id}>
                      <IonItem slot="header">
                        <IonLabel>
                          <IonText>
                            <h2>{`${dayOfWeek}, ${monthName} ${day}, ${year}`}</h2>
                          </IonText>
                          <IonText>{pickup.addressData.address || "Unknown Address"}</IonText>
                        </IonLabel>
                      </IonItem>
                      <div className="ion-padding" slot="content">
                        <IonGrid>
                          <IonRow>
                            <IonCol>
                              <IonText>Pickup Notes: {pickup.pickupNote || "No Notes"}</IonText>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            {pickup.materials.map((material) => (
                              <IonCol size="12" sizeMd="6" key={material}>
                                <IonInput
                                  label={`${
                                    material.charAt(0).toUpperCase() + material.slice(1)
                                  } (lbs)`}
                                  value={formData[pickup.id]?.[`${material}Weight`] || ""}
                                  onIonChange={(e) =>
                                    handleInputChange(
                                      pickup.id,
                                      `${material}Weight`,
                                      e.detail.value!
                                    )
                                  }
                                />
                              </IonCol>
                            ))}
                          </IonRow>

                          {error && (
                            <IonRow>
                              <IonCol>
                                <IonText color="danger">
                                  <p>{error}</p>
                                </IonText>
                              </IonCol>
                            </IonRow>
                          )}

                          <IonRow>
                            <IonCol>
                              <IonButton
                                expand="block"
                                color="primary"
                                onClick={() => handleCompletePickup(pickup.id)}
                              >
                                Complete Pickup
                              </IonButton>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </div>
                    </IonAccordion>
                  );
                })
              ) : (
                <IonItem lines="none" className="h-full flex items-center justify-center">
                  <IonRow className="ion-text-center ion-justify-content-center w-full">
                    <IonCol size="12" className="flex flex-col justify-center items-center">
                      <img
                        src={noPickupIcon}
                        alt="No pickups to display"
                        className="w-32 h-32 my-2"
                      />
                      <IonText className="text-base text-gray-500">No pickups to display</IonText>
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
              <IonButton
                color="danger"
                shape="round"
                size="large"
                fill="solid"
                onClick={handleClose}
              >
                Close
              </IonButton>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}

export default Schedule;
