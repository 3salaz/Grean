// Component: MaterialSelector.tsx
import React from "react";
import { IonRow, IonCol, IonButton, IonIcon, IonCheckbox, IonLabel, IonItem } from "@ionic/react";
import { arrowDown } from "ionicons/icons";
import { motion } from "framer-motion";
import { materialTypes } from "@/features/pickups/types/pickups";

type MaterialSelectorProps = {
  showDropdown: boolean;
  setShowDropdown: (value: boolean) => void;
  tempMaterials: any[]; // ideally use your actual MaterialEntry[] type here
  setTempMaterials: (value: any[]) => void;
  confirmMaterials: (materials: any[]) => void;
};

const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  showDropdown,
  setShowDropdown,
  tempMaterials,
  setTempMaterials,
  confirmMaterials
}) => {
    return (
  <motion.div
    key="material-card-container"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="w-full"
  >
    <IonRow
      onClick={() => setShowDropdown(!showDropdown)}
      className={`bg-white rounded-2xl ion-padding-horizontal justify-between items-center cursor-pointer transition-all duration-200 border-white border hover:border-[#75B657] ${showDropdown ? "rounded-b-none" : ""}`}
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
                      ? [...tempMaterials, { type: material, weight: 0 }]
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
                    confirmMaterials([]);
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
                    confirmMaterials(tempMaterials);
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
    );

}


export default MaterialSelector;
