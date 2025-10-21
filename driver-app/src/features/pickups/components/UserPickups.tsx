import React, { useState, useEffect } from "react";
import {
  IonText,
  useIonLoading,
} from "@ionic/react";
import { usePickups } from "@/context/PickupsContext";
import { useLocations } from "@/context/LocationsContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import MaterialSelector from "@/features/pickups/components/MaterialSelector";
import StepDetails from "@/features/pickups/components/StepDetails";
import StepDatetime from "@/features/pickups/components/StepDateTime";
import StepLocation from "@/features/pickups/components/StepLocation";
import StepDisclaimer from "@/features/pickups/components/StepDisclaimer";
import FormNavigation from "@/features/pickups/components/FormNavigation";
import { validateStepData, validatePickupEligibility } from "@/utils/pickups/validation";
import { MaterialEntry } from "@/features/pickups/types/pickups";
import { uploadPickupPhotos } from "@/utils/pickups/photoUpload";
import { ToastContainer } from "react-toastify";
import { UserLocation } from "@/features/pickups/types/location";
const steps = ["details", "datetime", "location", "disclaimer"];
type UserPickupProps = {
  userLocations: UserLocation[];
};

import { PickupFormData } from "@/features/pickups/types/pickupForm";

const UserPickup: React.FC<UserPickupProps> = ({ userLocations }) => {
  const { userOwnedPickups, createPickup } = usePickups();
  const { currentLocation } = useLocations();
  const [presentLoading, dismissLoading] = useIonLoading();
  const [stepIndex, setStepIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tempMaterials, setTempMaterials] = useState<MaterialEntry[]>([]);
  const [pickupData, setPickupData] = useState<PickupFormData>({
    pickupTime: "",
    addressData: { address: "" },
    materials: [],
    disclaimerAccepted: false
  });

  const handleChange = <K extends keyof PickupFormData>(
    key: K,
    value: PickupFormData[K]
  ): void => {
    setPickupData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    const currentStep = steps[stepIndex];
    if (!validateStepData(currentStep, pickupData)) {
      toast.error("Please complete all required fields for this step.");
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const prevStep = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleSubmit = async () => {
    if (!validatePickupEligibility(pickupData)) {
      toast.error("Pickup not eligible: requires full bin or valid bag configuration.");
      return;
    }

    await presentLoading({ message: "Requesting pickup…", spinner: "crescent" });
    try {
      const activePickups = userOwnedPickups.filter(
        (p) => p.status === "pending" || p.status === "accepted"
      );
      if (activePickups.length >= 2) {
        toast.error("You can only have 2 active pickups at a time.");
        return;
      }
      if (
        !pickupData.addressData.address ||
        !pickupData.pickupTime ||
        pickupData.materials.length === 0
      ) {
        toast.error("Complete all required fields.");
        return;
      }

      try {
        const updatedMaterials = await uploadPickupPhotos(pickupData.materials);
        handleChange("materials", updatedMaterials);
      } catch (err) {
        toast.warn("Photo upload failed. Pickup will still be submitted.");
      }

      const result = await createPickup(pickupData);
      if (result) {
        setPickupData({
          pickupTime: "",
          addressData: { address: "" },
          materials: [],
          disclaimerAccepted: false
        });
        setStepIndex(0);
      }
    } catch (err) {
      toast.error("Failed to submit pickup.");
    } finally {
      await dismissLoading();
    }
  };

  useEffect(() => {
    if (currentLocation && !pickupData.addressData.address) {
      handleChange("addressData", { address: currentLocation.address });
    }
  }, [currentLocation]);

  return (
    <div className="p-4 w-full h-full flex flex-col gap-4 overflow-hidden">
      <ToastContainer />
      <MaterialSelector
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        tempMaterials={tempMaterials}
        setTempMaterials={setTempMaterials}
        confirmMaterials={(m) => handleChange("materials", m)}
      />

      {pickupData.materials.length > 0 && (
        <div className="flex flex-col flex-grow overflow-hidden">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="bg-orange-50 rounded-xl p-4 flex-grow overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-2">
              <IonText className="text-lg font-bold">
                Step {stepIndex + 1} of {steps.length}
              </IonText>
            </div>

            {steps[stepIndex] === "details" && (
              <StepDetails
                materials={pickupData.materials}
                updateMaterials={(m) => handleChange("materials", m)}
                disclaimerAccepted={pickupData.disclaimerAccepted}
                setDisclaimerAccepted={(v) => handleChange("disclaimerAccepted", v)}
              />
            )}

            {steps[stepIndex] === "datetime" && (
              <StepDatetime
                pickupTime={pickupData.pickupTime}
                setPickupTime={(v: string) => handleChange("pickupTime", v)}
              />

            )}

            {steps[stepIndex] === "location" && (
              <StepLocation
                address={pickupData.addressData.address}
                userLocations={userLocations}
                setAddress={(a: string) => handleChange("addressData", { address: a })}
              />

            )}

            {steps[stepIndex] === "disclaimer" && (
              <StepDisclaimer
                pickupData={pickupData}
                setDisclaimerAccepted={(v: boolean) => handleChange("disclaimerAccepted", v)}
              />

            )}
          </motion.div>

          <FormNavigation
            stepIndex={stepIndex}
            steps={steps}
            disclaimerAccepted={pickupData.disclaimerAccepted}
            onBack={prevStep}
            onNext={nextStep}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default UserPickup;
