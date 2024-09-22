import { useState } from "react";
import { useAuthProfile } from "../../../context/AuthProfileContext";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonLoading,
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/react";
import { toast, ToastContainer } from "react-toastify";
import { cloudUploadOutline, closeOutline } from "ionicons/icons";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./CreateProfile.css";

function CreateProfile({ handleClose }) {
  const { user, updateProfileData } = useAuthProfile();
  const [accountType] = useState("User");
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState(user.photoURL || "");
  const [uploading, setUploading] = useState(false);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Store the selected image file

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.detail.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // Store the image file
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (crop) => {
    if (image && crop.width && crop.height) {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      canvas.toBlob((blob) => {
        setImageFile(new File([blob], "profilePic.png", { type: "image/png" }));
      });
    }
  };

  const uploadImageAndGetUrl = async () => {
    if (!imageFile) return null; // If no image file is selected, skip upload
    setUploading(true);
    try {
      console.log("Uploading image..."); // Add log to track if upload starts
      const storageRef = ref(storage, `profilePics/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      await uploadTask;
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Image uploaded:", downloadURL); // Log the uploaded URL
      setUploading(false);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile picture:", error); // Log errors
      setUploading(false);
      toast.error("Error uploading profile picture: " + error.message);
      return null;
    }
  };

  const handleSubmit = async () => {
    console.log("Submit clicked"); // Log to confirm submit button was clicked
    if (!displayName) {
      toast.error("Please provide a display name.");
      return;
    }

    try {
      console.log("Uploading image..."); // Log before image upload starts
      const downloadURL = await uploadImageAndGetUrl();
      const updatedProfilePic = downloadURL || profilePic;

      console.log("Updating profile..."); // Log before updating profile
      await updateProfileData(user.uid, {
        accountType,
        displayName,
        profilePic: updatedProfilePic,
      });
      console.log("Profile updated successfully!"); // Log on success
      toast.success("Profile updated successfully!");
      handleClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating profile:", error); // Log errors
      toast.error("Error updating profile: " + error.message);
    }
  };

  const handleClearProfilePic = () => {
    setProfilePic("");
    setImageFile(null); // Clear the image file
    setImage(null); // Clear the image preview
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Create Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="ion-padding h-full">
          
          <IonRow className="ion-justify-content-center ion-padding h-full">
            <IonCol
              sizeMd="8"
              sizeSm="12"
              className="h-full w-full flex flex-col items-center justify-center"
            >
              <IonText className="ion-text-start">
                <h2>Basic Details</h2>
              </IonText>

              <div className="min-h-40 ion-text-center flex flex-col items-center justify-center">
                {profilePic ? (
                  <div className="ion-text-center flex flex-col items-center justify-center relative">
                    <IonButton
                      color="danger"
                      size="small"
                      className="absolute top-[-20px] right-[-10px]"
                      onClick={handleClearProfilePic}
                    >
                      <IonIcon
                        className="text-white"
                        slot="icon-only"
                        icon={closeOutline}
                      />
                    </IonButton>
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="bg-orange rounded-full border-2"
                      style={{
                        width: "100px",
                      }}
                    />
                  </div>
                ) : (
                  <div className="ion-text-center">
                    <IonButton color="primary" className="upload-button">
                      <IonIcon icon={cloudUploadOutline} slot="start" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                      Upload
                    </IonButton>
                  </div>
                )}
              </div>

              <IonItem className="ion-margin-top">
                <IonLabel
                  class="flex items-center w-full justify-center font-bold"
                  position="stacked"
                >
                  Display Name
                </IonLabel>
                <IonInput
                  value={displayName}
                  onIonChange={handleDisplayNameChange}
                  className="w-full text-center"
                  required
                />
              </IonItem>

              <IonButton
                expand="block"
                onClick={handleSubmit} // Ensure handleSubmit is correctly called
                className="ion-margin-top"
              >
                Submit
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonLoading isOpen={uploading} message={"Uploading..."} />
        <IonModal isOpen={!!image} onDidDismiss={() => setImage(null)}>
          <ReactCrop
            src={image}
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={handleCropComplete}
          />
        </IonModal>
      </IonContent>
    </>
  );
}

export default CreateProfile;
