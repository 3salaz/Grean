// Updated CreatePickup with inline expandable disclaimers per material

import React, { useEffect, useState } from "react";
import {
  IonSelect,
  IonSelectOption,
  IonButton,
  IonLabel,
  IonIcon,
  IonRow,
  IonCol,
  IonDatetime,
  IonList,
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonGrid,
  IonCard,
} from "@ionic/react";
import { closeOutline, chevronDownOutline, chevronUpOutline } from "ionicons/icons";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { usePickups } from "../../context/PickupsContext";
import { useUserLocations } from "../../hooks/useUserLocations";
import { useProfile } from "../../context/ProfileContext";



const disclaimers = {
  glass: `Glass must be in rigid, puncture-resistant bins. No plastic or paper bags. Unsafe containers will be declined.`,
  appliances: `Upload a clear photo. We accept standard household appliances. No hazardous components unless certified.`,
  cardboard: `Bundle must be at least 18x18x36\". Must be dry, clean, and flattened. Upload a photo.`,
  "non-ferrous": `Accepted: copper, aluminum, brass, etc. Must be clean, sorted. No ferrous (iron/steel). Photo required.`,
};

const CreatePickup: React.FC = () => {
  const { profile } = useProfile();
  const locationIds = Array.isArray(profile?.locations) ? profile.locations : [];
  const { locations: userLocations } = useUserLocations(locationIds);
  const { createPickup, availablePickups } = usePickups();
  const tomorrow7am = dayjs().add(1, "day").hour(7).minute(0).second(0);
  const [formData, setFormData] = useState({
    pickupTime: tomorrow7am.toISOString(),
    pickupNote: "",
    addressData: { address: "" },
    materials: [],
  });

  const [agreed, setAgreed] = useState<Record<string, boolean>>({});
  const [photos, setPhotos] = useState<Record<string, File | null>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    console.log("🔍 formData updated:", formData);
  }, [formData]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleExpand = (material: string) => {
    setExpanded((prev) => ({ ...prev, [material]: !prev[material] }));
  };

  const handleSubmit = async () => {
    if (!profile) return toast.error("User profile not found.");
    if (!formData.addressData.address) return toast.error("Select a valid address.");
    if (!formData.pickupTime) return toast.error("Select a pickup date & time.");
    if (formData.materials.length === 0) return toast.error("Select at least one material.");

    const activePickups = (availablePickups ?? []).filter(
      (pickup) => pickup.createdBy?.userId === profile.uid
    );
    if (activePickups.length >= 2) {
      toast.error("Only 2 active pickups allowed.");
      return;
    }

    for (const material of formData.materials) {
      if (disclaimers[material] && !agreed[material]) {
        return toast.error(`You must agree to the ${material} disclaimer.`);
      }
      if (["appliances", "cardboard", "non-ferrous"].includes(material) && !photos[material]) {
        return toast.error(`Please upload a photo for ${material}.`);
      }
    }

    console.log("🚀 Creating pickup with data:", formData);
    await createPickup(formData);
  };

  return (
      <IonGrid className="ion-padding">
        <IonCard className="p-4">
          <IonList>
            {/* Address */}
            <IonCol size="12">
              <IonLabel position="stacked">Select Address</IonLabel>
              <IonSelect
                value={formData.addressData.address || ""}
                placeholder="Select address"
                onIonChange={(e) => {
                  const selected = userLocations.find((l) => l.address === e.detail.value);
                  if (selected) {
                    handleChange("addressData", { address: selected.address });
                  }
                }}
              >
                {userLocations.map((loc, idx) => (
                  <IonSelectOption key={idx} value={loc.address}>
                    {loc.address}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonCol>

            {/* Materials */}
            <IonCol>
              <IonLabel position="stacked">Materials</IonLabel>
              <IonSelect
                multiple
                value={formData.materials}
                onIonChange={(e) => handleChange("materials", e.detail.value)}
                placeholder="Select materials"
              >
                {Object.keys(disclaimers).map((key) => (
                  <IonSelectOption key={key} value={key}>
                    {key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonCol>

            {/* DateTime */}
          <IonCol size="12" >
            <IonLabel className="text-xs font-bold" position="stacked">Pickup Date & Time</IonLabel>
            <IonDatetime
              value={formData.pickupTime}
              min={tomorrow7am.toISOString()}
              presentation="date-time"
              className="rounded-sm"
              onIonChange={(e) => handleChange("pickupAt", e.detail.value?.toString() || "")}
              minuteValues="0,15,30,45"
            />
          </IonCol>

            {/* Disclaimers */}
            {formData.materials.map((material) => (
              <IonCol key={material} className="pt-4">
                <IonLabel className="font-bold text-sm">
                  {material.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Disclaimer
                </IonLabel>

                <IonButton
                  fill="clear"
                  size="small"
                  onClick={() => toggleExpand(material)}
                  className="-ml-2"
                >
                  <IonIcon
                    icon={expanded[material] ? chevronUpOutline : chevronDownOutline}
                  />
                  <span className="text-xs pl-1">{expanded[material] ? "Hide" : "Read"} Disclaimer</span>
                </IonButton>

                {expanded[material] && (
                  <p className="text-xs text-slate-700 whitespace-pre-wrap">
                    {disclaimers[material]}
                  </p>
                )}

                {["appliances", "cardboard", "non-ferrous"].includes(material) && (
                  <div className="mt-2">
                    <IonLabel className="text-xs">Upload Photo:</IonLabel>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setPhotos((prev) => ({
                          ...prev,
                          [material]: e.target.files?.[0] || null,
                        }))
                      }
                    />
                  </div>
                )}

                <label className="flex items-center text-xs pt-2">
                  <input
                    type="checkbox"
                    checked={agreed[material] || false}
                    onChange={(e) =>
                      setAgreed((prev) => ({ ...prev, [material]: e.target.checked }))
                    }
                  />
                  <span className="pl-2">I agree to the {material} disclaimer</span>
                </label>
              </IonCol>
            ))}
          </IonList>

          <IonRow className="mt-4">
            <IonCol className="flex gap-2 justify-center">
              <IonButton size="small" onClick={handleSubmit}>
                Create Pickup
              </IonButton>
            </IonCol>
          </IonRow>
        </IonCard>
      </IonGrid>
  );
};

export default CreatePickup;

