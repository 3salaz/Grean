import {
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
    <IonCard className="max-w-4xl mx-auto shadow-lg rounded-lg">
      {/* Card Header */}
      <IonCardHeader className="bg-slate-100 rounded-t-lg">
        <IonCardTitle className="flex w-full justify-between items-center">
          {/* Title Section */}
          <IonRow className="flex justify-between w-full">
            <IonCol
              size="auto"
              className="rounded-full text-center bg-grean px-4"
            >
              <IonText className="  text-white rounded-full p-0 m-0  text-lg font-semibold text-center">
                Impact
              </IonText>
            </IonCol>
            <IonCol size="auto" className="flex">
              {/* Level Section */}
              <div className="flex items-center justify-end text-grean font-bolds text-xl gap-1">
                <span className="">Level:</span>
                <span className="font-bold">0</span>
              </div>
            </IonCol>
          </IonRow>
        </IonCardTitle>
        {/* Info Icon */}
        <div className=" flex items-center justify-center absolute top-1 right-1">
          <IonIcon
            size="small"
            className="text-slate-150 cursor-pointer"
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
