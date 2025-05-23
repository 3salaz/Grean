import {
  IonButton,
  IonGrid,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  IonImg
} from "@ionic/react";
import {useState} from "react";
import {useProfile} from "../../context/ProfileContext";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import default_img from "../../assets/avatar.svg";
import { useAuth } from "../../context/AuthContext";

interface ProfileSetupProps {
  onComplete: () => void;
}

const ProfileSetup: React.FC = ({ onComplete }) => {
  const {updateProfile} = useProfile();
  const {user} = useAuth();
  const [accountType, setAccountType] = useState("");
  const [photoURL, setphotoURL] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(default_img);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!accountType) return;

    setLoading(true);
    let imageUrl = preview !== default_img ? preview : null;

    if (photoURL) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `profiles/${user.uid}/${photoURL.name}`);
        await uploadBytes(storageRef, photoURL);
        imageUrl = await getDownloadURL(storageRef);
        console.log("✅ Image uploaded successfully:", imageUrl);
      } catch (error) {
        console.error("❌ Error uploading image:", error);
      }
    }

    try {
      await updateProfile("accountType", accountType, "update"); // ✅ Update field separately
      if (imageUrl) {
        await updateProfile("photoURL", imageUrl, "update"); // ✅ Update photoURL separately
      }
      console.log("✅ Profile updated successfully");
    } catch (error) {
      console.error("❌ Failed to update profile:", error);
    }

    setLoading(false);
    onComplete();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setphotoURL(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <IonGrid className="ion-padding">
      <IonToolbar>
        <IonTitle>Profile Setup</IonTitle>
      </IonToolbar>

      <div className="text-center text-gray-600">
        <p>Time to select the type of account you want!</p>
      </div>

      {/* Account Type Dropdown */}
      <IonSelect
        className="mt-4 bg-slate-50"
        placeholder="Select Account Type"
        value={accountType}
        onIonChange={(e) => setAccountType(e.detail.value)}
      >
        <IonSelectOption value="User">User</IonSelectOption>
        <IonSelectOption value="Driver">Driver</IonSelectOption>
      </IonSelect>

      {/* Image Upload with Default Placeholder */}
      <div className="mt-4 flex flex-col items-center">
        <IonImg
          src={preview}
          alt="Profile Preview"
          className="w-24 h-24 rounded-full object-cover border border-gray-300"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-2"
        />
      </div>
      {/* Save Button */}
      <div className="flex justify-center mt-4">
        <IonButton onClick={handleSubmit} disabled={loading || !accountType}>
          {loading ? "Saving..." : "Save"}
        </IonButton>
      </div>
    </IonGrid>
  );
};

export default ProfileSetup;
