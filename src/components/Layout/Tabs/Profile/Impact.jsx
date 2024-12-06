import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonText,
  } from "@ionic/react";
  import { home, informationCircle } from "ionicons/icons";
  import React from "react";
import ImpactBarGraph from "./ImpactBarGraph";
  
  function Impact() {
    return (
      <IonCard className="max-w-4xl mx-auto shadow-lg rounded-lg">
        {/* Card Header */}
        <IonCardHeader className="bg-slate-100 p-4 rounded-t-lg">
          <IonCardTitle className="flex w-full justify-between items-center">
            {/* Title Section */}
            <div className="basis-1/3 rounded-full text-center flex items-center justify-center bg-grean">
            <IonText className="  text-white rounded-full px-4 p-2 text-lg font-semibold text-center">Impact</IonText>
            </div>
            {/* Info Icon */}
            <div className="basis-1/3 flex items-center justify-center">
              <IonIcon
                size="large"
                className="text-slate-500 cursor-pointer"
                icon={informationCircle}
              />
            </div>
            {/* Level Section */}
            <div className="basis-1/3 flex items-center justify-end text-grean text-lg gap-1">
              <span className="font-bold">Level:</span>
              <span className="">7</span>
            </div>
          </IonCardTitle>
        </IonCardHeader>
  
        {/* Card Content */}
        <IonCardContent className="px-4">
            <ImpactBarGraph/>
      </IonCardContent>
      </IonCard>
    );
  }
  
  export default Impact;
  
