// utils/validation.ts
export const validatePickupEligibility = (pickupData) => {
  const hasFullBin = pickupData.materials.some(
    (m) => m.storageMethod === "greanBin" || m.storageMethod === "bag25"
  );
  const halfBins = pickupData.materials.filter(
    (m) => m.storageMethod === "halfGreanBin" && ["plastic", "aluminum"].includes(m.type)
  ).length;
  return hasFullBin || halfBins >= 2;
};

export const validateStepData = (step, data) => {
  switch (step) {
    case "details":
      return data.materials.every((m) => {
        if (["plastic", "aluminum", "cardboard"].includes(m.type)) {
          return !!m.storageMethod;
        } else if (m.weight !== undefined) {
          return m.weight >= 1;
        }
        return true;
      });
    case "datetime":
      return !!data.pickupTime;
    case "location":
      return !!data.addressData?.address;
    case "disclaimer":
      return !!data.disclaimerAccepted;
    default:
      return true;
  }
};
