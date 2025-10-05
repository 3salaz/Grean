import {
  IonButton,
  IonCard,
  IonCol,
  IonLabel,
  IonRow,
  IonText,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";

function LevelProgress() {
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
      <IonRow className="flex flex-grow gap-8 justify-center items-center ion-padding bg-white rounded-t-lg">
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
          <IonText className="text-3xl font-bold text-orange">Level: {level}</IonText>
          {/* <IonText className="text-lg font-bold">{profile.displayName}</IonText>/ */}
          <IonText className="text-center">
            Earn <span className="text-grean">{100 - (totalPoints % 100)}</span> more points to reach level{" "}
            {level + 1}
          </IonText>
        </IonCol>

        <IonCol size="3" sizeMd="3" className="text-center">
          <IonCard className="border-2 bg-white bg-green-500 ion-no-margin w-full h-full flex items-center justify-center gap-4 flex-col p-2 rounded-lg shadow-md">
            <IonLabel className="text-sm block m-0 p-0">
              <h4 className="text-center">
                {energySaved.toFixed(2)}
                <span className="font-bold text-sm p-0 m-0">kWh</span>
              </h4>
              <h6 className="text-center">Energy</h6>
            </IonLabel>
          </IonCard>
        </IonCol>

        <IonCol size="3" sizeMd="3" className="text-center">
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
                <span className="font-bold text-sm p-0 m-0">lbs</span>
              </h4>
              <h6 className="text-center">Weight</h6>
            </IonLabel>
          </IonCard>
        </IonCol>

        <IonCol size="3" sizeMd="3" className="text-center">
          <IonCard
            lines="none"
            className="border-2 ion-no-margin bg-white bg-green-500 p-2 w-full h-full flex items-center justify-center flex-col rounded-lg shadow-md"
          >
            <IonLabel className="text-sm block m-0 p-0">
              <h4 className="text-center">{totalPickups}</h4>
              <h6 className="text-center">Pickups</h6>
            </IonLabel>
          </IonCard>
        </IonCol>
      </IonRow>
  );
}

export default LevelProgress;
