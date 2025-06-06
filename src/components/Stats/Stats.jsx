import { useState, useEffect } from "react";
import { IonGrid } from "@ionic/react";
import History from "./History";
import RecyclingStats from "./RecyclingStats";
import Metrics from "./Metrics";

const Stats = ({ profile }) => {
  const [pounds, setPounds] = useState(0); // Current pounds recycled
  const [level, setLevel] = useState(1); // Current user level
  const [progress, setProgress] = useState(0); // Progress for circle animation
  const maxPounds = 100; // Pounds needed to reach the next level
  const [totalPoints, setTotalPoints] = useState(0); // Total points for display

  useEffect(() => {
    // Check if profile.stats exists, otherwise set default values
    const totalPickups = profile?.stats?.pickups?.length || 0;
    const totalWeight = profile?.stats?.weight || {
      aluminum: 0,
      glass: 0,
      plastic: 0
    };

    // Calculate points based on pickups and weight
    const pointsFromPickups = totalPickups * 20; // 20 points per pickup
    const pointsFromWeight = totalWeight.aluminum + totalWeight.glass + totalWeight.plastic; // 1 point per pound

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

  return (
    <main className="container max-w-2xl mx-auto flex-grow overflow-auto ion-padding">
      <RecyclingStats />
      <Metrics />
      <History />

    </main>
  );
};

export default Stats;
