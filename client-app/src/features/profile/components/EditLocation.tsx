import { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText
} from "@ionic/react";
import { useLocations } from "../../context/LocationsContext";
import { toast } from "react-toastify";
import { LocationData } from "../../hooks/useUserLocations";

interface EditLocationProps {
  location: LocationData;
  onClose: () => void;
}

const EditLocation: React.FC<EditLocationProps> = ({ location, onClose }) => {
  const { updateLocation } = useLocations();
  const [formData, setFormData] = useState({ ...location });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateLocation(location.id, formData);
      toast.success("Location updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="flex items-center justify-center">
        <IonGrid className="h-full flex flex-col items-center justify-center ion-padding">
        <IonCard className="w-full flex flex-col items-center justify-center ion-no-padding bg-slate-100">
            <IonCardHeader className="ion-padding w-full">
              <IonCardTitle>Edit Location</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="flex flex-col items-center justify-center p-2 w-full text-[#75b657] ion-padding">
              <IonList className="ion-padding">
                <IonItem>
                  <IonLabel position="stacked">Address</IonLabel>
                  <IonInput
                    value={formData.address}
                    onIonChange={(e) => handleInputChange("address", e.detail.value ?? "")}
                  />
                </IonItem>
                {formData.locationType === "Business" && (
                  <>
                    <IonItem>
                      <IonLabel position="stacked">Business Name</IonLabel>
                      <IonInput
                        value={formData.businessName}
                        onIonChange={(e) => handleInputChange("businessName", e.detail.value ?? "")}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Business Phone</IonLabel>
                      <IonInput
                        value={formData.businessPhoneNumber}
                        onIonChange={(e) => handleInputChange("businessPhoneNumber", e.detail.value ?? "")}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Category</IonLabel>
                      <IonSelect
                        value={formData.category}
                        onIonChange={(e) => handleInputChange("category", e.detail.value)}
                      >
                        <IonSelectOption value="Retail">Retail</IonSelectOption>
                        <IonSelectOption value="Food & Beverage">Food & Beverage</IonSelectOption>
                        <IonSelectOption value="Health & Wellness">Health & Wellness</IonSelectOption>
                        <IonSelectOption value="Professional Services">Professional Services</IonSelectOption>
                        <IonSelectOption value="Education">Education</IonSelectOption>
                        <IonSelectOption value="Entertainment">Entertainment</IonSelectOption>
                        <IonSelectOption value="Other">Other</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </>
                )}
                {formData.locationType === "Home" && (
                  <IonItem>
                    <IonLabel position="stacked">Home Name</IonLabel>
                    <IonInput
                      value={formData.homeName}
                      onIonChange={(e) => handleInputChange("homeName", e.detail.value ?? "")}
                    />
                  </IonItem>
                )}
              </IonList>
              <IonRow className="ion-padding-top flex items-center justify-center gap-2">
                <IonCol size="auto">
                  <IonButton size="small" expand="block" onClick={handleUpdate} disabled={loading}>
                    {loading ? <IonSpinner name="dots" /> : "Update"}
                  </IonButton>
                </IonCol>
                <IonCol size="auto">
                  <IonButton size="small" color="medium" expand="block" onClick={onClose}>
                    Cancel
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonCardContent>
          </IonCard>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default EditLocation;