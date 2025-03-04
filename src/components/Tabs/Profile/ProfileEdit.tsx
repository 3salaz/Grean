import { useState, useEffect } from "react";
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
  IonPage,
} from "@ionic/react";
import { useProfile } from "../../../context/ProfileContext";
import { toast } from "react-toastify";

// ** Define Props Interface **
interface ProfileEditProps {
  onClose: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ onClose }) => {
  const { profile, updateProfile, deleteProfile } = useProfile();

  // ✅ Ensure profile data is loaded before rendering
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    profilePic: "",
    accountType: "User",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        email: profile.email || "",
        profilePic: profile.profilePic || "",
        accountType: profile.accountType || "User",
      });
    }
  }, [profile]);

  // ✅ Handle input changes
  const handleChange = (e: CustomEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle saving profile changes
  const handleSave = async () => {
    try {
      await updateProfile("displayName", formData.displayName);
      await updateProfile("email", formData.email);
      await updateProfile("profilePic", formData.profilePic);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  // ✅ Handle profile deletion
  const handleDelete = async () => {
    try {
      await deleteProfile();
      toast.warn("Profile deleted!");
      onClose();
    } catch (error) {
      console.error("❌ Error deleting profile:", error);
      toast.error("Failed to delete profile.");
    }
  };

  if (!profile) {
    return (
      <IonPage>
        <IonContent className="ion-padding flex items-center justify-center">
          <IonLabel>Loading profile...</IonLabel>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
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
    </IonPage>
  );
};

export default ProfileEdit;
