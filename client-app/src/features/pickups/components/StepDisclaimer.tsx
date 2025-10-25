// Component: StepDisclaimer.tsx
import React from "react";
import { IonCheckbox, IonText } from "@ionic/react";
import dayjs from "dayjs";
import { materialConfig } from "@/features/pickups/types/pickups";

const StepDisclaimer = ({ pickupData, setDisclaimerAccepted }) => {
  return (
    <div className="rounded bg-slate-50">
      <div className="mb-4 text-sm text-gray-700">
        <p className="font-semibold">Review your pickup request:</p>
        <ul className="mt-2 list-disc ml-5">
          {pickupData.materials.map((m, idx) => {
            const config = materialConfig[m.type];
            return (
              <li key={idx}>
                {config.label}: {m.storageMethod || `${m.weight} lbs`}
              </li>
            );
          })}
          <li>
            Date & Time: {pickupData.pickupTime
              ? dayjs(pickupData.pickupTime).format("MMM D, YYYY • h:mm A")
              : "Not set"}
          </li>
          <li>Location: {pickupData.addressData.address}</li>
        </ul>
      </div>
      <IonCheckbox
        checked={pickupData.disclaimerAccepted}
        onIonChange={(e) => setDisclaimerAccepted(e.detail.checked)}
      />
      <IonText className="text-sm ml-2">
        I accept the terms and handling policies.
      </IonText>
    </div>
  );
};

export default StepDisclaimer;
