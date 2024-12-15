import { IonButton, IonCol, IonIcon, IonModal, IonRow } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { addCircleOutline, arrowDownOutline } from "ionicons/icons";
import AddLocation from "./AddLocation";

function MyLocations() {
  const [profileAddresses, setProfileAddresses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const addressRefs = useRef([]);
  const { profile } = useAuthProfile(); // Ensures profile is available before usage

  useEffect(() => {
    if (profile?.locations) {
      setProfileAddresses(profile.locations || []);
    }
  }, [profile]);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSlideChange = (index) => {
    const element = addressRefs.current[index];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", inline: "center" });
      setCurrentAddressIndex(index);
    }
  };

  return (
    <main className="container mx-auto max-w-4xl">
      <IonRow className="ion-no-padding flex-grow">
        <IonModal
          isOpen={isModalVisible}
          onDidDismiss={handleCloseModal}
          initialBreakpoint={1}
          breakpoints={[0, 1]}
        >
          <AddLocation handleClose={handleCloseModal} />
        </IonModal>

        <IonCol className="ion-margin ion-no-padding gap-2 bg-none flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none no-scroll rounded-md">
          {profile.locations.length > 0 ? (
            profile.locations.map((address, index) => (
              <div
                key={index}
                ref={(el) => (addressRefs.current[index] = el)}
                className="flex-none w-full h-full  flex justify-center items-center snap-center rounded-md bg-white"
              >
                <div className="flex flex-col text-center items-center justify-center w-full h-full p-2">
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
                    {address.city}, {address.state}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-none w-full flex justify-center items-end snap-center">
              <IonButton
                fill="secondary"
                shape="round"
                size="large"
                onClick={handleOpenModal}
              >
                Add a Location!
                <IonIcon size="large" slot="start" icon={addCircleOutline}></IonIcon>
              </IonButton>
            </div>
          )}
        </IonCol>
      </IonRow>

      {profile?.locations.length > 0 && profile.accountType === "User" && (
        <IonRow className="ion-justify-content-between">
          <IonCol size="3" className="ion-text-start"></IonCol>

          <IonCol
            size="6"
            color="primary"
            className="mx-auto ion-text-center ion-align-items-center text-black"
          >
            <div className="flex w-full h-full mx-auto items-center justify-center">
              {profileAddresses.map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`w-3 h-3 mx-1 rounded-full cursor-pointer ${
                    index === currentAddressIndex
                      ? "bg-blue-500"
                      : "bg-blue-100"
                  }`}
                ></div>
              ))}
            </div>
          </IonCol>

          <IonCol size="auto" className="px-2">
            <IonButton
              shape="round"
              color="secondary"
              onClick={handleOpenModal}
            >
              <IonIcon slot="icon-only" icon={addCircleOutline} />
            </IonButton>
          </IonCol>
        </IonRow>
      )}
    </main>
  );
}

export default MyLocations;
