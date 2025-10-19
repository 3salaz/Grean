// Updated to incorporate real-world Grean bin logic for Plastic, Aluminum, and Cardboard materials
// This version introduces refined material input logic and pickup eligibility validation

import React, {useState, useEffect} from "react";
import {
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonText,
  useIonLoading,
  IonItem
} from "@ionic/react";
import {arrowDown} from "ionicons/icons";
import dayjs from "dayjs";
import {usePickups} from "@/context/PickupsContext";
import {useLocations} from "@/context/LocationsContext";
import {
  materialConfig,
  materialTypes,
  type MaterialEntry,
  type MaterialType
} from "@/features/pickups/types/pickups";
import {toast} from "react-toastify";
import {motion} from "framer-motion";

// Extended PickupType to include halfGreanBin
export type ExtendedPickupType = "bag25" | "greanBin" | "halfGreanBin";

const steps = ["details", "datetime", "location", "disclaimer"];

const UserPickup = ({userLocations}) => {
  const {userOwnedPickups, createPickup} = usePickups();
  const {currentLocation} = useLocations();
  const [presentLoading, dismissLoading] = useIonLoading();

  const [stepIndex, setStepIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tempMaterials, setTempMaterials] = useState([]);
  const [pickupData, setPickupData] = useState({
    pickupTime: "",
    addressData: {address: ""},
    materials: [],
    disclaimerAccepted: false
  });

  const handleChange = (key, value) => {
    setPickupData((prev) => ({...prev, [key]: value}));
  };

  const handleSubmit = async () => {
    if (!validatePickupEligibility()) {
      toast.error("Pickup not eligible: requires full bin or valid bag configuration.");
      return;
    }

    await presentLoading({message: "Requesting pickup…", spinner: "crescent"});
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
      const result = await createPickup(pickupData);
      if (result) {
        setPickupData({
          pickupTime: "",
          addressData: {address: ""},
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
      handleChange("addressData", {address: currentLocation.address});
    }
  }, [currentLocation]);

  const nextStep = () => stepIndex < steps.length - 1 && setStepIndex((i) => i + 1);
  const prevStep = () => stepIndex > 0 && setStepIndex((i) => i - 1);

  // Validation Logic for bin pairing
  const validatePickupEligibility = () => {
    const hasFullBin = pickupData.materials.some(
      (m) => m.storageMethod === "greanBin" || m.storageMethod === "bag25"
    );
    const halfBins = pickupData.materials.filter(
      (m) => m.storageMethod === "halfGreanBin" && (m.type === "plastic" || m.type === "aluminum")
    ).length;
    return hasFullBin || halfBins >= 2;
  };

  return (
    <div className="p-4 w-full h-full flex flex-col gap-4 overflow-hidden">
      {/* Material Selection UI (outside of form flow) */}
      <motion.div
        key="material-card-container"
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: -10}}
        transition={{duration: 0.3}}
        className="w-full ion-padding-horizontal"
      >
        <IonRow
          onClick={() => setShowDropdown(!showDropdown)}
          className={`bg-white rounded-2xl ion-padding-horizontal justify-between items-center cursor-pointer transition-all duration-200 border-white border hover:border-[#75B657] ${
            showDropdown ? "rounded-b-none" : ""
          }`}
        >
          <IonCol size="auto">
            <div className="text-xs py-2">What material(s) are you recycling?</div>
          </IonCol>
          <IonCol size="auto">
            <IonButton
              size="small"
              fill="clear"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
            >
              <IonIcon icon={arrowDown} />
            </IonButton>
          </IonCol>
        </IonRow>

        {showDropdown && (
          <motion.div
            key="material-dropdown-inner"
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            transition={{duration: 0.3}}
            className="w-full"
          >
            <IonRow className="rounded-b-lg ion-padding bg-white">
              <IonCol size="12" className="rounded-md">
                {materialTypes.map((material) => (
                  <IonItem className="text-xs" key={material} lines="none">
                    <IonCheckbox
                      slot="start"
                      checked={tempMaterials.some((m) => m.type === material)}
                      onIonChange={(e) => {
                        const selected = e.detail.checked;
                        const updated = selected
                          ? [...tempMaterials, {type: material, weight: 0}]
                          : tempMaterials.filter((m) => m.type !== material);
                        setTempMaterials(updated);
                      }}
                    />
                    <IonLabel className="bg-slate-[#75B657] p-1">
                      {material.charAt(0).toUpperCase() + material.slice(1).replace("-", " ")}
                    </IonLabel>
                  </IonItem>
                ))}
                <IonItem className="flex">
                  <div className="flex gap-2">
                    <IonButton
                      size="small"
                      color="danger"
                      onClick={() => {
                        handleChange("materials", []);
                        setTempMaterials([]);
                        setShowDropdown(false);
                      }}
                    >
                      Clear
                    </IonButton>
                    <IonButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        handleChange("materials", tempMaterials);
                        setShowDropdown(false);
                      }}
                    >
                      Confirm
                    </IonButton>
                  </div>
                </IonItem>
              </IonCol>
            </IonRow>
          </motion.div>
        )}
      </motion.div>

      {pickupData.materials.length > 0 && (
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="bg-orange-50 rounded-xl p-4 flex-grow overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <IonText className="text-lg font-bold">
                Step {stepIndex + 1} of {steps.length}
              </IonText>
            </div>

            {steps[stepIndex] === "details" && (
              <>
                <IonText className="font-bold text-green-800">Pickup Details</IonText>
                {pickupData.materials.map((m, i) => {
                  const config = materialConfig[m.type];
                  return (
                    <div key={i} className="mt-4">
                      <IonText>{config.label}</IonText>

                      {/* Plastic / Aluminum / Cardboard Use Storage Select */}
                      {(m.type === "plastic" ||
                        m.type === "aluminum" ||
                        m.type === "cardboard") && (
                        <IonItem lines="none">
                          <IonLabel position="stacked" className="text-xs">
                            Storage Method
                          </IonLabel>
                          <IonSelect
                            value={m.storageMethod || ""}
                            placeholder="Select Storage Option"
                            onIonChange={(e) => {
                              const val = e.detail.value;
                              handleChange(
                                "materials",
                                pickupData.materials.map((mat, idx) =>
                                  idx === i ? {...mat, storageMethod: val} : mat
                                )
                              );
                            }}
                          >
                            {m.type === "plastic" || m.type === "aluminum" ? (
                              <>
                                <IonSelectOption value="bag25">25 gal Personal Bag</IonSelectOption>
                                <IonSelectOption value="halfGreanBin">
                                  1/2 Grean Bin (25 gal)
                                </IonSelectOption>
                                <IonSelectOption value="greanBin">
                                  Full Grean Bin (50 gal)
                                </IonSelectOption>
                              </>
                            ) : (
                              <IonSelectOption value="greanBin">
                                Full Grean Bin (Required)
                              </IonSelectOption>
                            )}
                          </IonSelect>
                        </IonItem>
                      )}

                      {/* Weight input for other materials */}
                      {config.min !== undefined &&
                        !["plastic", "aluminum", "cardboard"].includes(m.type) && (
                          <IonItem lines="none">
                            <IonLabel position="fixed" className="text-xs">
                              Quantity
                            </IonLabel>
                            <input
                              type="number"
                              className="border rounded w-auto p-1 text-sm mt-1"
                              min={config.min}
                              max={config.max}
                              value={m.weight || ""}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                handleChange(
                                  "materials",
                                  pickupData.materials.map((mat, idx) =>
                                    idx === i ? {...mat, weight: value} : mat
                                  )
                                );
                              }}
                            />
                          </IonItem>
                        )}

                      {/* Photos */}
                      {config.requiresPhoto && (
                        <IonItem lines="none">
                          <IonLabel position="stacked" className="text-xs">
                            Upload Photo
                          </IonLabel>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                handleChange(
                                  "materials",
                                  pickupData.materials.map((mat, idx) =>
                                    idx === i ? {...mat, photos: [...(mat.photos || []), url]} : mat
                                  )
                                );
                              }
                            }}
                          />
                        </IonItem>
                      )}

                      {/* Disclaimer */}
                      {config.requiresAgreement && !pickupData.disclaimerAccepted && (
                        <IonText className="text-xs text-gray-600">{config.agreementLabel}</IonText>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {steps[stepIndex] === "datetime" && (
              <IonDatetime
                presentation="date-time"
                value={pickupData.pickupTime}
                onIonChange={(e) => {
                  const iso = e.detail.value?.toString();
                  if (iso) handleChange("pickupTime", iso);
                }}
                min={dayjs().add(1, "day").hour(7).minute(0).second(0).toISOString()}
                minuteValues="0,15,30,45"
              />
            )}

            {steps[stepIndex] === "location" && (
              <IonSelect
                value={pickupData.addressData.address || ""}
                placeholder="Select Address for Pickup"
                onIonChange={(e) => {
                  const selected = userLocations.find((l) => l.address === e.detail.value);
                  if (selected) handleChange("addressData", {address: selected.address});
                }}
              >
                {userLocations.map((loc, idx) => (
                  <IonSelectOption key={idx} value={loc.address}>
                    {loc.address}
                  </IonSelectOption>
                ))}
              </IonSelect>
            )}

            {steps[stepIndex] === "disclaimer" && (
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
                      Date & Time:{" "}
                      {pickupData.pickupTime
                        ? dayjs(pickupData.pickupTime).format("MMM D, YYYY • h:mm A")
                        : "Not set"}
                    </li>
                    <li>Location: {pickupData.addressData.address}</li>
                  </ul>
                </div>
                <IonCheckbox
                  checked={pickupData.disclaimerAccepted}
                  onIonChange={(e) => handleChange("disclaimerAccepted", e.detail.checked)}
                />
                <IonText className="text-sm ml-2">
                  I accept the terms and handling policies.
                </IonText>
              </div>
            )}
          </div>

          <div className="flex justify-between p-4 bg-white border-t mt-auto">
            <IonButton disabled={stepIndex === 0} onClick={prevStep}>
              Back
            </IonButton>
            {stepIndex === steps.length - 1 ? (
              <IonButton disabled={!pickupData.disclaimerAccepted} onClick={handleSubmit}>
                Submit
              </IonButton>
            ) : (
              <IonButton onClick={nextStep}>Next</IonButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPickup;