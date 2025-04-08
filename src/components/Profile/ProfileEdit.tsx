import {useState, useEffect} from "react";
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
  IonSpinner,
  IonText,
  IonAlert
} from "@ionic/react";
import {useProfile, UserProfile} from "../../context/ProfileContext";
import {toast} from "react-toastify";

// ** Define Props Interface **
interface ProfileEditProps {
  profile: UserProfile | null;
  onClose: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({profile, onClose}) => {
  const {updateProfile, deleteProfile} = useProfile();
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New state to manage editing mode and saving/loading status
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      setLoading(false);
      setFormData({
        displayName: profile.displayName,
        email: profile.email,
        photoURL: profile.photoURL,
        uid: profile.uid,
        locations: profile.locations,
        pickups: profile.pickups,
        accountType: profile.accountType
      });
    } else {
      setError("Failed to load profile. Please try again.");
      setLoading(false);
    }
  }, [profile]);

  // ✅ Handle input changes (Fixed event typing)
  const handleChange = (e: CustomEvent) => {
    const target = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value
    }));
  };

  // ✅ Handle button click which acts as "Edit" and "Save"
  const handleEditSaveButtonClick = async () => {
    // If not already editing, turn on edit mode
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // If already in editing mode, attempt to save
    if (!profile) return;
    setIsSaving(true);
    try {
      if (formData.displayName) {
        await updateProfile("displayName", formData.displayName);
      }
      if (formData.email) {
        await updateProfile("email", formData.email);
      }
      if (formData.photoURL) {
        await updateProfile("photoURL", formData.photoURL);
      }
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Handle profile deletion
  const handleDeleteProfile = async () => {
    try {
      await deleteProfile();
      toast.warn("Profile deleted!");
      onClose();
    } catch (error) {
      console.error("❌ Error deleting profile:", error);
      toast.error("Failed to delete profile.");
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding flex items-center justify-center">
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonContent className="ion-padding flex items-center justify-center">
          <IonText color="danger">{error}</IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="fixed">Name</IonLabel>
          <IonInput
            name="displayName"
            value={formData.displayName || ""}
            onIonInput={handleChange}
            disabled={!isEditing}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="fixed">Email</IonLabel>
          <IonInput
            name="email"
            type="email"
            value={formData.email || ""}
            onIonInput={handleChange}
            disabled={!isEditing}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="fixed">Profile Picture URL</IonLabel>
          <IonInput
            name="photoURL"
            type="text"
            value={formData.photoURL || ""}
            onIonInput={handleChange}
            disabled={!isEditing}
          />
        </IonItem>
      </IonContent>

      <IonFooter className="ion-padding drop-shadow-none shadow-none">
        <div className="gap-2 flex flex-col max-w-xs mx-auto">
          <IonButton
            expand="block"
            color="primary"
            onClick={handleEditSaveButtonClick}
            disabled={isSaving}
          >
            {isSaving ? (
              <IonSpinner name="crescent" />
            ) : isEditing ? (
              "Save"
            ) : (
              "Edit"
            )}
          </IonButton>
          <IonButton
            expand="block"
            color="danger"
            onClick={() => setShowDeleteAlert(true)}
          >
            Delete
          </IonButton>
          <IonButton expand="block" fill="outline" onClick={onClose}>
            Cancel
          </IonButton>
        </div>
      </IonFooter>

      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header={"Delete Profile"}
        message={
          "Are you sure you want to delete your profile? This action cannot be undone."
        }
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              setShowDeleteAlert(false);
            }
          },
          {
            text: "Delete",
            handler: () => {
              handleDeleteProfile();
            }
          }
        ]}
      />
    </IonPage>
  );
};

export default ProfileEdit;
