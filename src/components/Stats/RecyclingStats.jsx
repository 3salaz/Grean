import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonIcon,
  IonRow,
  IonText
} from "@ionic/react";
import {carOutline, flashOutline, scaleOutline} from "ionicons/icons";
import React from "react";

function RecyclingStats() {
  return (
    <IonCard className="shadow-none bg-white p-0 mx-2">
      <IonCardHeader>
        <IonCardTitle className="text-3xl">Recycling Stats</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="flex flex-col items-center gap-2 bg-transparent">
        <IonRow className="flex items-center justify-between w-full bg-light rounded-md">
          <IonCol size="auto" className="flex flex-col items-center rounded-full ion-padding gap-2">
            <IonText className="text-2xl">Pickups</IonText>
            <IonIcon size="large" icon={carOutline}></IonIcon>
          </IonCol>

          <IonCol size="auto" className="ion-padding">
            <IonText className="text-4xl">21</IonText>
          </IonCol>
        </IonRow>

        <IonRow className="flex items-center justify-between w-full bg-light rounded-md">
          <IonCol size="auto" className="flex flex-col items-center rounded-full ion-padding gap-2">
            <IonText className="text-2xl">Weight</IonText>
            <IonIcon size="large" icon={scaleOutline}></IonIcon>
          </IonCol>

          <IonCol size="auto" className="ion-padding">
            <IonText className="text-4xl">4,032</IonText>
          </IonCol>
        </IonRow>

        <IonRow className="flex items-center justify-between w-full bg-light rounded-md">
          <IonCol size="auto" className="flex flex-col items-center rounded-full ion-padding gap-2">
            <IonText className="text-2xl">Energy</IonText>
            <IonIcon size="large" icon={flashOutline}></IonIcon>
          </IonCol>

          <IonCol size="auto" className="ion-padding">
            <IonText className="text-4xl">21</IonText>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>
  );
}

export default RecyclingStats;
