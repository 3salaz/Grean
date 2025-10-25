// Component: StepDetails.tsx
import React from "react";
import {
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonText
} from "@ionic/react";
import { materialConfig } from "@/features/pickups/types/pickups";
import type { MaterialEntry } from "@/features/pickups/types/pickups";

type StepDetailsProps = {
    materials: MaterialEntry[];
    updateMaterials: (materials: MaterialEntry[]) => void;
    disclaimerAccepted: boolean;
    setDisclaimerAccepted: (accepted: boolean) => void;
};



const StepDetails: React.FC<StepDetailsProps> = ({
    materials,
    updateMaterials,
    disclaimerAccepted,
    setDisclaimerAccepted
}) => {
    const handleMaterialChange = <
        K extends keyof MaterialEntry,
        V extends MaterialEntry[K]
    >(
        index: number,
        key: K,
        value: V
    ): void => {
        const updated = materials.map((m, i) =>
            i === index ? { ...m, [key]: value } : m
        );
        updateMaterials(updated);
    };


    const handlePhotoUpload = (index: number, file: File): void => {
        const url = URL.createObjectURL(file);
        const updated = materials.map((m, i) =>
            i === index ? { ...m, photos: [...(m.photos || []), url] } : m
        );
        updateMaterials(updated);
    };


    return (
        <>
            <IonText className="font-bold text-green-800">Pickup Details</IonText>
            {materials.map((m, i) => {
                const config = materialConfig[m.type];
                return (
                    <div key={i} className="mt-4">
                        <IonText>{config.label}</IonText>

                        {(["plastic", "aluminum", "cardboard"].includes(m.type)) && (
                            <IonItem lines="none">
                                <IonLabel position="stacked" className="text-xs">Storage Method</IonLabel>
                                <IonSelect
                                    value={m.storageMethod || ""}
                                    placeholder="Select Storage Option"
                                    onIonChange={(e) => handleMaterialChange(i, "storageMethod", e.detail.value)}
                                >
                                    {m.type !== "cardboard" && (
                                        <>
                                            <IonSelectOption value="bag25">25 gal Personal Bag</IonSelectOption>
                                            <IonSelectOption value="halfGreanBin">1/2 Grean Bin (25 gal)</IonSelectOption>
                                        </>
                                    )}
                                    <IonSelectOption value="greanBin">Full Grean Bin (50 gal)</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        )}

                        {config.min !== undefined && !["plastic", "aluminum", "cardboard"].includes(m.type) && (
                            <IonItem lines="none">
                                <IonLabel position="fixed" className="text-xs">Quantity</IonLabel>
                                <input
                                    type="number"
                                    className="border rounded w-auto p-1 text-sm mt-1"
                                    min={config.min}
                                    max={config.max}
                                    value={m.weight || ""}
                                    onChange={(e) => handleMaterialChange(i, "weight", parseInt(e.target.value) || 0)}
                                />
                            </IonItem>
                        )}

                        {config.requiresPhoto && (
                            <IonItem lines="none">
                                <IonLabel position="stacked" className="text-xs">Upload Photo</IonLabel>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handlePhotoUpload(i, file);
                                    }}
                                />
                            </IonItem>
                        )}

                        {config.requiresAgreement && !disclaimerAccepted && (
                            <IonText className="text-xs text-gray-600">{config.agreementLabel}</IonText>
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default StepDetails;
