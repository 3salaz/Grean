// Component: StepDatetime.tsx
import React from "react";
import { IonDatetime } from "@ionic/react";
import dayjs from "dayjs";

const StepDatetime = ({ pickupTime, setPickupTime }) => {
  return (
    <IonDatetime
      presentation="date-time"
      value={pickupTime}
      onIonChange={(e) => {
        const iso = e.detail.value?.toString();
        if (iso) setPickupTime(iso);
      }}
      min={dayjs().add(1, "day").hour(7).minute(0).second(0).toISOString()}
      minuteValues="0,15,30,45"
    />
  );
};

export default StepDatetime;
