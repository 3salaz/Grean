import React, { useEffect, useState, useRef } from "react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { useLocations } from "../../../../context/LocationsContext";
import AddLocation from "./AddLocation";
import { IonButton, IonInput, IonItem, IonLabel, IonModal, IonIcon, IonContent } from "@ionic/react";
import { createOutline, addCircleOutline, arrowDownOutline } from "ionicons/icons";

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
            // console.log("Current Address Index:", index); // Debugging: log the current index
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
    console.log("Editing address:", address);
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

  return (
    <IonContent className="w-full h-full flex flex-col justify-between gap-2 container mx-auto">
      <IonModal isOpen={isAddModalVisible} onDidDismiss={handleCloseAddModal}>
        <AddLocation handleClose={handleCloseAddModal} />
      </IonModal>

      <IonModal isOpen={isEditModalVisible} onDidDismiss={handleCloseEditModal}>
        {addressToEdit && (
          <form
            onSubmit={handleSaveEdit}
            className="ion-padding"
          >
            <IonItem>
              <IonLabel position="stacked">Location Type</IonLabel>
              <IonInput
                value={addressToEdit.locationType}
                onIonChange={(e) => setAddressToEdit({ ...addressToEdit, locationType: e.detail.value })}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Street</IonLabel>
              <IonInput
                value={addressToEdit.street}
                onIonChange={(e) => setAddressToEdit({ ...addressToEdit, street: e.detail.value })}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">City</IonLabel>
              <IonInput
                value={addressToEdit.city}
                onIonChange={(e) => setAddressToEdit({ ...addressToEdit, city: e.detail.value })}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">State</IonLabel>
              <IonInput
                value={addressToEdit.state}
                onIonChange={(e) => setAddressToEdit({ ...addressToEdit, state: e.detail.value })}
                required
              />
            </IonItem>
            <IonButton expand="block" type="submit">
              Save
            </IonButton>
            <IonButton expand="block" color="medium" onClick={handleCloseEditModal}>
              Cancel
            </IonButton>
          </form>
        )}
      </IonModal>

      <div
        id="locationDetails"
        className="w-full h-[90%] flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none no-scroll p-4 gap-4"
      >
        {profileAddresses.length > 0 ? (
          profileAddresses.map((address, index) => (
            <div
              key={index}
              ref={(el) => (addressRefs.current[index] = el)}
              className="section flex-none w-full h-full flex justify-center items-center snap-center bg-light-grean p-4 rounded-md"
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
      </div>
      {profileAddresses.length > 0 && (
        <div className="flex h-[10%] justify-between items-center px-4">
          <div className="flex justify-end gap-4 h-10 w-full rounded-full">
            <IonButton
              fill="outline"
              shape="round"
              onClick={openAddLocationModal}
            >
              <IonIcon slot="icon-only" icon={addCircleOutline} />
            </IonButton>

            <IonButton
              fill="outline"
              shape="round"
              onClick={handleEdit}
            >
              <IonIcon slot="icon-only" icon={createOutline} />
            </IonButton>
          </div>
        </div>
      )}
    </IonContent>
  );
}

export default ProfileLocations;
