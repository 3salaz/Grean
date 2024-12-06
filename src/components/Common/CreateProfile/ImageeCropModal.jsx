import React, { useState, useCallback } from "react";
import { IonContent, IonModal, IonButton, IonIcon } from "@ionic/react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./cropUtils"; // Helper function to crop image
import { cloudUploadOutline } from "ionicons/icons";

function ImageCropModal({ isOpen, onClose, onCropComplete, imageSrc }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 300);
      onCropComplete(croppedImage); // Return cropped image
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error cropping image:", err);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonContent>
        <div className="crop-container" style={{ height: "70vh" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} // Square aspect ratio
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteCallback}
          />
        </div>
        <div className="ion-padding">
          <IonButton expand="block" onClick={handleCrop}>
            <IonIcon icon={cloudUploadOutline} slot="start" />
            Crop and Upload
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
}

export default ImageCropModal;

