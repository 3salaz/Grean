import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";

function History({ handleClose }) {
  // Define the state for the active tab
  const [activeTab, setActiveTab] = useState("weekly");

  // Placeholder for the pickupHistory array (you should replace this with your actual data)
  const pickupHistory = [
    { date: "2024-09-01", aluminumWeight: 10, plasticWeight: 5 },
    { date: "2024-09-02", aluminumWeight: 8, plasticWeight: 3 },
    { date: "2024-09-03", aluminumWeight: 12, plasticWeight: 6 },
  ];

  // Handler for when a pickup is clicked (replace with your actual logic)
  const handlePickupClick = (pickup) => {
    console.log("Pickup clicked:", pickup);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonCardTitle className="text-white text-center">
            <h1>History</h1>
          </IonCardTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="h-full m-0 p-0 flex flex-col">
          <IonRow className="ion-justify-content-between flex-grow">
            <IonCol size="12" className="drop-shadow-xl m-0 p-2">
              <IonItem className="md:rounded-md bg-white overflow-auto h-full">
                <IonList className="w-full h-full">
                  <IonListHeader className="text-xl text-grean font-bold text-center">
                    History | Current Week
                  </IonListHeader>
                  <IonItem className="border-gray-300 flex justify-between font-bold w-full">
                    <IonLabel>Driver</IonLabel>
                    <IonLabel>Weight</IonLabel>
                    <IonLabel>Date</IonLabel>
                  </IonItem>
                  {pickupHistory.map((pickup, index) => (
                    <IonItem
                      key={index}
                      className="border-slate-800 flex justify-between cursor-pointer w-full"
                      onClick={() => handlePickupClick(pickup)}
                    >
                      <IonLabel>{pickup.date}</IonLabel>
                      <IonLabel>{pickup.aluminumWeight} lbs</IonLabel>
                      <IonLabel>{pickup.plasticWeight} lbs</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
          <IonCol size="12">
              <IonSegment
                value={activeTab}
                className="bg-grean text-slate-800"
                onIonChange={(e) => setActiveTab(e.detail.value)}
              >
                <IonSegmentButton value="weekly">
                  <IonLabel>Weekly</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="monthly">
                  <IonLabel>Monthly</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="yearly">
                  <IonLabel>Yearly</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonToolbar color="light">
          <IonRow className="ion-justify-content-center">
            <IonCol size="auto">
              <IonButton
                color="danger"
                shape="round"
                size="large"
                fill="solid"
                onClick={handleClose}
              >
                <IonIcon slot="icon-only" icon={closeOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}

export default History;
