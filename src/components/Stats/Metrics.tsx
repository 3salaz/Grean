import { IonCol, IonRow, IonText } from "@ionic/react";
import React from "react";
import { motion } from "framer-motion";
import {
  materialTypes,
  materialConfig,
  MaterialType,
} from "../../types/pickups";

interface Props {
  materials: Partial<Record<MaterialType, number>>;
}

const Metrics: React.FC<Props> = ({ materials }) => {
  // Filter down to materialTypes only (ensures 'totalWeight' or others are excluded)
  const validMaterialEntries = materialTypes.map((type) => ({
    type,
    label: materialConfig[type]?.label || type,
    weight: materials[type] || 0,
  }));

  const total = validMaterialEntries.reduce((sum, entry) => sum + entry.weight, 0);

  const metrics = validMaterialEntries
    .map((entry) => ({
      ...entry,
      percentage: total > 0 ? (entry.weight / total) * 100 : 0,
    }))
    .filter((entry) => entry.weight > 0); // only show materials with data

  return (
    <section className="w-full h-full">
      <IonRow className="bg-slate-200 md:rounded-t-md min-h-[350px] h-full flex-wrap justify-center items-end px-4 py-6 gap-y-6">
  <IonCol size="12" className="text-left mb-4">
    <IonText className="text-2xl font-bold text-gray-800">Metrics</IonText>
  </IonCol>

  {metrics.map((metric, index) => (
    <div key={index} className="flex flex-col items-center mx-3">
      {/* Percentage Above */}
      <IonText className="text-xs font-medium text-gray-600 mb-1">
        {metric.percentage.toFixed(0)}%
      </IonText>

      {/* Animated Bar */}
      <motion.div
        className="w-8 rounded-md bg-[#75B657] drop-shadow-md"
        initial={{ height: 0 }}
        animate={{ height: `${metric.percentage * 2.5}px` }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ maxHeight: "240px" }}
      />

      {/* Weight */}
      <IonText className="text-sm font-semibold mt-2 text-gray-700">
        {metric.weight} lbs
      </IonText>

      {/* Label */}
      <IonText className="text-xs text-gray-500 text-center mt-1">
        {metric.label}
      </IonText>
    </div>
  ))}
</IonRow>

    </section>
  );
};

export default Metrics;
