import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonIcon,
  IonRow,
  IonText,
} from "@ionic/react";
import { home, informationCircle } from "ionicons/icons";
import ImpactBarGraph from "./ImpactBarGraph";

function Impact() {
  return (
    <IonCard className="max-w-4xl mx-auto shadow-lg mt-2 rounded-lg">
      {/* Card Header */}
      <IonCardHeader className="bg-slate-100 rounded-t-lg pb-2">
        <IonCardTitle className="flex w-full justify-between items-center">
          {/* Title Section */}
          <IonRow className="flex justify-between w-full">
            <IonCol
              size="auto"
              className="rounded-full text-center bg-grean px-4 flex items-center justify-center"
            >
              <div className="rounded-full text-lg font-semibold text-center">
                Impact
              </div>
            </IonCol>
            <IonCol size="auto" className="pr-2">
              {/* Level Section */}
              <div className="flex items-center justify-end text-grean font-bolds text-lg gap-1">
                <span className="">Level:</span>
                <span className="font-bold">0</span>
              </div>
            </IonCol>
          </IonRow>
        </IonCardTitle>
        {/* Info Icon */}
        <div className="absolute top-1 right-1">
          <IonIcon
            size="small"
            slot="icon-only"
            className="text-slate-400 cursor-pointer"
            icon={informationCircle}
          />
        </div>
      </IonCardHeader>

      {/* Card Content */}
      <IonCardContent className="px-4">
        <ImpactBarGraph />
      </IonCardContent>
    </IonCard>
  );
}

export default Impact;
