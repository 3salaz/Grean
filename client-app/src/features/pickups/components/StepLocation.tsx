// Component: StepLocation.tsx
import React from "react";
import { IonSelect, IonSelectOption } from "@ionic/react";

const StepLocation = ({ address, userLocations, setAddress }) => {
  return (
    <IonSelect
      value={address || ""}
      placeholder="Select Address for Pickup"
      onIonChange={(e) => {
        const selected = userLocations.find((l) => l.address === e.detail.value);
        if (selected) setAddress(selected.address);
      }}
    >
      {userLocations.map((loc, idx) => (
        <IonSelectOption key={idx} value={loc.address}>
          {loc.address}
        </IonSelectOption>
      ))}
    </IonSelect>
  );
};

export default StepLocation;
