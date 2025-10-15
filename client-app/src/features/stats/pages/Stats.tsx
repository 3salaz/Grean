import { useState, useEffect } from "react";
import { IonGrid } from "@ionic/react";
import History from "./History";
import RecyclingStats from "./RecyclingStats";
import Metrics from "./Metrics";
import { MaterialType } from "../../types/pickups";
import { useProfile } from "../../context/ProfileContext";



const Stats: React.FC = () => {
  const { profile } = useProfile();
  const [pounds, setPounds] = useState<number>(0); // Current pounds recycled
  const [level, setLevel] = useState<number>(1); // Current user level
  const [progress, setProgress] = useState<number>(0); // Progress for circle animation
  const maxPounds = 100; // Pounds needed to reach the next level
  const [totalPoints, setTotalPoints] = useState<number>(0); // Total points for display

  useEffect(() => {
    const totalPickups = profile?.stats?.completedPickups || 0;
    const totalWeight = profile?.stats?.weight || {
      aluminum: 0,
      glass: 0,
      plastic: 0,
    };

    const pointsFromPickups = totalPickups * 20;
    const pointsFromWeight =
      (totalWeight.aluminum || 0) +
      (totalWeight.glass || 0) +
      (totalWeight.plastic || 0);

    const newTotalPoints = pointsFromPickups + pointsFromWeight;
    setTotalPoints(newTotalPoints);

    const newLevel = Math.floor(newTotalPoints / maxPounds) + 1;
    setLevel(newLevel);

    const newPounds = newTotalPoints % maxPounds;
    setPounds(newPounds);

    const newProgress = (newPounds / maxPounds) * 100;
    setProgress(newProgress);
  }, [profile]);

  return (
    <main className="container max-w-2xl mx-auto flex-grow overflow-auto">
      <RecyclingStats stats={profile?.stats || {}} />
      <Metrics materials={profile?.stats?.materials || {}} />
      {/* <History /> */}
    </main>
  );
};

export default Stats;
