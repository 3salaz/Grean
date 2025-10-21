import {
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonIcon
} from "@ionic/react";
import {
  carOutline,
  flashOutline,
  scaleOutline,
  cubeOutline,
  hardwareChipOutline,
  wineOutline,
} from "ionicons/icons";
import React from "react";
import type { MaterialType } from "@/features/pickups/types/pickups";

interface StatItemProps {
  icon: string;
  label: string;
  value: string | number;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-light rounded-xl p-4 shadow-sm w-full sm:w-auto bg-white">
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#75B657] text-white shadow-inner">
      <IonIcon icon={icon} size="large" />
    </div>
    <div className="flex flex-col">
      <IonText className="text-sm text-gray-500">{label}</IonText>
      <IonText className="text-xl font-semibold">{value}</IonText>
    </div>
  </div>
);

interface RecyclingStatsProps {
  stats: {
    completedPickups?: number;
    totalWeight?: number;
    materials?: Partial<Record<MaterialType, number>>;
  };
}


const RecyclingStats: React.FC<RecyclingStatsProps> = ({ stats }) => {
  const completedPickups = stats?.completedPickups || 0;
  const totalWeight = stats?.totalWeight || 0;
  const materials = stats?.materials || {};
  const energySaved = Math.round(totalWeight * 1.3);

  return (
    <section className="ion-padding h-full">
      <IonCardHeader>
        <IonCardTitle className="text-2xl font-bold">Recycling Stats</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <StatItem icon={carOutline} label="Pickups" value={completedPickups} />
          <StatItem icon={scaleOutline} label="Total Weight" value={`${totalWeight} lbs`} />
          <StatItem icon={flashOutline} label="Energy Saved" value={energySaved} />
          <StatItem icon={cubeOutline} label="Cardboard" value={`${materials.cardboard || 0} lbs`} />
          {/* <StatItem icon={hardwareChipOutline} label="Appliances" value={`${materials.appliances || 0} lbs`} /> */}
          {/* <StatItem icon={wineOutline} label="Glass" value={`${materials.glass || 0} lbs`} /> */}
        </div>
      </IonCardContent>
    </section>
  );
};

export default RecyclingStats;
