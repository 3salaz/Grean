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
} from "@ionic/react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { fileTrayFullOutline, personOutline } from "ionicons/icons";
import userIcon from "../../../../assets/icons/user.png";
import driverIcon from "../../../../assets/icons/driver.png";
import History from "./History";

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
    <IonGrid
      color="light"
      className="h-full relative flex flex-col items-center justify-between ion-no-padding"
    >
      <IonModal
        isOpen={modalState.history}
        onDidDismiss={() => closeModal("history")}
      >
        <History handleClose={() => closeModal("history")} />
      </IonModal>

      <IonRow className="w-full flex flex-grow justify-center items-center ion-padding">
        <IonCol size="auto" className="absolute left-2 top-2">
          <IonButton size="small" className="z-20 top-2 shadow-xl">
            <img className="w-8" src={userRoleInfo.icon} alt="User Icon" />
            <span className="text-sm">{userRoleInfo.text}</span>
          </IonButton>
        </IonCol>


        <IonCol
          size="12"
          className="text-center mx-auto w-full flex items-center justify-center"
        >
          <svg
            className="w-32 h-32"
            viewBox="0 0 160 160"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="circle-bg"
              cx="80"
              cy="80"
              r="70"
              strokeWidth="10"
              stroke="#e6e6e6"
              fill="none"
            />
            <circle
              className="circle-progress"
              cx="80"
              cy="80"
              r="70"
              strokeWidth="10"
              stroke="#4caf50"
              fill="none"
              strokeDasharray="440"
              // Calculate strokeDashoffset based on progress percentage
              strokeDashoffset={440 - (440 * progress) / 100}
              strokeLinecap="round"
            />
            <text
              className="circle-text"
              x="50%"
              y="50%"
              dy=".3em"
              textAnchor="middle"
              fontSize="25"
              fill="#75b657"
            >
              {totalPoints} pts
            </text>
          </svg>
        </IonCol>

        <IonCol
          size="12"
          className="flex flex-grow flex-col justify-center items-center ion-padding bg-white"
        >
          <IonText className="text-2xl font-bold">Level: {level}</IonText>
          <IonText className="text-xl font-bold">{profile.displayName}</IonText>
          <IonText className="text-center">
            Earn {100 - (totalPoints % 100)} more points to reach level{" "}
            {level + 1}
          </IonText>
        </IonCol>

        {/* Energy Savings */}
        <IonCol size="4" className="text-center">
          <IonCard className=" bg-orange ion-no-margin text-white p-2 w-full h-full flex items-center justify-center gap-2 flex-col">
            <IonLabel className="text-sm block m-0 p-0">
              <h4 className="text-center">
                {energySaved.toFixed(2)} {/* Display energy saved */}
                <span className="font-bold text-sm p-0 m-0">kWh</span>
              </h4>
              <h6 className="text-center">Energy</h6>
            </IonLabel>
          </IonCard>
        </IonCol>

        {/* Total Weight */}
        <IonCol size="4" sizeMd="4" className="text-center">
          <IonCard
            lines="none"
            className="border-2 bg-white bg-green-500 ion-no-margin w-full h-full flex items-center justify-center gap-4 flex-col p-2 rounded-lg shadow-md"
          >
            <IonLabel className="text-sm block m-0 p-0">
              <h4 className="text-center">
                {(
                  totalWeight.aluminum +
                  totalWeight.glass +
                  totalWeight.plastic
                ).toFixed(2)}{" "}
                {/* Display total weight */}
                <span className="font-bold text-sm p-0 m-0">lbs</span>
              </h4>
              <h6 className="text-center">Weight</h6>
            </IonLabel>
          </IonCard>
        </IonCol>

        {/* Total Pickups */}
        <IonCol size="4" sizeMd="4" className="text-center">
          <IonCard
            lines="none"
            className="border-2 ion-no-margin bg-white bg-green-500 px-2 w-full h-full flex items-center justify-center flex-col rounded-lg shadow-md"
          >
            <IonLabel className="text-sm block m-0 p-0">
              <h4 className="text-center">
                {totalPickups} {/* Display total pickups */}
              </h4>
              <h6 className="text-center">Pickups</h6>
            </IonLabel>
          </IonCard>
        </IonCol>
      </IonRow>

      <IonRow className="w-full ion-justify-content-center ion-margin-top bg-slate-200 relative">
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
      </IonRow>
    </IonGrid>
  );
};

export default Stats;
