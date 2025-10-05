import { IonCard, IonCol, IonContent, IonGrid, IonText } from "@ionic/react";

function DriverPickups() {
  return (
    <IonCol size="12" className="h-full flex flex-col justify-between gap-2 container mx-auto">
        <IonCard className="w-full h-full flex overflow-x-auto snap-x snap-mandatory rounded-none scroll-smooth no-scrollbar overscroll-none no-scroll gap-4 bg-orange p-0 m-0">
            {/* If pickups are accepted by me, I will display them here */}
            <div
              className="section flex-none w-full h-full flex justify-center items-center snap-center p-4"
            >
              <div className="flex flex-col text-center items-center justify-center w-full h-full p-4">
                <IonText>
                  Pickup Id
                </IonText>
                <IonText>
                  Pickup 
                </IonText>
                <IonText>
                  Pickup Id
                </IonText>
              </div>
            </div>
        </IonCard>
    </IonCol>
  );
}

export default DriverPickups;