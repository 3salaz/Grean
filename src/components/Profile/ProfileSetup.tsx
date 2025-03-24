import {
    IonButton,
    IonGrid,
    IonHeader,
    IonInput,
    IonTitle,
    IonToolbar,
  } from "@ionic/react";
  import { useState } from "react";
  
  const ProfileSetup: React.FC<{ onSave: (displayName: string) => void }> = ({ onSave }) => {
    const [displayName, setDisplayName] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleSave = async () => {
      if (!displayName.trim()) return;
  
      setLoading(true);
      onSave(displayName);
      setLoading(false);
    };
  
    return (
      <IonGrid className="ion-padding">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profile Setup</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="text-center text-gray-600">
          <p>Please enter your display name to continue.</p>
        </div>
        <IonInput
        className="bg-slate-50"
          placeholder="Enter your display name"
          value={displayName}
          onIonInput={(e: CustomEvent) => setDisplayName((e.detail as { value: string }).value)}

          required
        />
        <div className="flex justify-center mt-4">
          <IonButton onClick={handleSave} disabled={loading || !displayName.trim()}>
            {loading ? "Saving..." : "Save"}
          </IonButton>
        </div>
      </IonGrid>
    );
  };
  
  export default ProfileSetup;
  