import React, { useEffect, useState, useRef } from "react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { useLocations } from "../../../../context/LocationsContext";
import AddLocation from "./AddLocation";
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonIcon,
  IonContent,
  IonCard,
  IonCol,
} from "@ionic/react";
import {
  createOutline,
  addCircleOutline,
  arrowDownOutline,
} from "ionicons/icons";

function ProfileLocations() {
  const { profile } = useAuthProfile();
  const { updateProfileLocation } = useLocations();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [profileAddresses, setProfileAddresses] = useState([]);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const addressRefs = useRef([]);

  useEffect(() => {
    if (profile.addresses) {
      setProfileAddresses(profile.addresses || []);
    }
  }, [profile]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = addressRefs.current.indexOf(entry.target);
            setCurrentAddressIndex(index);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    addressRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      addressRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const openAddLocationModal = () => {
    setIsAddModalVisible(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalVisible(false);
  };

  const handleEdit = () => {
    const address = profileAddresses[currentAddressIndex];
    setAddressToEdit(address);
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = async (values) => {
    const updatedAddresses = profileAddresses.map((addr, index) =>
      index === currentAddressIndex ? { ...addr, ...values } : addr
    );

    await updateProfileLocation(profile.id, { ...addressToEdit, ...values });
    setProfileAddresses(updatedAddresses);
    setIsEditModalVisible(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
  };

  const handleSlideChange = (index) => {
    const element = addressRefs.current[index];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", inline: "center" });
      setCurrentAddressIndex(index);
    }
  };

  return (
    <IonCol
      size="12" sizeMd="8"
      className="h-full flex flex-col justify-between gap-2 container mx-auto"
    >
      <IonModal isOpen={isAddModalVisible} onDidDismiss={handleCloseAddModal}>
        <AddLocation handleClose={handleCloseAddModal} />
      </IonModal>

      <IonModal isOpen={isEditModalVisible} onDidDismiss={handleCloseEditModal}>
        {addressToEdit && (
          <form onSubmit={handleSaveEdit} className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Location Type</IonLabel>
              <IonInput
                value={addressToEdit.locationType}
                onIonChange={(e) =>
                  setAddressToEdit({
                    ...addressToEdit,
                    locationType: e.detail.value,
                  })
                }
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Street</IonLabel>
              <IonInput
                value={addressToEdit.street}
                onIonChange={(e) =>
                  setAddressToEdit({ ...addressToEdit, street: e.detail.value })
                }
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">City</IonLabel>
              <IonInput
                value={addressToEdit.city}
                onIonChange={(e) =>
                  setAddressToEdit({ ...addressToEdit, city: e.detail.value })
                }
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">State</IonLabel>
              <IonInput
                value={addressToEdit.state}
                onIonChange={(e) =>
                  setAddressToEdit({ ...addressToEdit, state: e.detail.value })
                }
                required
              />
            </IonItem>
            <IonButton expand="block" type="submit">
              Save
            </IonButton>
            <IonButton
              expand="block"
              color="medium"
              onClick={handleCloseEditModal}
            >
              Cancel
            </IonButton>
          </form>
        )}
      </IonModal>
      
      <IonCard className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none no-scroll gap-4 rounded-none bg-light-grean p-0 m-0">
        {profileAddresses.length > 0 ? (
          profileAddresses.map((address, index) => (
            <div
              key={index}
              ref={(el) => (addressRefs.current[index] = el)}
              className="section flex-none w-full h-full flex justify-center items-center snap-center p-4 rounded-md"
            >
              <div className="flex flex-col text-center items-center justify-center w-full h-full p-4">
                {address.businessLogo && (
                  <img
                    className="w-20"
                    src={address.businessLogo}
                    alt="Business Logo"
                  />
                )}
                <span>{address.locationType}</span>
                <span>{address.street}</span>
                <span>{address.city}</span>
                <span>{address.state}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="section rounded-md flex-none w-full h-full flex justify-center items-center snap-center bg-white">
            <IonButton fill="outline" onClick={openAddLocationModal}>
              Add a Location!
              <IonIcon slot="start" icon={arrowDownOutline}></IonIcon>
            </IonButton>
          </div>
        )}
      </IonCard>
      {/* Pagination Bubbles */}
      <div className="flex w-full mx-auto justify-center mt-4 absolute bottom-2">
        {profileAddresses.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-3 h-3 mx-1 rounded-full cursor-pointer ${
              index === currentAddressIndex ? "bg-blue-500" : "bg-blue-100"
            }`}
          ></div>
        ))}
      </div>
    </IonCol>
  );
}

export default ProfileLocations;
