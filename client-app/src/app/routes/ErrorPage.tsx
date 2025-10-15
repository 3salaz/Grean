import React from "react";
import { IonPage, IonContent, IonButton, IonIcon } from "@ionic/react";
import { warningOutline, homeOutline, refreshOutline } from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  // Extract error code if passed via state (optional)
  const errorCode = (location.state as any)?.errorCode || "404";
  const errorMessage =
    (location.state as any)?.message || "The page you’re looking for doesn’t exist or has moved.";

  return (
    <IonPage>
      <IonContent
        fullscreen
        className="flex flex-col justify-center items-center text-center bg-gray-50 p-6"
      >
        <div className="max-w-md mx-auto">
          <IonIcon
            icon={warningOutline}
            className="text-6xl text-grean mb-4"
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {errorCode}
          </h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>

          <div className="flex justify-center gap-3">
            <IonButton color="success" onClick={() => history.push("/")}>
              <IonIcon slot="start" icon={homeOutline} />
              Go Home
            </IonButton>
            <IonButton
              fill="outline"
              color="medium"
              onClick={() => window.location.reload()}
            >
              <IonIcon slot="start" icon={refreshOutline} />
              Reload
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ErrorPage;