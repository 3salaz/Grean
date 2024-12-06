import { IonCardContent, IonCol, IonRow, IonText } from "@ionic/react";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function ImpactBarGraph({ totalWeight = 340 }) { // Default to 0 if totalWeight is not provided
  // Conversion factors
  const energyPerLb = 0.4; // Days of home power per lb
  const milesPerLb = 0.8; // Miles driven per lb
  const cubicFeetPerLb = 0.5; // Cubic feet saved per lb

  // Initial thresholds
  const initialThresholds = {
    energy: 100, // 100 days
    miles: 200,  // 200 miles
    cubicFeet: 50, // 50 cubic feet
  };

  // Threshold state
  const [thresholds, setThresholds] = useState(initialThresholds);

  // Metrics calculations
  const energySaved = totalWeight * energyPerLb || 0;
  const milesDriven = totalWeight * milesPerLb || 0;
  const cubicFeetSaved = totalWeight * cubicFeetPerLb || 0;

  // Update thresholds dynamically when exceeded
  useEffect(() => {
    if (energySaved >= thresholds.energy) {
      setThresholds((prev) => ({
        ...prev,
        energy: prev.energy + 100, // Increment by 100 days
      }));
    }
    if (milesDriven >= thresholds.miles) {
      setThresholds((prev) => ({
        ...prev,
        miles: prev.miles + 200, // Increment by 200 miles
      }));
    }
    if (cubicFeetSaved >= thresholds.cubicFeet) {
      setThresholds((prev) => ({
        ...prev,
        cubicFeet: prev.cubicFeet + 50, // Increment by 50 cubic feet
      }));
    }
  }, [energySaved, milesDriven, cubicFeetSaved, thresholds]);

  // Data for bar lines
  const data = [
    {
      label: "Days of Home Power",
      value: energySaved,
      threshold: thresholds.energy,
      color: "bg-orange",
    },
    {
      label: "Miles Driven",
      value: milesDriven,
      threshold: thresholds.miles,
      color: "bg-blue-500",
    },
    {
      label: "Cubic Feet Saved",
      value: cubicFeetSaved,
      threshold: thresholds.cubicFeet,
      color: "bg-yellow-500",
    },
  ];

  return (
    <IonCardContent className="p-4">
      <div className="space-y-6">
        {data.map((item, index) => (
          <IonRow key={index} className="items-center">
            {/* Label */}
            <IonCol size="3">
              <IonText className="text-sm font-medium text-gray-700">
                {item.label}
              </IonText>
            </IonCol>
            {/* Bar */}
            <IonCol size="9">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <motion.div
                  className={`h-4 rounded-full ${item.color}`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      (item.value / (item.threshold || 1)) * 100,
                      100
                    )}%`,
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                ></motion.div>
              </div>
              {/* Value and Threshold */}
              <IonText className="text-xs text-gray-600 mt-1 block">
                {item.value.toFixed(1)} / {item.threshold} {item.label.split(" ")[0].toLowerCase()}
              </IonText>
            </IonCol>
          </IonRow>
        ))}
      </div>
    </IonCardContent>
  );
}

export default ImpactBarGraph;
