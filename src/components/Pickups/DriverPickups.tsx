import React from "react";
import {
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonSpinner,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonHeader,
  IonAccordionGroup,
  IonAccordion,
  IonLabel,
  IonItem
} from "@ionic/react";
import { usePickups } from "../../context/PickupsContext";
import type { MaterialType } from "../../types/pickups";
import { useProfile } from "../../context/ProfileContext";
import dayjs from "dayjs";
import noPickupIcon from "../../assets/no-pickups.svg";
import { useAuth } from "../../context/AuthContext";

interface DriverPickupsProps {
  viewMode: "default" | "routes";
}

const DriverPickups: React.FC<DriverPickupsProps> = ({ viewMode }) => {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { availablePickups, updatePickup, userAssignedPickups } = usePickups();
  const [acceptingPickupId, setAcceptingPickupId] = React.useState<string | null>(null);
  const [weights, setWeights] = React.useState<Record<string, Record<string, string>>>({});

  const handleWeightChange = (pickupId: string, materialType: string, value: string) => {
    setWeights(prev => ({
      ...prev,
      [pickupId]: {
        ...(prev[pickupId] || {}),
        [materialType]: value
      }
    }));
  };

  const handleAcceptPickup = async (pickupId: string) => {
    if (!profile?.uid) return;
    setAcceptingPickupId(pickupId);

    try {
      // 1. Update the pickup itself
      await updatePickup(pickupId, {
        acceptedBy: profile.uid,
        status: "accepted"
      });

      // 2. Add pickupId to driver's profile
      await updateProfile("pickups", pickupId, "addToArray");
    } catch (err) {
      console.error("Error accepting pickup", err);
    } finally {
      setAcceptingPickupId(null);
    }
  };

  const handleCompletePickup = async (
    pickupId: string,
    materials: { type: MaterialType; weight: number }[]
  ) => {
    const materialWeights = weights[pickupId];

    if (!materialWeights || materials.some(m => !materialWeights[m.type])) {
      alert("Please enter weight for all materials.");
      return;
    }

    const updatedMaterials = materials.map((m) => ({
      type: m.type,
      weight: parseFloat(materialWeights[m.type]) || 0,
    }));

    try {
      const token = await user?.getIdToken?.(); // get Firebase Auth token
      const response = await fetch("https://us-central1-grean-de04f.cloudfunctions.net/api/completePickupFunction", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickupId,
          materials: updatedMaterials,
        }),
      });

      const text = await response.text(); // 👈 READ TEXT FIRST
      console.log("🔍 Raw response text:", text);

      let result;
      try {
        result = JSON.parse(text); // 👈 manually parse it to see what's up
      } catch (e) {
        console.error("❌ Failed to parse JSON:", e.message);
        throw new Error("Invalid response from server.");
      }

      if (!response.ok) {
        throw new Error(result?.error || "Unknown error");
      }

      console.log("✅ Pickup marked as complete:", result);
      // Optional: Add toast or UI feedback
      // toast.success("Pickup completed!");
    } catch (error) {
      console.error("❌ Error completing pickup:", error);
    }
  }; // ✅ <- This was the missing closing brace


  return (
    <section className="h-full w-full ion-padding flex flex-col justify-end">
      <IonHeader className="">
        <IonCardTitle className="">
          {availablePickups.length === 0
            ? "No Pickups"
            : `Pickups (${availablePickups.length})`}
        </IonCardTitle>
        <IonCardSubtitle>
          Current Pickups Available
        </IonCardSubtitle>
      </IonHeader>
      <main className="flex-grow flex flex-col overflow-auto gap-2 ion-padding-vertical">
        {viewMode === "default" ? (
          acceptingPickupId ? (
            <div className="flex-grow ion-padding-vertical bg-white rounded-md">
              <IonRow className="h-full flex w-full justify-center items-center">
                <IonCol size="12" className="flex flex-col w-full bg-white items-center justify-center gap-4">
                  <IonText className="text-base font-medium text-gray-700 mr-2">Accepting...</IonText>
                  <IonSpinner name="crescent" color="primary" />
                </IonCol>
              </IonRow>
            </div>
          ) : availablePickups.length > 0 ? (
            <div className="flex-grow flex flex-col overflow-auto rounded-md gap-2 ion-padding-top">
              <IonAccordionGroup className="bg-white flex-grow h-full rounded-md" expand="compact">
                {availablePickups.map((pickup) => (
                  <IonAccordion className="rounded-md" key={pickup.id} value={pickup.id}>
                    <IonItem slot="header" className="bg-red-400 w-full">
                      <IonRow>
                        <IonCol size="12" className="ion-padding-vertical">
                          <IonText className="text-sm font-medium">
                            {dayjs(pickup.pickupTime).format("dddd, MMM D • h:mm A")}
                          </IonText>
                        </IonCol>
                        <IonCol size="12" className="ion-padding-bottom">
                          <div className="text-xs text-slate-500">{pickup.addressData.address}</div>

                        </IonCol>
                      </IonRow>


                    </IonItem>
                    <div slot="content" className="ion-padding bg-slate-50 border-t border-gray-300">
                      <section className="">
                        <div className="text-xs ion-padding-bottom">{pickup.materials.map(m => m.type.charAt(0).toUpperCase() + m.type.slice(1)).join(", ")}</div>
                        <div className="flex justify-start">
                          <IonButton
                            size="small"
                            color="success"
                            onClick={() => handleAcceptPickup(pickup.id)}
                          >
                            Accept
                          </IonButton>
                        </div>
                      </section>
                    </div>
                  </IonAccordion>
                ))}
              </IonAccordionGroup>
            </div>
          ) : (
            <div className="flex-grow flex-grow flex flex-col overflow-auto rounded-md gap-2 bg-white">
              <IonRow className="h-full">
                <IonCol className="flex flex-col items-center justify-center rounded-md">
                  <img
                    src={noPickupIcon}
                    alt="No pickups to display"
                    className="w-16 h-16"
                  />
                  <IonText className="text-base text-gray-500 font-bold">No pickups to display</IonText>
                </IonCol>
              </IonRow>
            </div>
          )
        ) : (
          <div className="flex-grow flex flex-col overflow-auto rounded-md gap-2 ion-padding-top">
            <IonRow className="h-full flex items-center justify-center bg-white rounded-md">
              <IonCol size="12" className="text-center ion-padding">
                <IonText className="text-lg text-center font-semibold">
                  📍 Route View (Coming Soon)
                </IonText>
              </IonCol>
            </IonRow>

          </div>
        )}

        <IonRow className="ion-padding bg-white rounded-md">
          <IonCol size="12">
            <IonText className="text-lg font-semibold ion-padding">Pickup In Progress</IonText>
          </IonCol>
          <IonCol size="12">
            {userAssignedPickups.filter(p => p.status === "inProgress").length > 0 ? (
              <IonAccordionGroup className="rounded-md" expand="compact">
                {userAssignedPickups
                  .filter(p => p.status === "inProgress")
                  .map((pickup) => (
                    <IonAccordion className="rounded-md" key={pickup.id} value={pickup.id}>
                      <IonItem slot="header" className="bg-green-200 w-full rounded-md">
                        <IonLabel>
                          <IonText className="font-medium text-sm">
                            {dayjs(pickup.pickupTime).format("dddd, MMM D • h:mm A")}
                          </IonText>
                          <div className="text-xs text-slate-600">{pickup.addressData.address}</div>
                        </IonLabel>
                      </IonItem>
                      <div slot="content" className="ion-padding border-t border-gray-300 flex flex-col gap-2">
                        {pickup.materials.map((materialObj) => (
                          <IonRow key={materialObj.type} className="">
                            <IonCol size="12" sizeMd="6">
                              <input
                                className="w-full p-2 border rounded-md"
                                type="number"
                                placeholder={`${materialObj.type} weight (lbs)`}
                                value={weights[pickup.id]?.[materialObj.type] || ""}
                                onChange={(e) => handleWeightChange(pickup.id, materialObj.type, e.target.value)}
                              />
                            </IonCol>
                          </IonRow>
                        ))}

                        <div className="mt-3 flex justify-start">
                          <IonButton
                            size="small"
                            color="tertiary"
                            onClick={() => handleCompletePickup(pickup.id, pickup.materials)}
                          >
                            Complete Pickup
                          </IonButton>
                        </div>
                      </div>

                    </IonAccordion>
                  ))}
              </IonAccordionGroup>
            ) : (
              <IonText className="text-gray-500 text-sm">No Pickup In Progress</IonText>
            )}
          </IonCol>
        </IonRow>

      </main>

    </section>
  );
};

export default DriverPickups;
