import React, { useState, useEffect } from "react";
import {
  IonCol,
  IonIcon,
  IonRow,
  IonText
} from "@ionic/react";
import { informationCircle } from "ionicons/icons";
import { motion } from "framer-motion";
import cubicFeetIcon from "../../assets/icons/GreanIcons/CubicFeet.png";
import milesIcon from "../../assets/icons/GreanIcons/Miles.png";
import energyIcon from "../../assets/icons/GreanIcons/HomePowered.png";

interface ImpactProps {
  totalWeight?: number;
}

interface Thresholds {
  energy: number;
  miles: number;
  cubicFeet: number;
}

interface ImpactMetric {
  label: string;
  value: number;
  threshold: number;
  color: string;
  icon: string;
}

const Impact: React.FC<ImpactProps> = ({ totalWeight = 1000 }) => {
  const energyPerLb = 0.4;
  const milesPerLb = 0.8;
  const cubicFeetPerLb = 0.5;

  const initialThresholds: Thresholds = {
    energy: 100,
    miles: 200,
    cubicFeet: 50,
  };

  const [thresholds, setThresholds] = useState<Thresholds>(initialThresholds);

  const energySaved = totalWeight * energyPerLb;
  const milesDriven = totalWeight * milesPerLb;
  const cubicFeetSaved = totalWeight * cubicFeetPerLb;

  useEffect(() => {
    if (energySaved >= thresholds.energy) {
      setThresholds((prev) => ({ ...prev, energy: prev.energy + 100 }));
    }
    if (milesDriven >= thresholds.miles) {
      setThresholds((prev) => ({ ...prev, miles: prev.miles + 200 }));
    }
    if (cubicFeetSaved >= thresholds.cubicFeet) {
      setThresholds((prev) => ({ ...prev, cubicFeet: prev.cubicFeet + 50 }));
    }
  }, [energySaved, milesDriven, cubicFeetSaved, thresholds]);

  const data: ImpactMetric[] = [
    {
      label: "Days of Home Power",
      value: energySaved,
      threshold: thresholds.energy,
      color: "bg-orange",
      icon: energyIcon,
    },
    {
      label: "Miles Driven",
      value: milesDriven,
      threshold: thresholds.miles,
      color: "bg-blue-500",
      icon: milesIcon,
    },
    {
      label: "Cubic Feet Saved",
      value: cubicFeetSaved,
      threshold: thresholds.cubicFeet,
      color: "bg-yellow-500",
      icon: cubicFeetIcon,
    },
  ];

  return (
    <div className="ion-padding border-b border-slate-200">
      <IonRow className="ion-padding">
        <IonCol size="6" className="ion-padding-vertical">
          <IonText className="text-xl font-semibold text-[#3a6833]">Impact</IonText>
        </IonCol>
        <IonCol size="6" className="flex items-center gap-2 justify-end">
          <IonText className="text-[#3a6833] text-sm">Level:</IonText>
          <IonText className="text-[#3a6833] font-bold text-sm">0</IonText>
          <IonIcon icon={informationCircle} className="text-slate-400 cursor-pointer" size="small" />
        </IonCol>
      </IonRow>
      {data.map((item, index) => (
        <IonRow key={index} className="ion-padding-vertical">
          <IonCol size="2" className="flex items-center justify-end">
            <div className="flex items-center justify-center aspect-square">
              <img src={item.icon} alt={item.label} />
            </div>
          </IonCol>

          <IonCol size="10" className="flex flex-col gap-1">
            <IonText className="text-sm font-medium text-gray-700">{item.label}</IonText>
            <IonText className="text-xs text-gray-600 mt-1 block">
              {item.value.toFixed(1)} / {item.threshold} {item.label.split(" ")[0].toLowerCase()}
            </IonText>
            <div className="w-full bg-gray-100 rounded-full">
              <motion.div
                className={`h-4 rounded-full ${item.color}`}
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((item.value / (item.threshold || 1)) * 100, 100)}%`,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              ></motion.div>
            </div>
          </IonCol>
        </IonRow>
      ))}
    </div>
  );
};

export default Impact;
