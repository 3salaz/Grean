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
} from "@ionic/react";
import { arrowDown } from "ionicons/icons";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { usePickups } from "../../context/PickupsContext";
import { materialConfig, MaterialEntry, type MaterialType, type PickupData } from "../../types/pickups";
import { useLocations } from "../../context/LocationsContext";

interface Props {
  formData: PickupData;
  handleChange: <K extends keyof PickupData>(key: K, value: PickupData[K]) => void;
  userLocations: { address: string }[];
  handleSubmit: () => void;
  viewMode: "form" | "list";
}

const UserPickups: React.FC<Props> = ({
  formData,
  handleChange,
  userLocations,
  handleSubmit,
  viewMode
}) => {
  const { userOwnedPickups } = usePickups();
  const { currentLocation } = useLocations();
  const [showDropdown, setShowDropdown] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (viewMode === "list" && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [viewMode, sortedPickups.length]);

  const requiresDisclaimer = formData.materials.some(
    (m) => materialConfig[m.type]?.requiresAgreement
  );

  useEffect(() => {
    if (currentLocation && !formData.addressData.address) {
      handleChange("addressData", { address: currentLocation.address });
    }
  }, [currentLocation]);

  if (viewMode === "list") {
    return (
      <AnimatePresence mode="wait">
        <motion.section
          key="active-pickups"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col flex-grow ion-padding"
        >
          <div className="h-full flex flex-col justify-end">
            <IonHeader className="shadow-none ion-padding-vertical">Pickup History</IonHeader>
            <div className="border-1 border-dotted rounded-md ion-padding">
              <IonRow>
                <IonCol>
                  <div ref={scrollRef} className="overflow-y-auto max-h-110">
                    {sortedPickups.length > 0 ? (
                      sortedPickups.map((pickup) => (
                        <div key={pickup.id} className="mb-3 p-2 rounded-md border border-slate-200 bg-white">
                          <div className="flex justify-between items-center">
                            <IonText className="text-sm font-medium">
                              {dayjs(pickup.pickupTime).format("dddd, MMM D • h:mm A")}
                            </IonText>
                            <div className={`text-xs px-2 py-1 rounded-full ${pickup.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : pickup.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : pickup.status === "inProgress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"}`}>
                              {pickup.status}
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{pickup.addressData.address}</div>
                          <div className="text-xs mt-1 text-slate-600">
                            {pickup.materials
                              .map((m) =>
                                m.type
                                  .split("-")
                                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                  .join(" ")
                              )
                              .join(", ")}
                          </div>
                        </div>
                      ))
                    ) : (
                      <IonText className="text-xs text-gray-500">No upcoming pickups.</IonText>
                    )}
                  </div>
                </IonCol>
              </IonRow>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>
    );
  }


  return (
    <section className="flex-grow flex flex-col overflow-auto">
      <IonRow className="ion-padding-horizontal w-full">
        <IonCol size="12" className="text-base font-bold w-full">
          <IonSelect
            className="w-full flex justify-end align-end"
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

      <AnimatePresence mode="wait">
        <motion.div
          key="material-card-dropdown"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full ion-padding-horizontal"
        >
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
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showDropdown && (
          <motion.div
            key="material-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full ion-padding-horizontal"
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
                        handleChange("materials", [])
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
                      }}>
                      Confirm
                    </IonButton>
                  </div>
                </IonItem>
              </IonCol>
            </IonRow>
          </motion.div>
        )}
      </AnimatePresence>

      {formData.materials.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key="material-list"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="w-full ion-padding"
          >
            <IonRow className="bg-orange-50 rounded-md">
              <IonCol size="12" className="flex flex-col ion-padding border-b-orange-200 border-b-1">
                <IonText className="font-medium text-green-800">Material(s)</IonText>
              </IonCol>

              <IonCol size="12">
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
                  className="w-full"
                >
                  <div className="bg-yellow-50 border-t-orange-200 border-t-1 rounded-b-md">
                    <IonItem lines="none" className="rounded-b-md">
                      <IonCheckbox
                        checked={formData.disclaimerAccepted}
                        onIonChange={(e) => handleChange("disclaimerAccepted", e.detail.checked)}
                        slot="start"
                      />
                      <IonText className="text-xs text-gray-800 pl-4 ion-padding-vertical">
                        I have read and agree to the material handling policies.
                      </IonText>
                    </IonItem>
                  </div>
                </motion.div>
              )}
            </IonRow>
          </motion.div>
        </AnimatePresence>
      )}



      {/* Pickup Date & Time (only if at least one material is selected) */}
      <AnimatePresence mode="wait">
        {formData.materials.length > 0 && formData.disclaimerAccepted && (
          <motion.div
            key="pickup-date"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="w-full ion-padding"
          >
            <IonRow className="ion-padding bg-orange-50 rounded-md">
              <IonCol size="12" className="text-center">
                <IonText className="text-sm font-bold w-full">Pickup Date & Time</IonText>
              </IonCol>
              <IonCol>
                {!pickupTimeConfirmed ? (
                  <>
                    <IonDatetime
                      presentation="date-time"
                      value={tempPickupTime}
                      className="rounded-md w-full"
                      onIonChange={(e) => {
                        const iso = e.detail.value?.toString();
                        if (iso) setTempPickupTime(iso);
                      }}
                      min={tomorrow7am.toISOString()}
                      minuteValues="0,15,30,45"
                    />
                    <div className="mt-2 flex flex-col gap-2">
                      <IonText className="text-sm">
                        Selected: {dayjs(tempPickupTime).format("dddd, MMM D • h:mm A")}
                      </IonText>
                      <IonButton
                        size="small"
                        color="success"
                        onClick={() => {
                          handleChange("pickupTime", tempPickupTime);
                          setPickupTimeConfirmed(true);
                        }}
                      >
                        Confirm Pickup Time
                      </IonButton>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 ion-padding">
                    <IonText className="text-sm">
                      Confirmed: {dayjs(formData.pickupTime).format("dddd, MMM D • h:mm A")}
                    </IonText>
                    <IonButton
                      size="small"
                      color="light"
                      fill="solid"
                      onClick={() => setPickupTimeConfirmed(false)}
                    >
                      Edit Pickup Time
                    </IonButton>
                  </div>
                )}
              </IonCol>
            </IonRow>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence mode="wait">
        {formData.materials.length > 0 && formData.pickupTime && (
          <motion.div
            key="disclaimer-and-submit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {/* Show submit only if disclaimer accepted or not required */}
            {(formData.disclaimerAccepted || !requiresDisclaimer) && (
              <IonRow className="gap-2 w-full ion-padding">
                <IonCol size="auto" className="mx-auto">
                  <IonButton size="small" onClick={handleSubmit}>
                    Submit Pickup
                  </IonButton>
                </IonCol>
              </IonRow>
            )}
          </motion.div>
        )}
      </AnimatePresence>



    </section>
  );
};

export default UserPickups;
