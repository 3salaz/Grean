import React, {useState} from "react";
import {UserProfile} from "../../context/ProfileContext";
import {informationCircleOutline, leaf, leafOutline, trashBin} from "ionicons/icons";
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSpinner
} from "@ionic/react";
import {motion} from "framer-motion";

interface MyRoutesProps {
  profile: UserProfile | null;
}

const MyRoutes: React.FC<MyRoutesProps> = ({profile}) => {
  const [flipped, setFlipped] = useState(false);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-full bg-orange-300">
        <IonSpinner />
      </div>
    );
  }

  return (
    <div className="ion-padding bg-white h-full rounded-t-xl">
      <IonRow className="flex flex-col h-full">
        <IonCol size="12" className="flex flex-grow flex-col h-full">
          <h2 className="text-xl text-center font-semibold text-[#3a6833] mb-4">Routes</h2>

          {/* === Card Flip Container === */}
          <div className="relative w-full flex-grow perspective-[1000px]">
            <motion.div
              className="relative w-full h-full"
              animate={{rotateY: flipped ? 180 : 0}}
              transition={{duration: 0.8, ease: "easeInOut"}}
              style={{transformStyle: "preserve-3d"}}
            >
              {/* === FRONT SIDE === */}
              <div
                className="absolute inset-0 backface-hidden"
                style={{backfaceVisibility: "hidden"}}
              >
                <IonCard className="h-full ion-padding flex-grow flex flex-col gap-4 text-center bg-white bg-opacity-40 backdrop-blur rounded-md">
                  <IonCardHeader>
                    <IonCardTitle className="text-lg font-medium text-gray-700 text-left">
                      Todays Route
                    </IonCardTitle>
                  </IonCardHeader>

                  <IonCardContent className="ion-no-padding rounded-md flex-grow p-0 m-0">
                    {/* if no routes display this */}

                    {/* <div className="flex flex-col gap-4 items-center justify-center h-full">
                      <IonSpinner name="crescent" color="primary" />
                    </div> */}

                    {/* if routes exist display this */}
                    <IonAccordionGroup className="rounded-md">
                      <IonAccordion value="route1">
                        <IonItem slot="header" color="light" className="rounded-lg">
                          <IonLabel>Today</IonLabel>
                        </IonItem>
                        <div className="ion-padding" slot="content">
                          First Content
                        </div>
                      </IonAccordion>
                    </IonAccordionGroup>
                  </IonCardContent>

                  <div className="flex justify-center items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-slate-200 rounded-full"></span>
                    <span className="w-2 h-2 bg-slate-200 rounded-full"></span>
                    <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                  </div>
                </IonCard>
              </div>

              {/* === BACK SIDE === */}
              <div
                className="absolute inset-0 backface-hidden rotateY-180"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)"
                }}
              >
                <IonCard className="ion-padding flex flex-col gap-4 text-center bg-green-100 backdrop-blur-md rounded-md h-full">
                  <IonCardHeader>
                    <IonCardTitle className="text-lg font-semibold text-[#2b2b2b]">
                      Route Information
                    </IonCardTitle>
                  </IonCardHeader>

                  <IonCardContent className="flex flex-col justify-center flex-grow">
                    <p className="text-gray-700 mb-4">
                      This section can show driver stats, recent route history, or upcoming
                      assignments.
                    </p>

                    <div className="flex justify-center">
                      <IonButton fill="outline" color="dark" onClick={() => setFlipped(false)}>
                        Back
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              </div>
            </motion.div>
          </div>

          {/* === Control Buttons === */}
          <div className="backdrop-blur-md rounded-md p-4 flex w-full justify-between mt-4">
            <IonButton color="warning" onClick={() => setFlipped(!flipped)}>
              <IonIcon color="light" icon={informationCircleOutline} />
            </IonButton>

            <IonButton color="light">Create Route</IonButton>

            <IonButton color="primary">
              <IonIcon icon={leafOutline} />
            </IonButton>
          </div>
        </IonCol>
      </IonRow>
    </div>
  );
};

export default MyRoutes;
