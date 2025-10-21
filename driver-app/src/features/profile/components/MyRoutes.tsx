import React from "react";
import {UserProfile} from "@/context/ProfileContext";
import {IonButton, IonCol, IonGrid, IonIcon, IonRow, IonSpinner} from "@ionic/react";
import { mapOutline, mapSharp } from "ionicons/icons";

interface MyRoutesProps {
  profile: UserProfile | null;
}

const MyRoutes: React.FC<MyRoutesProps> = ({profile}) => {
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-full">
        <IonSpinner />
      </div>
    );
  }
  return <IonGrid>
    <IonRow>
      <div className="w-full bg-white rounded-md p-4">
        <h2 className="text-xl font-semibold mb-2">My Routes</h2>
        <p className="text-gray-600">Manage and organize your driving routes here.</p>
      </div>
    </IonRow>
    <IonRow>
      <IonCol size="4" className="mt-4">
        <div className="bg-gray-100 rounded-md flex items-center justify-center">
          <IonButton fill="clear">
            <span className="text-gray-600">View Routes</span>
                      <IonIcon name={mapOutline} size="large" className="text-gray-400" />
          </IonButton>
        </div>
      </IonCol>
      <IonCol size="4" className="mt-4">
        <div className=" bg-gray-100 rounded-md flex items-center justify-center">
        </div>
      </IonCol>
      <IonCol size="4" className="mt-4">
        <div className="bg-gray-100 rounded-md flex items-center justify-center">
        </div>
      </IonCol>
    </IonRow>
  </IonGrid>;
};

export default MyRoutes;
