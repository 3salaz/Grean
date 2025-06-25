import {
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonAccordionGroup, IonItem, IonLabel, IonText,
    IonAccordion, IonGrid, IonRow, IonCol, IonButton
  } from "@ionic/react";
  import noPickupsIcon from "../../assets/no-pickups.svg";
  import { formatDateInfo } from "../../utils/dateUtils";
  import { usePickups } from "../../context/PickupsContext";
  import { useProfile } from "../../context/ProfileContext";
  import { toast } from "react-toastify";
  
  export default function DriversScheduleCard() {
    const { profile } = useProfile();
    const { userAssignedPickups, updatePickup } = usePickups();
  
    const relevantPickups = userAssignedPickups;
    const driverStatuses = ["accepted"];
  
    const pickupsByStatus: Record<string, typeof relevantPickups> = 
      relevantPickups.reduce((acc, p) => {
        acc[p.status] = acc[p.status] || [];
        acc[p.status].push(p);
        return acc;
      }, {} as Record<string, typeof relevantPickups>);
    driverStatuses.forEach(s => { if (!pickupsByStatus[s]) pickupsByStatus[s] = []; });
  
    const handleStartPickup = async (pickupId: string) => {
      try {
        await updatePickup(pickupId, { status: "inProgress" });
      } catch (err) {
        console.error("Failed to start pickup:", err);
      }
    };
  
    const handleCancelPickup = async (pickupId: string) => {
      try {
        await updatePickup(pickupId, {
          acceptedBy: "",
          status: "pending",
        });
        toast.success("Pickup has been reset to pending.");
      } catch (error) {
        console.error("Cancel error:", error);
        toast.error("Failed to cancel the pickup.");
      }
    };
  
    return (
      <IonCard className="w-full h-full bg-[#75B657] flex flex-col shadow-lg">
        <IonCardHeader className="ion-padding">
          <IonCardTitle>
            {relevantPickups.length === 0
              ? "No Pickups"
              : `Pickups: (${relevantPickups.length})`}
          </IonCardTitle>
          <IonCardSubtitle className="text-white">Your assigned pickups</IonCardSubtitle>
        </IonCardHeader>
  
        <main className="flex flex-col bg-white flex-grow justify-center items-center overflow-auto">
          <div className="h-full w-full flex flex-col overflow-auto">
            {relevantPickups.length === 0 ? (
              <div className="h-full flex items-center justify-center ion-padding">
                <img src={noPickupsIcon} alt="No pickups" className="w-32 h-32 my-2" />
                <IonText className="text-base text-gray-500 font-bold">No pickups to display</IonText>
              </div>
            ) : (
              driverStatuses.map(status => (
                <IonAccordionGroup key={status} multiple className="flex flex-col flex-grow ion-padding rounded-md">
                  <IonItem lines="full" color="light">
                    <IonLabel><h2 className="capitalize">{`${status} (${pickupsByStatus[status].length})`}</h2></IonLabel>
                  </IonItem>
                  {pickupsByStatus[status].length > 0 ? (
                    pickupsByStatus[status].map(p => {
                      const { dayOfWeek, monthName, day, year } = formatDateInfo(p.pickupTime);
                      return (
                        <IonAccordion key={p.id} value={p.id} className="rounded-md my-1">
                          <IonItem slot="header" className="ml-0 pl-0">
                            <IonLabel className="m-0">
                              <IonText><h2>{`${dayOfWeek}, ${monthName} ${day}, ${year}`}</h2></IonText>
                              <IonText className="text-xs">{p.addressData.address || "Unknown Address"}</IonText>
                            </IonLabel>
                          </IonItem>
                          <div slot="content" className="border-t-2 border-[#75B657]">
                            <IonGrid className="ion-padding">
                              <IonRow><IonCol><IonText>Notes: {p.pickupNote || "No Notes"}</IonText></IonCol></IonRow>
                              <IonRow><IonCol><IonText>
                                Materials:{" "}
                                {p.materials.map((mat: { type: string; weight: number }) =>
                                  `${mat.type} (${mat.weight} lbs)`
                                ).join(", ")}
                              </IonText></IonCol></IonRow>
                              <IonRow className="gap-2 ion-padding-top">
                                <IonCol size="auto">
                                  {p.status !== "inProgress" && (
                                    <IonButton
                                      expand="block"
                                      color="primary"
                                      size="small"
                                      onClick={() => handleStartPickup(p.id)}
                                    >
                                      Start Pickup
                                    </IonButton>
                                  )}
                                </IonCol>
                                <IonCol size="auto">
                                  <IonButton
                                    expand="block"
                                    color="danger"
                                    size="small"
                                    onClick={() => handleCancelPickup(p.id)}
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
                    <IonItem lines="none">
                      <IonLabel>No {status} pickups</IonLabel>
                    </IonItem>
                  )}
                </IonAccordionGroup>
              ))
            )}
          </div>
        </main>
      </IonCard>
    );
  }
  