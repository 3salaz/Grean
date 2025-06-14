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
  IonHeader
} from "@ionic/react";
import { arrowDown } from "ionicons/icons";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { usePickups } from "../../context/PickupsContext";
import type { MaterialType, PickupData } from "../../types/pickups";

interface Props {
  formData: PickupData;
  handleChange: <K extends keyof PickupData>(key: K, value: PickupData[K]) => void;
  userLocations: { address: string }[];
}

const UserPickups: React.FC<Props> = ({ formData, handleChange, userLocations }) => {
  const { userOwnedPickups } = usePickups();
  const [showDropdown, setShowDropdown] = useState(false);
  const tomorrow7am = dayjs().add(1, "day").hour(7).minute(0).second(0);

  const upcomingPickups = (userOwnedPickups ?? []).filter((pickup) =>
    dayjs(pickup.pickupTime).isAfter(dayjs())
  );

  return (
    <section className="flex-grow flex flex-col overflow-auto">
      <IonRow className="ion-padding-vertical justify-start">
        <IonCol size="auto" className="text-base font-bold">
          <IonSelect
            value={formData.addressData.address || ""}
            className="w-full"
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

      <AnimatePresence mode="wait">
        {showDropdown && (
          <motion.div
            key="material-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <IonRow className="rounded-b-lg ion-padding bg-white border-1 border-[#75B657] mt-1">
              <IonCol size="12" className="rounded-md">
                {["glass", "cardboard", "appliances", "non-ferrous"].map((material) => (
                  <IonItem key={material} lines="none">
                    <IonCheckbox
                      slot="start"
                      checked={formData.materials.includes(material as MaterialType)}
                      onIonChange={(e) => {
                        const selected = e.detail.checked;
                        const updated: MaterialType[] = selected
                          ? [...formData.materials, material as MaterialType]
                          : formData.materials.filter((m) => m !== material);
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
        <IonRow className="ion-padding-vertical">
          <IonCol className="ion-padding flex flex-col">
            <IonText className="text-sm font-medium text-green-800">Material:</IonText>
            <IonText className="">
              {formData.materials.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}
            </IonText>
          </IonCol>
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
      )}

      <AnimatePresence mode="wait">
        {formData.materials.length === 0 && !showDropdown && (
          <motion.section
            key="active-pickups"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="flex-end flex-grow flex flex-col"
          >
            <IonHeader className="shadow-none ion-padding-vertical">Active Pickup(s)</IonHeader>
            <IonRow className="ion-padding border-1 border-dotted rounded-lg flex-grow">
              <IonCol>
                {upcomingPickups.length > 0 ? (
                  upcomingPickups.map((pickup) => (
                    <div key={pickup.id} className="mb-2">
                      <IonText className="text-sm font-medium">
                        {dayjs(pickup.pickupTime).format("dddd, MMM D • h:mm A")}
                      </IonText>
                      <div className="text-xs text-slate-500">{pickup.addressData.address}</div>
                      <div className="text-xs">{pickup.materials.join(", ")}</div>
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
    </section>
  );
};

export default UserPickups;
