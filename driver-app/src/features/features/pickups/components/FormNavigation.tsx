// Component: FormNavigation.tsx
import React from "react";
import { IonButton } from "@ionic/react";

const FormNavigation = ({
  stepIndex,
  steps,
  disclaimerAccepted,
  onBack,
  onNext,
  onSubmit
}) => {
  return (
    <div className="flex justify-between p-4 bg-white border-t mt-auto">
      <IonButton disabled={stepIndex === 0} onClick={onBack}>
        Back
      </IonButton>
      {stepIndex === steps.length - 1 ? (
        <IonButton disabled={!disclaimerAccepted} onClick={onSubmit}>
          Submit
        </IonButton>
      ) : (
        <IonButton onClick={onNext}>Next</IonButton>
      )}
    </div>
  );
};

export default FormNavigation;
