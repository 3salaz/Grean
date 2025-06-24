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
    <section className="w-full">
      <IonRow className="bg-slate-200 md:rounded-t-md min-h-[350px] h-full flex-wrap">
        {/* Header */}
        <IonCol size="12" className="text-left mb-4 ion-padding">
          <IonText className="text-2xl font-bold text-gray-800">Metrics</IonText>
        </IonCol>

        {/* Metric Bars */}
        {metrics.map((metric, index) => (
          <IonCol
            key={index}
            size="4"
            className="flex flex-col items-center justify-end mb-4"
          >
            {/* Animated Bar */}
            <motion.div
              className="relative w-20 bg-grean drop-shadow-md text-white text-center rounded-md"
              initial={{ height: 0 }}
              animate={{ height: `${metric.percentage * 3}px` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ maxHeight: "300px" }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {metric.percentage.toFixed(0)}%
              </span>
            </motion.div>

            {/* Weight */}
            <IonText className="font-semibold mt-2 text-gray-700">
              {metric.weight} lbs
            </IonText>

            {/* Label */}
            <IonText className="mt-1 text-sm text-gray-500 text-center">
              {metric.label}
            </IonText>
          </IonCol>
        ))}
      </IonRow>
    </section>
  );
};

export default Metrics;
