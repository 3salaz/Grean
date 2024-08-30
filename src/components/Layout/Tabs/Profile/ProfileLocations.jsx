import React, { useEffect, useState, useRef } from "react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { useLocations } from "../../../../context/LocationsContext";
import AddLocation from "./AddLocation";
import {
  IonButton,
  IonModal,
  IonIcon,
  IonContent,
  IonCard,
} from "@ionic/react";
import {
  createOutline,
  addCircleOutline,
  arrowDownOutline,
  settingsOutline,
} from "ionicons/icons";
import EditLocation from "./EditLocation";

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
    const currentRefs = addressRefs.current; // Capture the current refs

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let index = currentRefs.indexOf(entry.target);
            setCurrentAddressIndex(index);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
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
  console.log("Values passed to save:", values);
  try {
    const updatedAddresses = profileAddresses.map((addr, index) =>
      index === currentAddressIndex ? { ...addr, ...values } : addr
    );
    
    console.log("Updated Addresses:", updatedAddresses);

    await updateProfileLocation(profile.id, { addresses: updatedAddresses });
    setProfileAddresses(updatedAddresses);
    setIsEditModalVisible(false);
  } catch (error) {
    console.error("Failed to update location:", error);
  }
};


  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
  };

  const handleDeleteLocation = async (addressToDelete) => {
    const updatedAddresses = profileAddresses.filter(
      (addr) => addr !== addressToDelete
    );
  
    await updateProfileLocation(profile.id, updatedAddresses);
    setProfileAddresses(updatedAddresses);
  };

  return (
    <IonContent className="w-full h-[82svh] flex flex-col justify-between gap-2 container mx-auto">
      <IonModal isOpen={isAddModalVisible} onDidDismiss={handleCloseAddModal}>
        <AddLocation handleClose={handleCloseAddModal} />
      </IonModal>

      <IonModal isOpen={isEditModalVisible} onDidDismiss={handleCloseEditModal}>
        {addressToEdit && (
          <EditLocation
            addressToEdit={addressToEdit}
            onSubmit={handleSaveEdit}
            onClose={handleCloseEditModal}
            onDelete={handleDeleteLocation}
          />
        )}
      </IonModal>

      <div
        id="locationDetails"
        className="w-full h-[90%] flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none no-scroll p-4 m-0 gap-4"
      >
        {profileAddresses.length > 0 ? (
          profileAddresses.map((address, index) => (
            <IonCard
              key={index}
              ref={(el) => (addressRefs.current[index] = el)}
              className="section flex-none w-full max-w-3xl h-full flex justify-center items-center snap-center bg-light-grean p-4 rounded-md m-0"
            >
              <div className="flex flex-col text-center items-center justify-center w-full h-full">
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
            </IonCard>
          ))
        ) : (
          <IonCard className="section rounded-md flex-none w-full h-full flex justify-center items-center snap-center bg-blue-300 m-0">
            <IonButton fill="outline" onClick={openAddLocationModal}>
              Add a Location!
              <IonIcon slot="start" icon={arrowDownOutline}></IonIcon>
            </IonButton>
          </IonCard>
        )}
      </div>
      {profile?.addresses.length === 0 && (
        <div className="flex h-[10%] justify-between items-center px-4">
          <div className="flex justify-between gap-4 h-10 w-full rounded-full">
            <div>
              <IonButton
                color="danger"
                className="w-full h-full aspect-square"
                onClick=""
              >
                <IonIcon
                  className="text-white"
                  icon={settingsOutline}
                  size="large"
                />
              </IonButton>
            </div>

            <div className="flex gap-2">
              <IonButton
                fill="outline"
                shape="round"
                onClick={openAddLocationModal}
              >
                <IonIcon slot="icon-only" icon={addCircleOutline} />
              </IonButton>
            </div>
          </div>
        </div>
      )}

      {profileAddresses.length > 0 && (
        <div className="flex h-[10%] justify-between items-center px-4">
          <div className="flex justify-between gap-4 h-10 w-full rounded-full">
            <div>
              <IonButton
                color="danger"
                className="w-full h-full aspect-square"
                onClick=""
              >
                <IonIcon
                  className="text-white"
                  icon={settingsOutline}
                  size="large"
                />
              </IonButton>
            </div>

            <div className="flex gap-2">
              <IonButton
                fill="outline"
                shape="round"
                onClick={openAddLocationModal}
              >
                <IonIcon slot="icon-only" icon={addCircleOutline} />
              </IonButton>

              <IonButton fill="outline" shape="round" onClick={handleEdit}>
                <IonIcon slot="icon-only" icon={createOutline} />
              </IonButton>
            </div>
          </div>
        </div>
      )}
    </IonContent>
  );
}

export default ProfileLocations;
