import { useState } from "react";
import {
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonFooter,
  IonButtons,
} from "@ionic/react";
import { useProfile, UserProfile } from "../../../context/ProfileContext";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../../firebase"; // Import the initialized functions

interface ProfileEditProps {
  profile: UserProfile | null;
  onClose: () => void;
}

const updateUserProfile = httpsCallable(functions, "updateUserProfileFunction");
const ProfileEdit: React.FC<ProfileEditProps> = ({ onClose }) => {
  const { profile, updateProfile, deleteProfile } = useProfile();

  // Store all profile fields in state
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || "",
    email: profile?.email || "",
    profilePic: profile?.profilePic || "",
    accountType: profile?.accountType || "User",
  });

  const handleChange = (e: CustomEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await updateUserProfile({
        displayName: formData.displayName,
        email: formData.email,
        profilePic: formData.profilePic,
      });

      console.log(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDelete = async () => {
    if (!profile) return;

    try {
      await deleteProfile();
      onClose();
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Profile</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="fixed">Name</IonLabel>
          <IonInput
            name="displayName"
            value={formData.displayName}
            onIonInput={handleChange}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="fixed">Email</IonLabel>
          <IonInput
            name="email"
            type="email"
            value={formData.email}
            onIonInput={handleChange}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="fixed">Profile Picture URL</IonLabel>
          <IonInput
            name="profilePic"
            type="text"
            value={formData.profilePic}
            onIonInput={handleChange}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="fixed">Account Type</IonLabel>
          <IonInput
            name="accountType"
            type="text"
            value={formData.accountType}
            onIonInput={handleChange}
          />
        </IonItem>
      </IonContent>

      <IonFooter className="ion-padding">
        <IonButton expand="block" color="primary" onClick={handleSave}>
          Save
        </IonButton>
        <IonButton expand="block" color="danger" onClick={handleDelete}>
          Delete
        </IonButton>
        <IonButton expand="block" fill="outline" onClick={onClose}>
          Cancel
        </IonButton>
      </IonFooter>
    </>
  );
};

export default ProfileEdit;
