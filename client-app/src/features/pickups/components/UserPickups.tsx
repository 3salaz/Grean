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
import { arrowDown } from "ionicons/icons";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { usePickups } from "@/context/PickupsContext";
import { materialConfig, MaterialEntry, type MaterialType, type PickupData } from "@/features/pickups/types/pickups";
import { useLocations } from "@/context/LocationsContext";
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

  const handleChange = <K extends keyof typeof formData>(key: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const [formData, setFormData] = useState<PickupData>({
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
      if (!formData.addressData.address || !formData.pickupTime || formData.materials.length === 0) {
        toast.error("Complete all required fields.");
        return;
      }
      const result = await createPickup(formData);
      if (result) {
        setFormData({
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

  const [tempMaterials, setTempMaterials] = useState<MaterialEntry[]>(formData.materials);
  const [tempPickupTime, setTempPickupTime] = useState(formData.pickupTime);
  const [pickupTimeConfirmed, setPickupTimeConfirmed] = useState(!!formData.pickupTime);

  const upcomingPickups = (userOwnedPickups ?? []).filter((pickup) =>
    dayjs(pickup.pickupTime).isAfter(dayjs())
  );

  const sortedPickups = [...upcomingPickups].sort(
    (a, b) => dayjs(b.pickupTime).valueOf() - dayjs(a.pickupTime).valueOf()
  );


  const requiresDisclaimer = formData.materials.some(
    (m) => materialConfig[m.type]?.requiresAgreement
  );

  useEffect(() => {
    if (currentLocation && !formData.addressData.address) {
      handleChange("addressData", { address: currentLocation.address });
    }
  }, [currentLocation]);


  return (
    <AnimatePresence mode="wait">
      <motion.section initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }} className="flex-grow flex flex-col gap-6 overflow-auto rounded-md ion-padding w-full">

        {/* Select Material Dropdown Toggle */}

        <motion.div
          key="material-card-container"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {/* Toggle Row */}
          <IonRow
            onClick={() => setShowDropdown(!showDropdown)}
            className={`bg-white rounded-lg ion-padding-horizontal justify-between items-center cursor-pointer transition-all duration-200 border-white border hover:border-[#75B657] ${showDropdown ? "rounded-b-none" : ""
              }`}
          >
            <IonCol size="auto">
              <div className="text-sm py-2">What material are you recycling?</div>
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
                  {["glass", "cardboard", "appliances", "non-ferrous"].map((material) => (
                    <IonItem key={material} lines="none">
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
                      <IonLabel className="text-sm bg-slate-[#75B657] p-2">
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

        {/* Materials Selected w/ disclaimer */}
        {formData.materials.length > 0 && (

          <motion.div
            key="material-list"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <IonRow className="rounded-md bg-white">
              <IonCol size="12" className="bg-orange-50 rounded-md">
                <div className="p-3">
                  <IonText className="font-bold text-green-800">Material(s)</IonText>

                </div>
                {formData.disclaimerAccepted ? (
                  <div className="px-3 py-2 text-gray-800 text-sm rounded-md">
                    {formData.materials
                      .map((m) =>
                        m.type
                          .split("-")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")
                      )
                      .join(", ")}
                  </div>
                ) : (
                  <div className="flex flex-col flex-wrap rounded-md bg-orange-50">
                    {formData.materials.map((m, i) => {
                      const formattedName = m.type
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ");
                      const disclaimer = materialDisclaimers[m.type] || "No disclaimer available.";
                      return (
                        <div key={i} className="px-3 py-2 text-gray-800 text-sm rounded-md">
                          <strong>{formattedName}</strong>
                          <p className="mt-1 text-gray-600 text-xs">{disclaimer}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </IonCol>

              {requiresDisclaimer && (
                <motion.div
                  key="disclaimer-checkbox"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4 }}
                  className=""
                >
                  <div className="bg-yellow-50 border-t-[#75B657] border-t-2 rounded-b-md flex items-center justify-center gap-2 ion-padding-horizontal">
                    <IonCheckbox
                      checked={formData.disclaimerAccepted}
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
        {formData.disclaimerAccepted && (
          <motion.div
            key="pickup-date"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <IonRow className="rounded-md bg-orange-50 ion-padding-vertical">
              <IonCol size="12" className="ion-padding">
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
                      {dayjs(formData.pickupTime).format("dddd, MMM D • h:mm A")}
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
        {formData.pickupTime && (
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
                  value={formData.addressData.address || ""}
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

        {formData.pickupTime && formData.addressData.address && formData.disclaimerAccepted && (
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
