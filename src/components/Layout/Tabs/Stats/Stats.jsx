import { useState, useEffect } from "react";
import {
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonModal,
  IonIcon,
  IonList,
  IonListHeader,
  IonText,
  IonSegment,
  IonSegmentButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonFab,
  IonFabButton,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { carOutline, fileTrayFullOutline, flashOutline, personOutline, scaleOutline } from "ionicons/icons";
import userIcon from "../../../../assets/icons/user.png";
import driverIcon from "../../../../assets/icons/driver.png";
import History from "./History";
import ProfileHeader from "../Profile/ProfileHeader";
import RecyclingStats from "./RecyclingStats";
import Metrics from "./Metrics";

const Stats = () => {
  const [pounds, setPounds] = useState(0); // Current pounds recycled
  const [level, setLevel] = useState(1); // Current user level
  const [progress, setProgress] = useState(0); // Progress for circle animation
  const maxPounds = 100; // Pounds needed to reach the next level
  const [totalPoints, setTotalPoints] = useState(0); // Total points for display
  const [modalState, setModalState] = useState({
    history: false,
  });
  const { profile } = useAuthProfile();

  useEffect(() => {
    // Check if profile.stats exists, otherwise set default values
    const totalPickups = profile?.stats?.pickups?.length || 0;
    const totalWeight = profile?.stats?.weight || {
      aluminum: 0,
      glass: 0,
      plastic: 0,
    };

    // Calculate points based on pickups and weight
    const pointsFromPickups = totalPickups * 20; // 20 points per pickup
    const pointsFromWeight =
      totalWeight.aluminum + totalWeight.glass + totalWeight.plastic; // 1 point per pound

    // Calculate total points
    const newTotalPoints = pointsFromPickups + pointsFromWeight;
    setTotalPoints(newTotalPoints);

    // Increment level based on total points
    const newLevel = Math.floor(newTotalPoints / maxPounds) + 1; // New level calculation
    setLevel(newLevel);

    // Calculate progress for circle
    const newPounds = newTotalPoints % maxPounds; // Points for the current level
    setPounds(newPounds);

    // Calculate progress percentage for circle (max is 100 pounds)
    const newProgress = (newPounds / maxPounds) * 100;
    setProgress(newProgress);
  }, [profile]); // This useEffect runs whenever the profile changes

  const closeModal = (modalName) => {
    setModalState((prevState) => ({ ...prevState, [modalName]: false }));
  };

  const openModal = (modalName) => {
    setModalState((prevState) => ({ ...prevState, [modalName]: true }));
  };

  const getUserRoleInfo = () => {
    switch (profile?.accountType) {
      case "Driver":
        return { icon: driverIcon, text: "Driver" };
      case "User":
        return { icon: userIcon, text: "User" };
      default:
        return { icon: personOutline, text: "null" };
    }
  };

  const userRoleInfo = getUserRoleInfo();

  // Default weight object
  const defaultWeight = { aluminum: 0, glass: 0, plastic: 0 };

  // Calculate total pickups
  const totalPickups = profile?.stats?.pickups?.length || 0;

  // Calculate total weight (sum of aluminum, glass, plastic)
  const totalWeight = profile?.stats?.weight || defaultWeight;

  // Calculate energy saved (example: 1.5 kWh per pound of total weight)
  const energySaved =
    (totalWeight.aluminum + totalWeight.glass + totalWeight.plastic) * 1.5;

  return (
    <IonGrid color="light"
      className="h-full relative flex flex-col items-center justify-between ion-no-padding bg-gradient-to-t from-grean to-blue-300"
    >
      <IonModal
        isOpen={modalState.history}
        onDidDismiss={() => closeModal("history")}
      >
        <History handleClose={() => closeModal("history")} />
      </IonModal>

      <main className="container mx-auto max-w-4xl overflow-auto">
        <ProfileHeader />
        <RecyclingStats/>
        <Metrics/>
        <History/>
      </main>

      {/* <IonRow className="w-full ion-justify-content-center ion-margin-top bg-slate-200 relative">
        <IonCol size="auto" className="mx-auto text-center">
          <IonText className="text-xl">Total</IonText>
          <IonText className="font-bold text-white text-2xl">0</IonText>
          <IonText>lbs</IonText>
        </IonCol>
        <IonCol
          size="12"
          className="text-right flex-col flex items-center justify-center"
        >
          <IonText>{totalWeight.glass}lbs of Glass</IonText>
          <IonText>{totalWeight.aluminum}lbs of Aluminum</IonText>
          <IonText>{totalWeight.plastic}lbs of Plastic</IonText>
        </IonCol>
        <IonCol className="absolute bottom-2 left-2">
          <IonButton onClick={() => openModal("history")}>
            <IonIcon icon={fileTrayFullOutline}></IonIcon>
          </IonButton>
        </IonCol>
      </IonRow> */}
    </IonGrid>
  );
};

export default Stats;
