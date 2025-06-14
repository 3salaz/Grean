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
  closeOutline,
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
import UserPickups from "./UserPickups";
import DriverPickups from "./DriverPickups";

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
        status: "accepted",
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

      <IonRow className="ion-padding-vertical flex items-center justify-between border-b border-slate-200">
        <IonCol size="9">
          <div className="flex flex-col items-start justify-end space-y-1">
            <IonText className="text-2xl font-semibold text-gray-900">
              Hello there, {profile.displayName}
            </IonText>
            <IonText></IonText>
          </div>
        </IonCol>
      </IonRow>

      {profile?.accountType === "User"
        ? <UserPickups
          formData={formData}
          handleChange={handleChange}
          userLocations={userLocations}
        />
        : <DriverPickups />
      }

      {profile?.accountType === "User"
        ? <IonRow className="pt-2 flex mx-auto gap-2">
          <IonCol size="auto">
            <IonButton size="small" onClick={handleSubmit}>Request</IonButton>
          </IonCol>
          <IonCol size="auto">
            <IonButton size="small" onClick={() => openModal("scheduleOpen")}>
              <IonIcon icon={list}></IonIcon>
            </IonButton>
          </IonCol>
        </IonRow>
        : <IonRow className="pt-2 flex mx-auto gap-2">
          <IonCol size="auto">
            <IonButton size="small" onClick={handleSubmit}>View Routes</IonButton>
          </IonCol>
          <IonCol size="auto">
            <IonButton size="small" onClick={() => openModal("scheduleOpen")}>
              <IonIcon icon={list}></IonIcon>
            </IonButton>
          </IonCol>
        </IonRow>}

    </main>
  );
};

export default Pickups;
