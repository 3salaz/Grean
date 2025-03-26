import {useEffect, useState, useRef} from "react";
import {useAuthProfile} from "../../../../context/AuthProfileContext";
import {useLocations} from "../../../../context/LocationsContext";
import CreateLocation from "./CreateLocation";
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonIcon,
  IonCol
} from "@ionic/react";
import {arrowDownOutline} from "ionicons/icons";

function ProfileLocations() {
  const {profile} = useAuthProfile();
  const {updateProfileLocation} = useLocations();
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
        threshold: 0.5
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

  const openCreateLocationModal = () => {
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
      index === currentAddressIndex ? {...addr, ...values} : addr
    );

    await updateProfileLocation(profile.id, {...addressToEdit, ...values});
    setProfileAddresses(updatedAddresses);
    setIsEditModalVisible(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
  };

  const handleSlideChange = (index) => {
    const element = addressRefs.current[index];
    if (element) {
      element.scrollIntoView({behavior: "smooth", inline: "center"});
      setCurrentAddressIndex(index);
    }
  };

  return (
    <IonCol size="12" className=" mx-auto ion-padding">
      <IonModal isOpen={isAddModalVisible} onDidDismiss={handleCloseAddModal}>
        <CreateLocation handleClose={handleCloseAddModal} />
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
                    locationType: e.detail.value
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
                  setAddressToEdit({...addressToEdit, street: e.detail.value})
                }
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">City</IonLabel>
              <IonInput
                value={addressToEdit.city}
                onIonChange={(e) =>
                  setAddressToEdit({...addressToEdit, city: e.detail.value})
                }
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">State</IonLabel>
              <IonInput
                value={addressToEdit.state}
                onIonChange={(e) =>
                  setAddressToEdit({...addressToEdit, state: e.detail.value})
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

      <div className="container max-w-xl ion-no-margin ion-no-padding gap-2 bg-none flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none no-scroll rounded-none">
        {profileAddresses.length > 0 ? (
          profileAddresses.map((address, index) => (
            <div
              key={index}
              ref={(el) => (addressRefs.current[index] = el)}
              className="flex-none w-full h-full bg-lime-200 flex justify-center items-center snap-center rounded-md"
            >
              <div className="flex flex-col text-center items-center justify-center w-full h-full p-4">
                {address.businessLogo && (
                  <img
                    className="w-20"
                    src={address.businessLogo}
                    alt="Business Logo"
                  />
                )}

                {address.locationType && <span></span>}
                <span>{address.street}</span>
                <span>
                  {address.city},{address.state}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="section rounded-md flex-none w-full h-full flex justify-center items-center snap-center">
            <IonButton fill="outline" onClick={openCreateLocationModal}>
              Add a Location!
              <IonIcon slot="start" icon={arrowDownOutline}></IonIcon>
            </IonButton>
          </div>
        )}
      </div>
    </IonCol>
  );
}

export default ProfileLocations;
