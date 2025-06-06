// Full updated Pickups component with form validation, reset, and toast feedback

import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonText,
  IonModal,
  IonIcon,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonItem,
  IonCheckbox,
  IonToast,
  IonHeader,
  IonSpinner
} from "@ionic/react";
import CreatePickup from "./CreatePickup";
import {
  arrowDown,
  list
} from "ionicons/icons";
import { useProfile, UserProfile } from "../../context/ProfileContext";
import { usePickups } from "../../context/PickupsContext";
import ViewPickups from "./ViewPickups";
import PickupsQueue from "./PickupsQueue";
import CreateLocation from "../Profile/CreateLocation";
import Schedule from "../Map/Schedule";
import dayjs from "dayjs";
import { useUserLocations } from "../../hooks/useUserLocations";
import type { PickupData, MaterialType } from "../../types/pickups";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

interface PickupsProps {
  profile: UserProfile | null;
}

type ModalKeys = "createPickupOpen" | "createLocationOpen" | "scheduleOpen";

const Pickups: React.FC<PickupsProps> = ({ profile }) => {
  const [modalState, setModalState] = useState<Record<ModalKeys, boolean>>({
    createPickupOpen: false,
    createLocationOpen: false,
    scheduleOpen: false
  });

  const [formData, setFormData] = useState<PickupData>({
    pickupTime: dayjs().add(1, "day").hour(7).minute(0).second(0).toISOString(),
    addressData: { address: "" },
    materials: []
  });

  const handleAcceptPickup = async (pickupId: string) => {
    if (!profile?.uid) return;
    setAcceptingPickupId(pickupId);
    try {
      await updatePickup(pickupId, {
        acceptedBy: profile.uid,
        isAccepted: true,
      });

      await updateProfile(profile.uid, {
        pickups: [...(profile.pickups || []), pickupId],
      });

      toast.success("Pickup accepted!");
    } catch (err) {
      console.error("Error accepting pickup", err);
      toast.error("Failed to accept pickup.");
    } finally {
      setAcceptingPickupId(null);
    }
  };


  const locationIds = Array.isArray(profile?.locations) ? profile.locations : [];
  const { locations: userLocations } = useUserLocations(locationIds);
  const tomorrow7am = dayjs().add(1, "day").hour(7).minute(0).second(0);
  const { createPickup, updatePickup, availablePickups, fetchUserOwnedPickups, userOwnedPickups } = usePickups();
  const { updateProfile } = useProfile();
  const upcomingPickups = (userOwnedPickups ?? []).filter((pickup) =>
    dayjs(pickup.pickupTime).isAfter(dayjs())
  );

  useEffect(() => {
    if (profile?.uid) {
      fetchUserOwnedPickups(profile.uid);
    }
  }, [profile?.uid]);

  const handleSubmit = async () => {
    if (!formData.addressData.address) {
      toast.error("Select a valid address.");
      return;
    }
    if (!formData.pickupTime) {
      toast.error("Select a pickup date & time.");
      return;
    }
    if (formData.materials.length === 0) {
      toast.error("Select at least one material.");
      return;
    }


    const pickupData: PickupData = {
      pickupTime: formData.pickupTime,
      addressData: formData.addressData,
      materials: formData.materials
    };

    console.log("📤 Submitting PickupData:", pickupData);
    const result = await createPickup(pickupData);

    if (result) {
      setFormData({
        pickupTime: dayjs().add(1, "day").hour(7).minute(0).second(0).toISOString(),
        addressData: { address: "" },
        materials: []
      });
      setShowDropdown(false);
    }
  };

  const openModal = (modalName: ModalKeys) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setModalState((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: ModalKeys) => {
    setModalState((prev) => ({ ...prev, [modalName]: false }));
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const [acceptingPickupId, setAcceptingPickupId] = useState<string | null>(null);


  const handleChange = <K extends keyof typeof formData>(key: K, value: typeof formData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (!profile) {
    return (
      <IonGrid className="h-full flex items-center justify-center">
        <IonRow>
          <IonCol className="text-center">
            <IonButton color="primary" expand="block">
              Loading Profile...
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }

  const activePickups = (availablePickups ?? []).filter(
    (pickup) => pickup.createdBy?.userId === profile.uid
  );

  if (activePickups.length >= 2) {
    toast.error("Only 2 active pickups allowed.");
    return;
  }

  return (
    <main className="container h-full max-w-2xl mx-auto flex flex-col overflow-auto drop-shadow-xl md:py-4 md:rounded-md ion-padding">
      <IonModal
        isOpen={modalState.createPickupOpen}
        backdropDismiss={false}
        onDidDismiss={() => closeModal("createPickupOpen")}
      >
        <CreatePickup profile={profile} handleClose={() => closeModal("createPickupOpen")} />
      </IonModal>

      <IonModal
        isOpen={modalState.createLocationOpen}
        onDidDismiss={() => closeModal("createLocationOpen")}
      >
        <CreateLocation profile={profile} handleClose={() => closeModal("createLocationOpen")} />
      </IonModal>

      <IonModal isOpen={modalState.scheduleOpen} onDidDismiss={() => closeModal("scheduleOpen")}>
        <Schedule handleClose={() => closeModal("scheduleOpen")} />
      </IonModal>

      <IonRow className="ion-padding flex items-center justify-between border-b border-slate-200">
        <IonCol size="9">
          <div className="flex flex-col items-start justify-end space-y-1">
            <IonText className="text-2xl font-semibold text-gray-900">
              Hi There, {profile.displayName}
            </IonText>
            <IonText></IonText>
          </div>
        </IonCol>
      </IonRow>

      {profile?.accountType === "User"
        ? <section className="flex-grow overflow-auto">
          <IonRow className="ion-padding-bottom justify-end">
            <IonCol size="auto" className="text-base font-bold">
              <IonSelect
                label=""
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

          <IonRow onClick={() => setShowDropdown(!showDropdown)}
            className={`bg-white rounded-lg ion-padding-horizontal justify-between items-center cursor-pointer transition-all duration-200 hover:border hover:border-[#75B657] ${showDropdown ? 'rounded-b-none' : ''}`}>
            <IonCol>
              <div className="text-sm py-2">What material are you recycling?</div>
            </IonCol>
            <IonCol size="auto">
              <IonButton size="small" fill="clear" onClick={(e) => {
                e.stopPropagation(); // Prevent double toggle from button + row
                setShowDropdown(!showDropdown);
              }}>
                <IonIcon icon={arrowDown} />
              </IonButton>
            </IonCol>
          </IonRow>

          {showDropdown && (
            <IonRow className="w-full rounded-b-lg animate-slide-down ion-padding bg-white border-1 border-[#75B657] mt-1">
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
              </IonCol>
            </IonRow>
          )}

          {formData.materials.length > 0 && (
            <IonRow className="ion-padding-vertical">
              <IonCol className="ion-padding-bottom flex flex-col">
                <IonText className="text-sm font-medium text-green-800">
                  Material:
                </IonText>
                <IonText>
                  {formData.materials.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}
                </IonText>
              </IonCol>
              <IonCol size="12">
                <IonLabel className="text-xs font-bold" position="fixed">Pickup Date & Time</IonLabel>
                <IonDatetime
                  presentation="date-time"
                  value={formData.pickupTime}
                  className="rounded-md"
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
            {formData.materials.length === 0 && (
              <motion.section
                key="active-pickups"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <IonHeader className="shadow-none ion-padding-vertical">Active Pickup(s)</IonHeader>
                <IonRow className="ion-padding border-1 border-dotted rounded-lg">
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
        : <section className="flex-grow ion-padding-vertical overflow-auto flex flex-col">
          <IonRow className="ion-padding-bottom">
            <IonCol>
              <IonText className="text-xl font-semibold text-gray-800">Available Pickups</IonText>
            </IonCol>
          </IonRow>

          {acceptingPickupId ? (
            <IonRow className="w-full h-full justify-center items-center">
              <IonCol className="flex justify-center">
                <IonText className="text-base font-medium text-gray-700 mr-2">Accepting...</IonText>
                <IonSpinner name="crescent" color="primary" />
              </IonCol>
            </IonRow>
          ) : availablePickups.length > 0 ? (
            availablePickups.map((pickup) => (
              <IonRow key={pickup.id} className="mb-4 p-2 border border-gray-200 rounded-md bg-white">
                <IonCol size="12">
                  <IonText className="font-medium text-base text-xs">
                    {pickup.addressData?.address || "No address"}
                  </IonText>
                  <p className="text-gray-800">
                    {dayjs(pickup.pickupTime).format("dddd, MMM D • h:mm A")}
                  </p>
                  <p className="text-sm">
                    Materials: {pickup.materials.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}
                  </p>
                </IonCol>
                <IonCol size="12" className="flex justify-start ion-padding-top">
                  <IonButton
                    size="small"
                    color="success"
                    onClick={() => handleAcceptPickup(pickup.id)}
                  >
                    Accept
                  </IonButton>
                </IonCol>
              </IonRow>
            ))
          ) : (
            <IonRow className="flex-grow">
              <IonCol className="flex items-center justify-center">
                <IonText className=" text-gray-500 font-bold">No pickups available right now.</IonText>
              </IonCol>
            </IonRow>
          )}

        </section>
      }

      <IonRow className="pt-2 flex mx-auto gap-2">
        <IonCol size="auto">
          <IonButton size="small" onClick={handleSubmit}>Pickup Request</IonButton>
        </IonCol>
        <IonCol size="auto">
          <IonButton size="small" onClick={() => openModal("scheduleOpen")}>
            <IonIcon icon={list}></IonIcon>
          </IonButton>
        </IonCol>
      </IonRow>
    </main>
  );
};

export default Pickups;
