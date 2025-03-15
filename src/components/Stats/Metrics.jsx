import { IonCol, IonRow, IonText } from "@ionic/react";
import React from "react";
import { motion } from "framer-motion";

function Metrics() {
  const metrics = [
    { material: "Plastic", percentage: 42.21, weight: "1702lbs" },
    { material: "Aluminum", percentage: 45.24, weight: "1824lbs" },
    { material: "Glass", percentage: 12, weight: "506lbs" },
  ];

  return (
    <IonRow className="bg-slate-200 p-4 md:rounded-t-md min-h-[350px]">
      {/* Header */}
      <IonCol size="12" className="text-left mb-4 ion-padding">
        <IonText className="text-2xl font-bold text-gray-800">Metrics</IonText>
      </IonCol>

      {/* Metrics Bars */}
      {metrics.map((metric, index) => (
        <IonCol
          key={index}
          size="4"
          className="flex flex-col items-center justify-end"
        >
          {/* Bar with Animation */}
          <motion.div
            className="relative w-20 bg-grean drop-shadow-md text-white text-center rounded-md"
            initial={{ height: 0 }} // Start at height 0
            animate={{ height: `${metric.percentage * 5}px` }} // Animate to the target height
            transition={{ duration: 1, ease: "easeOut" }} // Smooth animation
            style={{
              maxHeight: "350px", // Limit the maximum height for consistency
            }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {metric.percentage}%
            </span>
          </motion.div>

          {/* Weight */}
          <IonText className="font-semibold mt-2 text-gray-700">
            {metric.weight}
          </IonText>

          {/* Material Name */}
          <IonText className="mt-1 text-sm text-gray-500">
            {metric.material}
          </IonText>
        </IonCol>
      ))}
    </IonRow>
  );
}

export default Metrics;
