import React, { useEffect, useState } from "react";
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
  const { userAssignedPickups, updatePickup, userOwnedPickups, fetchUserOwnedPickups } = usePickups();
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

  useEffect(() => {
    if (profile?.uid) {
      fetchUserOwnedPickups(profile.uid);
    }
  }, [profile?.uid]);

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
        status: "completed"
      }); // Use the context function
    } catch (err) {
      setError("Failed to complete the pickup. Please try again.");
    }
  };

  return (
    <IonPage>
      <IonContent color="light" className="flex items-center justify-center">
        <IonGrid className="h-full flex flex-col items-center justify-center ion-padding">
          <IonCard className="w-full h-full shadow-none bg-[#75B657] flex flex-col">
            <IonCardHeader className="ion-padding">
              <IonCardTitle className="">
                {relevantPickups.length === 0
                  ? "No Pickups"
                  : `Pickups (${relevantPickups.length})`}
              </IonCardTitle>
              <IonCardSubtitle className="text-white">
                {profile?.accountType === "User" ? "Your  pickup requests" : "Your assigned pickups"}
              </IonCardSubtitle>
            </IonCardHeader>
            <main className="flex flex-col bg-white flex-grow justify-center align-center">
              <div className="p-2 h-full flex flex-col">
                <IonAccordionGroup className="flex flex-col flex-grow justify-end ion-padding bg-slate-100 rounded-md">
                  {relevantPickups.length > 0 ? (
                    relevantPickups.map((pickup) => {
                      const { dayOfWeek, monthName, day, year } = formatDateInfo(pickup.pickupTime);
                      return profile?.accountType === "User" ? (
                        // 👤 User View
                        <IonAccordion className="rounded-md my-1" key={pickup.id} value={pickup.id}>
                          <IonItem color="primary" slot="header" className="ml-0 pl-0">
                            <IonLabel className="m-0">
                              <IonText>
                                <h2>{`${dayOfWeek}, ${monthName} ${day}, ${year}`}</h2>
                              </IonText>
                              <IonText className="text-xs">{pickup.addressData.address || "Unknown Address"}</IonText>
                            </IonLabel>
                          </IonItem>
                          <div slot="content" className="border-t-2 border-[#75B657]">
                            <IonGrid className="ion-padding">
                              <IonRow>
                                <IonCol>
                                  <IonText>Pickup Notes: {pickup.pickupNote || "No Notes"}</IonText>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                {pickup.materials.map((material) => (
                                  <IonCol size="12" sizeMd="6" key={material}>
                                    <IonInput
                                      label={`${material.charAt(0).toUpperCase() + material.slice(1)} (lbs)`}
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
                              <IonRow className="gap-2 ion-padding-top">
                                <IonCol size="auto">
                                  <IonButton expand="block" color="primary" size="small">
                                    Edit Pickup
                                  </IonButton>
                                </IonCol>
                              </IonRow>
                            </IonGrid>
                          </div>
                        </IonAccordion>
                      ) : (
                        // 🚗 Driver View
                        <IonAccordion className="rounded-md mt-1" key={pickup.id} value={pickup.id}>
                          <IonItem color="primary" slot="header" className="ml-0 pl-0">
                            <IonLabel className="m-0">
                              <IonText>
                                <h2>{`${dayOfWeek}, ${monthName} ${day}, ${year}`}</h2>
                              </IonText>
                              <IonText className="text-xs">{pickup.addressData.address || "Unknown Address"}</IonText>
                            </IonLabel>
                          </IonItem>
                          
                          <div slot="content" className="border-t-2 border-[#75B657]">
                            <IonGrid className="ion-padding">
                              <IonRow>
                                <IonCol>
                                  <IonText>Pickup Notes: {pickup.pickupNote || "No Notes"}</IonText>
                                </IonCol>
                              </IonRow>
                              <IonRow>
                                {pickup.materials.map((material) => (
                                  <IonCol size="12" sizeMd="6" key={material}>
                                    <IonInput
                                      label={`${material.charAt(0).toUpperCase() + material.slice(1)} (lbs)`}
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
                              <IonRow className="gap-2 ion-padding-top">
                                <IonCol size="auto">
                                  <IonButton expand="block" color="primary" size="small">
                                    Begin Pickup
                                  </IonButton>
                                </IonCol>
                                <IonCol size="auto">
                                  <IonButton expand="block" color="danger" size="small">
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
                    <IonItem lines="none" className="h-full flex items-center justify-center">
                      <IonRow className="ion-text-center ion-justify-content-center w-full ion-padding">
                        <IonCol size="12" className="flex flex-col justify-center items-center">
                          <img
                            src={noPickupIcon}
                            alt="No pickups to display"
                            className="w-32 h-32 my-2"
                          />
                          <IonText className="text-base text-gray-500 font-bold">No pickups to display</IonText>
                        </IonCol>
                      </IonRow>
                    </IonItem>
                  )}
                </IonAccordionGroup>
              </div>
              <IonRow className="ion-justify-content-center ion-padding">
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

            </main>
          </IonCard>
        </IonGrid>
      </IonContent>

    </IonPage>
  );
}

export default Schedule;
