import React, { useState } from "react";
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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle
} from "@ionic/react";
import noPickupIcon from "../../assets/no-pickups.svg";
import { usePickups } from "../../context/PickupsContext";
import { formatDateInfo } from "../../utils/dateUtils"; // Utility function
import { useProfile } from "../../context/ProfileContext";

interface ScheduleProps {
  handleClose: () => void;
}

function Schedule({ handleClose }: ScheduleProps) {
  const { userAssignedPickups, updatePickup, userOwnedPickups } = usePickups();
  const { profile } = useProfile();
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<{ [pickupId: string]: { [key: string]: string } }>({});

  const handleInputChange = (pickupId: string, name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [pickupId]: {
        ...prev[pickupId],
        [name]: value
      }
    }));
  };

  const relevantPickups = profile?.accountType === "User"
    ? userOwnedPickups
    : userAssignedPickups;

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
    <IonPage>
      <IonContent color="light" className="flex items-center justify-center">
        <IonGrid className="h-full flex flex-col items-center justify-center ion-padding">
          <IonCard className="w-full h-full shadow-none  items-center justify-center">
            <IonCardHeader className="ion-padding">
              <IonCardTitle className="text-[#75B657]">
                {relevantPickups.length === 0
                  ? "No Pickups"
                  : `Pickups (${relevantPickups.length})`}
              </IonCardTitle>
              <IonCardSubtitle>
                {profile?.accountType === "User" ? "Your  pickup requests" : "Your assigned pickups"}
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent className="ion-no-padding bg-orange-400 h-full">
              <IonList className="bg-blue-400 m-2">
                <IonAccordionGroup className="p-2 flex-grow">
                  {relevantPickups.length > 0 ? (
                    relevantPickups.map((pickup) => {
                      const { dayOfWeek, monthName, day, year } = formatDateInfo(pickup.pickupTime);

                      return (
                        <IonAccordion className="p-2" key={pickup.id} value={pickup.id}>
                          <IonItem color="orimary" slot="header" className="ml-0 pl-0 bg-blue-300">
                            <IonLabel className="m-0">
                              <IonText>
                                <h2>{`${dayOfWeek}, ${monthName} ${day}, ${year}`}</h2>
                              </IonText>
                              <IonText className="text-xs">{pickup.addressData.address || "Unknown Address"}</IonText>
                            </IonLabel>
                          </IonItem>
                          <div slot="content" className="border-t-2 border-[#75B657]">
                            <IonGrid>
                              {/* <IonRow>
                                <IonCol>
                                  <IonText>Pickup Notes: {pickup.pickupNote || "No Notes"}</IonText>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                {pickup.materials.map((material) => (
                                  <IonCol size="12" sizeMd="6" key={material}>
                                    <IonInput
                                      label={`${material.charAt(0).toUpperCase() + material.slice(1)
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
                              </IonRow> */}

                              {/* {error && (
                                <IonRow>
                                  <IonCol>
                                    <IonText color="danger">
                                      <p>{error}</p>
                                    </IonText>
                                  </IonCol>
                                </IonRow>
                              )} */}

                              <IonRow className="ion-padding-vertical gap-2">
                                <IonCol size="auto">
                                  <IonButton
                                    expand="block"
                                    color="primary"
                                    size="small"
                                    // onClick={() => handleCompletePickup(pickup.id)}
                                  >
                                    Begin Pickup
                                  </IonButton>
                                </IonCol>
                                <IonCol size="auto">
                                  <IonButton
                                    expand="block"
                                    color="danger"
                                    size="small"
                                    // onClick={() => handleCompletePickup(pickup.id)}
                                  >
                                    Cancel Pickup
                                  </IonButton>
                                </IonCol>
                              </IonRow>
                            </IonGrid>
                          </div>
                        </IonAccordion>
                      );
                    })
                  ) : (
                    <IonItem lines="none" className="h-full flex items-center justify-center bg-blue-300">
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

              <IonRow className="ion-justify-content-center p-0 m-0">
                <IonCol size="auto" className="p-0 m-0">
                  <IonButton
                    color="danger"
                    shape="round"
                    size="small"
                    fill="solid"
                    onClick={handleClose}
                  >
                    Close
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonCardContent>


          </IonCard>
        </IonGrid>
      </IonContent>

    </IonPage>
  );
}

export default Schedule;
