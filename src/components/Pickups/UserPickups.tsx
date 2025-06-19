import React, { useState } from "react";
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
  IonLoading
} from "@ionic/react";
import { arrowDown } from "ionicons/icons";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { usePickups } from "../../context/PickupsContext";
import { materialConfig, type MaterialType, type PickupData } from "../../types/pickups";

interface Props {
  formData: PickupData;
  handleChange: <K extends keyof PickupData>(key: K, value: PickupData[K]) => void;
  userLocations: { address: string }[];
}

const UserPickups: React.FC<Props> = ({ formData, handleChange, userLocations }) => {
  const { userOwnedPickups } = usePickups();
  const [showDropdown, setShowDropdown] = useState(false);
  const tomorrow7am = dayjs().add(1, "day").hour(7).minute(0).second(0);
  const materialDisclaimers: Record<string, string> = {
    glass: "Glass must be rinsed and free of labels. Broken glass is not accepted.",
    cardboard: "Cardboard must be flattened. Wax-coated boxes are not recyclable.",
    appliances: "Ensure appliances are unplugged and emptied before pickup.",
    "non-ferrous": "Non-ferrous metals must be sorted separately and clean."
  };


  const upcomingPickups = (userOwnedPickups ?? []).filter((pickup) =>
    dayjs(pickup.pickupTime).isAfter(dayjs())
  );

  const [acceptedDisclaimers, setAcceptedDisclaimers] = useState<string[]>([]);
  const [disclaimerMaterial, setDisclaimerMaterial] = useState<MaterialType | null>(null);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  const [showLoading, setShowLoading] = useState(false);
  const requiresDisclaimer = formData.materials.some(
    (m) => materialConfig[m.type]?.requiresAgreement
  );


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
            className={`bg-white rounded-lg ion-padding-horizontal justify-between items-center cursor-pointer transition-all duration-200 border-white border hover:border-[#75B657] ${showDropdown ? "rounded-b-none" : ""}`}
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
                      checked={formData.materials.some((m) => m.type === material)}
                      onIonChange={(e) => {
                        const selected = e.detail.checked;
                        const updated = selected
                          ? [...formData.materials, { type: material as MaterialType, weight: 0 }]
                          : formData.materials.filter((m) => m.type !== material);
                        handleChange("materials", updated);
                      }}
                    />
                    <IonLabel className="text-sm bg-slate-[#75B657] p-2">
                      {material.charAt(0).toUpperCase() + material.slice(1).replace("-", " ")}
                    </IonLabel>
                  </IonItem>
                ))}
                <IonItem className="flex">
                  <div className="flex gap-2">
                    <IonButton size="small" onClick={() => handleChange("materials", [])} color="danger">
                      Clear
                    </IonButton>
                    <IonButton size="small" onClick={() => setShowDropdown(false)} color="primary">
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
            key="material-card-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="w-full ion-padding"
          >

            <IonRow className="">
              <IonCol size="12" className="flex flex-col">
                <IonText className="font-medium text-green-800">Material</IonText>
              </IonCol>
              <IonCol size="12">
                <div className="flex flex-col flex-wrap gap-4">
                  {formData.materials.map((m, i) => {
                    const formattedName = m.type
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ");
                    const disclaimer = materialDisclaimers[m.type] || "No disclaimer available.";

                    return (
                      <div
                        key={i}
                        className="border border-gray-300 rounded-md px-3 py-2 bg-orange-100 text-gray-800 text-sm"
                      >
                        <strong>{formattedName}</strong>
                        <p className="mt-1 text-gray-600 text-xs">{disclaimer}</p>
                      </div>
                    );
                  })}
                </div>
              </IonCol>
            </IonRow>
          </motion.div>

        </AnimatePresence>


      )}


      <IonRow>
        <IonCol size="12" className="ion-padding-vertical">
          <IonLabel className="text-sm font-bold">
            Pickup Date & Time
          </IonLabel>
          <IonDatetime
            presentation="date-time"
            value={formData.pickupTime}
            className="rounded-md w-full"
            onIonChange={(e) => {
              const iso = e.detail.value?.toString();
              if (iso) handleChange("pickupTime", iso);
            }}
            min={tomorrow7am.toISOString()}
            minuteValues="0,15,30,45"
          />
        </IonCol>
      </IonRow>


      <AnimatePresence mode="wait">
        {formData.materials.length === 0 && !showDropdown && (
          <motion.section
            key="active-pickups"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="flex-end flex-grow flex flex-col ion-padding"
          >
            <IonHeader className="shadow-none ion-padding-vertical">Users Pickup(s)</IonHeader>
            <IonRow className="ion-padding border-1 border-dotted rounded-lg flex-grow">
              <IonCol>
                {upcomingPickups.length > 0 ? (
                  upcomingPickups.map((pickup) => (
                    <div key={pickup.id} className="mb-2">
                      <IonText className="text-sm font-medium">
                        {dayjs(pickup.pickupTime).format("dddd, MMM D • h:mm A")}
                      </IonText>
                      <div className="text-xs text-slate-500">{pickup.addressData.address}</div>
                      <div className="text-xs">
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
              </IonCol>
            </IonRow>
          </motion.section>
        )}
      </AnimatePresence>

      {requiresDisclaimer && !formData.disclaimerAccepted && (
        <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
          <IonText className="text-sm text-gray-800 font-medium">
            By scheduling this pickup, you confirm that you have read and agree to our material handling policies. Failure to comply may result in refusal of service.
          </IonText>
          <div className="flex gap-3 mt-3">
            <IonButton
              size="small"
              color="success"
              onClick={() => handleChange("disclaimerAccepted", true)}
            >
              Accept
            </IonButton>
            <IonButton
              size="small"
              color="danger"
              onClick={() => {
                handleChange("materials", []);
                handleChange("disclaimerAccepted", false);
              }}
            >
              Decline
            </IonButton>
          </div>
        </div>
      )}


    </section>
  );
};

export default UserPickups;
