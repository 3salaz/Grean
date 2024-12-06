import React, { useState, useEffect } from "react";
import {
  IonGrid,
  IonCard,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonModal,
  IonLoading,
} from "@ionic/react";
import { cloudUploadOutline, closeOutline } from "ionicons/icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Cropper from "react-easy-crop";
import { toast } from "react-toastify";
import { useAuthProfile } from "../../../context/AuthProfileContext";
import "react-toastify/dist/ReactToastify.css";
import { storage } from "../../../firebase";

const getCroppedImg = async (imageSrc, crop, width, height) => {
  const canvas = document.createElement("canvas");
  const img = new Image();
  img.src = imageSrc;

  await new Promise((resolve) => (img.onload = resolve));

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const scaleX = img.naturalWidth / img.width;
  const scaleY = img.naturalHeight / img.height;

  ctx.drawImage(
    img,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    width,
    height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(URL.createObjectURL(blob));
      else reject(new Error("Canvas is empty"));
    }, "image/png");
  });
};

function CreateProfile({ handleClose }) {
  const { profile, updateProfileData } = useAuthProfile(); // Use profile from context
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Load initial profile data 

  useEffect(() => {
    console.log("Profile data:", profile); // Debugging
    if (profile) {
      setDisplayName(profile.displayName || "");
      setProfilePic(profile.profilePic || "");
      setLoading(false);
    } else {
      console.log("Profile is null or undefined");
      setLoading(false);
    }
  }, [profile]);
  

  // Handle display name input change
  const handleDisplayNameChange = (e) => setDisplayName(e.detail.value);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Crop the image
  const handleCropAndUpload = async () => {
    if (!croppedAreaPixels || !image) return;

    try {
      const croppedImg = await getCroppedImg(image, croppedAreaPixels, 300, 300);
      setProfilePic(croppedImg);
      setImage(null); // Close cropper modal
    } catch (error) {
      console.error("Cropping failed:", error);
      toast.error("Failed to crop the image. Please try again.");
    }
  };

  // Upload image to Firebase Storage
  const uploadImageAndGetUrl = async () => {
    if (!profilePic.startsWith("blob:")) return profilePic;

    setUploading(true);
    try {
      const storageRef = ref(storage, `userStorage/${profile.uid}/profilePic.png`);
      const response = await fetch(profilePic);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Save profile data
  const handleSubmit = async () => {
    if (!displayName.trim() || !profilePic) {
      toast.error("Both display name and profile picture are required.");
      return;
    }
    
    try {
      const updatedPic = await uploadImageAndGetUrl();
      if (updatedPic) {
        await updateProfileData(profile.uid, { displayName, profilePic: updatedPic });
        toast.success("Profile updated successfully!");
        handleClose();
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to save profile.");
    }
  };

  // Show spinner while loading
  if (loading) {
    return <IonLoading isOpen={loading} message="Loading profile..." />;
  }

  return (
    <IonGrid className="ion-padding h-full bg-orange">
      <IonCard className="w-full h-full shadow-none max-w-3xl m-auto bg-white flex flex-col justify-between p-2">
        <IonRow className="justify-center items-end rounded-md bg-light">
          <IonCol size="auto" className="flex flex-col items-center">
            <div className="profile-pic-container flex flex-col items-center">
              {profilePic ? (
                <div className="relative flex flex-col items-center">
                  <IonButton
                    color="danger"
                    size="small"
                    className="absolute w-5 p-0 h-5 top-0 left-0 rounded-full"
                    onClick={() => setProfilePic("")}
                  >
                    <IonIcon icon={closeOutline} />
                  </IonButton>
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-green-500 shadow-md"
                  />
                </div>
              ) : (
                <div className="relative flex flex-col items-center">
                  <input
                    type="file"
                    accept="image/*"
                    id="profile-pic-input"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <IonButton
                    color="secondary"
                    onClick={() =>
                      document.getElementById("profile-pic-input").click()
                    }
                  >
                    <IonIcon icon={cloudUploadOutline} slot="start" />
                    Upload
                  </IonButton>
                </div>
              )}
            </div>
          </IonCol>
          <IonCol size="5">
            <IonItem>
              <IonLabel position="stacked">Display Name</IonLabel>
              <IonInput
                value={displayName}
                onIonChange={handleDisplayNameChange}
                placeholder="What should we call you?"
              />
            </IonItem>
          </IonCol>
        </IonRow>

        <IonRow className="ion-padding ion-justify-content-end">
          <IonCol size="auto">
            <IonButton expand="block" onClick={handleSubmit}>
              Save Profile
            </IonButton>
          </IonCol>
        </IonRow>
        
      </IonCard>

      <IonModal isOpen={!!image} onDidDismiss={() => setImage(null)}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(croppedArea, pixels) => setCroppedAreaPixels(pixels)}
        />
        <IonButton expand="block" onClick={handleCropAndUpload}>
          Crop and Save
        </IonButton>
      </IonModal>

      <IonLoading isOpen={uploading} message="Uploading..." />
    </IonGrid>
  );
}

export default CreateProfile;
