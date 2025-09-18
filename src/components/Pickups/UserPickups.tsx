import React, { useEffect, useRef, useState } from "react";
import {
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonItem,
  IonCheckbox,
  IonLabel,
  IonDatetime,
  IonText,
  IonHeader,
  useIonLoading,
} from "@ionic/react";
import { arrowDown, caretForwardOutline, documentTextOutline } from "ionicons/icons";
import { AnimatePresence, m, motion } from "framer-motion";
import dayjs from "dayjs";
import { usePickups } from "../../context/PickupsContext";
import { materialConfig, MaterialEntry, materialTypes, type MaterialType, type PickupData } from "../../types/pickups";
import { useLocations } from "../../context/LocationsContext";
import { toast } from "react-toastify";

interface Props {
  userLocations: { address: string }[];
}

const UserPickups: React.FC<Props> = ({
  userLocations,
}) => {
  const { userOwnedPickups, createPickup } = usePickups();
  const { currentLocation } = useLocations();
  const [showDropdown, setShowDropdown] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [presentLoading, dismissLoading] = useIonLoading();

  const handleChange = <K extends keyof typeof pickupData>(key: K, value: typeof pickupData[K]) => {
    setpickupData(prev => ({ ...prev, [key]: value }));
  };

  const [pickupData, setpickupData] = useState<PickupData>({
    pickupTime: "",
    addressData: { address: "" },
    materials: [],
    disclaimerAccepted: false,
  });

  const handleSubmit = async () => {
    await presentLoading({ message: "Requesting pickup…", spinner: "crescent" });
    try {
      const activePickups = userOwnedPickups.filter(p => p.status === "pending" || p.status === "accepted");
      if (activePickups.length >= 2) {
        toast.error("You can only have 2 active pickups at a time.");
        return;
      }
      if (!pickupData.addressData.address || !pickupData.pickupTime || pickupData.materials.length === 0) {
        toast.error("Complete all required fields.");
        return;
      }
      const result = await createPickup(pickupData);
      if (result) {
        setpickupData({
          pickupTime: dayjs().add(1, "day").hour(7).minute(0).second(0).toISOString(),
          addressData: { address: "" },
          materials: [],
          disclaimerAccepted: false
        });
      }
    } catch (err) {
      toast.error("Failed to submit pickup.");
    } finally {
      await dismissLoading();
    }
  };

  const tomorrow7am = dayjs().add(1, "day").hour(7).minute(0).second(0);
  const materialDisclaimers: Record<string, string> = {
    glass: "Glass must be rinsed and free of labels. Broken glass is not accepted.",
    cardboard: "Cardboard must be flattened. Wax-coated boxes are not recyclable.",
    appliances: "Ensure appliances are unplugged and emptied before pickup.",
    "non-ferrous": "Non-ferrous metals must be sorted separately and clean.",
  };

  const [tempMaterials, setTempMaterials] = useState<MaterialEntry[]>(pickupData.materials);
  const [tempPickupTime, setTempPickupTime] = useState(pickupData.pickupTime);
  const [pickupTimeConfirmed, setPickupTimeConfirmed] = useState(!!pickupData.pickupTime);

  const upcomingPickups = (userOwnedPickups ?? []).filter((pickup) =>
    dayjs(pickup.pickupTime).isAfter(dayjs())
  );

  const sortedPickups = [...upcomingPickups].sort(
    (a, b) => dayjs(b.pickupTime).valueOf() - dayjs(a.pickupTime).valueOf()
  );


  const requiresDisclaimer = pickupData.materials.some(
    (m) => materialConfig[m.type]?.requiresAgreement
  );

  useEffect(() => {
    if (currentLocation && !pickupData.addressData.address) {
      handleChange("addressData", { address: currentLocation.address });
    }
  }, [currentLocation]);

  return (
    <AnimatePresence mode="wait">
      <motion.section initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }} className="flex-grow flex flex-col gap-6 overflow-auto rounded-md w-full">

        {/* Select Material Dropdown Toggle */}

        <motion.div
          key="material-card-container"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}

          className="w-full ion-padding-horizontal"
        >
          {/* Toggle Row */}
          <IonRow
            onClick={() => setShowDropdown(!showDropdown)}
            className={`bg-white rounded-2xl ion-padding-horizontal justify-between items-center cursor-pointer transition-all duration-200 border-white border hover:border-[#75B657] ${showDropdown ? "rounded-b-none" : ""
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

          {/* Dropdown Content */}
          {showDropdown && (
            <motion.div
              key="material-dropdown-inner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
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
                            ? [...tempMaterials, { type: material as MaterialType, weight: 0 }]
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


        {/* Pickup Details */}
        {/* Materials Selected w/ disclaimer */}
        {pickupData.materials.length > 0 && (
          <motion.div
            key="material-list"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <IonRow className="shadow-none">
              <IonCol size="12" className="bg-orange-50 rounded-xl shadow-lg">
                <div className="p-2 w-full">
                  <IonText className="font-bold text-green-800 w-full text-center">Pickup Details</IonText>
                </div>
                <p className="px-2 pb-1 text-xs font-semibold text-center">Lets tell the driver what to expect</p>
                <IonText></IonText>
                {pickupData.materials.map((m, i) => {
                  const config = materialConfig[m.type];
                  const formattedName = config.label;

                  return (
                    <div key={i} className="px-3 py-2 bg-white">
                      <IonText className="font-medium text-green-800"><IonIcon icon={caretForwardOutline}></IonIcon>{formattedName}</IonText>
                      {/* Weight / Quantity */}
                      {config.min !== undefined && (
                        <IonItem lines="none">
                          <IonLabel position="stacked" className="text-xs">Quantity / Weight</IonLabel>
                          <input
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={m.weight || ""}
                            min={config.min}
                            max={config.max}
                            onChange={(e) => {
                              // Only allow numbers
                              const val = e.target.value;
                              if (/^\d*$/.test(val)) {
                                const value = parseInt(val) || 0;
                                handleChange("materials", pickupData.materials.map((mat, idx) =>
                                  idx === i ? { ...mat, weight: value } : mat
                                ));
                              }
                            }}
                            onKeyDown={(e) => {
                              // Prevent non-numeric input
                              if (
                                ["e", "E", "+", "-", ".", ",", " "].includes(e.key) ||
                                (e.ctrlKey && ["v", "V"].includes(e.key))
                              ) {
                                e.preventDefault();
                              }
                            }}
                            className="border rounded-md px-2 py-1 text-sm w-full"
                          />
                          <IonText className="text-[10px] text-gray-500">
                            Min {config.min} • Max {config.max}
                          </IonText>
                        </IonItem>
                      )}

                      {/* Storage Method (Plastic/Aluminum) */}
                      {(m.type === "plastic" || m.type === "aluminum") && (
                        <IonItem lines="none">
                          <IonLabel position="stacked" className="text-xs">Storage Method</IonLabel>
                          <IonSelect
                            value={m.storageMethod}
                            placeholder="Select Method"
                            onIonChange={(e) => {
                              handleChange("materials", pickupData.materials.map((mat, idx) =>
                                idx === i ? { ...mat, storageMethod: e.detail.value } : mat
                              ));
                            }}
                          >
                            <IonSelectOption value="bag25">25 lb Bag</IonSelectOption>
                            <IonSelectOption value="bag50">50 lb Bag</IonSelectOption>
                            <IonSelectOption value="greanBin">Grean Bin</IonSelectOption>
                          </IonSelect>
                        </IonItem>
                      )}

                      {/* Photos (if required) */}
                      {config.requiresPhoto && (
                        <IonItem lines="none">
                          <IonLabel position="stacked" className="text-xs">Upload Photo</IonLabel>
                          <input
                            className="border-1 border-red-400 rounded-md p-2 w-full"
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // TODO: upload to Firebase Storage and get URL
                                const url = URL.createObjectURL(file);
                                handleChange("materials", pickupData.materials.map((mat, idx) =>
                                  idx === i ? { ...mat, photos: [...(mat.photos || []), url] } : mat
                                ));
                              }
                            }}
                          />
                          {m.photos && (
                            <div className="flex gap-2 mt-1">
                              {m.photos.map((p, idx) => (
                                <img key={idx} src={p} alt="preview" className="w-12 h-12 rounded object-cover" />
                              ))}
                            </div>
                          )}
                        </IonItem>
                      )}

                      {/* Show disclaimer text if disclaimer not yet accepted */}
                      {!pickupData.disclaimerAccepted && config.requiresAgreement && (
                        <p className="text-xs text-gray-600 mt-1 ion-padding-horizontal">{config.agreementLabel}</p>
                      )}
                    </div>
                  );
                })}
              </IonCol>


              {requiresDisclaimer && (
                <motion.div
                  key="disclaimer-checkbox"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4 }}
                  className="w-full"
                >
                  <div className="bg-slate-50 w-full border-t-[#75B657] border-t-2 rounded-b-xl flex items-center justify-center gap-2 ion-padding-horizontal">
                    <IonCheckbox
                      checked={pickupData.disclaimerAccepted}
                      onIonChange={(e) => handleChange("disclaimerAccepted", e.detail.checked)}
                      slot="start"
                    />
                    <IonText className="text-xs text-gray-800 ion-padding-vertical">
                      I have read and agree to the material handling policies.
                    </IonText>
                  </div>
                </motion.div>
              )}
            </IonRow>
          </motion.div>
        )}


        {/* Pickup Date & Time (only if at least one material is selected) */}
        {pickupData.disclaimerAccepted && (
          <motion.div
            key="pickup-date"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <IonRow className="rounded-md bg-orange-50 ion-padding-vertical">
              <IonCol size="12" className="ion-padding flex items-center justify-center">
                <IonText className="font-bold w-full">Pickup Date & Time</IonText>
              </IonCol>
              {!pickupTimeConfirmed ? (
                <>
                  <IonCol size="12" className="ion-padding-vertical">
                    <IonDatetime
                      presentation="date-time"
                      value={tempPickupTime}
                      className="rounded-md w-full bg-white"
                      onIonChange={(e) => {
                        const iso = e.detail.value?.toString();
                        if (iso) setTempPickupTime(iso);
                      }}
                      min={tomorrow7am.toISOString()}
                      minuteValues="0,15,30,45"
                    />
                    <div className="bg-white ion-padding">
                      <IonButton
                        size="small"
                        color="light"
                        onClick={() => {
                          handleChange("pickupTime", tempPickupTime);
                          setPickupTimeConfirmed(true);
                        }}
                      >
                        Confirm Pickup Time
                      </IonButton>
                    </div>
                  </IonCol>

                </>
              ) : (
                <>
                  <IonCol size="12" className="ion-padding">
                    <IonText className="text-lg font-medium rounded-md bg-white ion-padding">
                      {dayjs(pickupData.pickupTime).format("dddd, MMM D • h:mm A")}
                    </IonText>
                  </IonCol>
                  <IonCol className="ion-padding">
                    <IonButton
                      size="small"
                      color="light"
                      fill="solid"
                      className="w-auto"
                      onClick={() => setPickupTimeConfirmed(false)}
                    >
                      Edit Pickup Time
                    </IonButton>
                  </IonCol>
                </>
              )}
            </IonRow>
          </motion.div>

        )}

        {/* Select Location */}
        {pickupData.pickupTime && (
          <motion.div key="select-location"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full">
            <IonRow>
              <IonCol size="12">
                <IonText className="text-sm">
                  What location are we adding this pickup for?
                </IonText>

              </IonCol>
            </IonRow>
            <IonRow className="w-full">
              <IonCol size="auto" className="font-bold w-full text-sm">
                <IonSelect
                  className="border-2 border-dotted rounded-md px-2"
                  value={pickupData.addressData.address || ""}
                  placeholder="Select Address for Pickup"
                  onIonChange={(e) => {
                    const selected = userLocations.find((l) => l.address === e.detail.value);
                    if (selected) {
                      handleChange("addressData", { address: selected.address });
                    }
                  }}
                >
                  {userLocations.map((loc, idx) => {
                    const parts = loc.address.split(",");
                    const shortAddress = parts.length >= 2 ? `${parts[0]}, ${parts[1]}` : loc.address;
                    return (
                      <IonSelectOption key={idx} value={loc.address}>
                        {shortAddress}
                      </IonSelectOption>
                    );
                  })}
                </IonSelect>
              </IonCol>
            </IonRow>
          </motion.div>
        )}

        {pickupData.pickupTime && pickupData.addressData.address && pickupData.disclaimerAccepted && (
          <motion.div
            key="submit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {/* Show submit only if disclaimer accepted or not required */}
            <IonRow className="gap-2 w-full ion-padding">
              <IonCol size="auto" className="mx-auto">
                <IonButton color="primary" fill="outline" size="small" onClick={handleSubmit}>
                  Submit Pickup
                </IonButton>
              </IonCol>
            </IonRow>
          </motion.div>
        )}

      </motion.section>
    </AnimatePresence>
  );
};

export default UserPickups;
