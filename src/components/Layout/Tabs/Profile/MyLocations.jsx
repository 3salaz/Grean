import {
  IonButton,
  IonCol,
  IonIcon,
  IonModal,
  IonRow,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import { useLocations } from "../../../../context/LocationsContext"; // Import the context
import {
  addCircleOutline,
  chevronBackOutline,
  chevronForwardOutline,
  createOutline,
} from "ionicons/icons";
import AddLocation from "./AddLocation";

function MyLocations() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const addressRefs = useRef([]);
  const { locations } = useLocations(); // Access the real-time locations from context

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
    <main className="container mx-auto max-w-4xl bg-slate-50 rounded-md relative">
      <IonModal
        isOpen={isModalVisible}
        onDidDismiss={handleCloseModal}
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        <AddLocation handleClose={handleCloseModal} />
      </IonModal>

      <IonRow className="ion-no-padding flex-grow">
        <IonCol className="ion-no-padding gap-2 bg-none flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none no-scroll rounded-md">
          {locations.length > 0 ? (
            locations.map((address, index) => (
              <div
                key={index}
                ref={(el) => (addressRefs.current[index] = el)}
                className="flex-none w-full h-full flex justify-center items-center snap-center rounded-md bg-white ion-padding"
              >
                <div className="flex flex-col text-center items-center justify-center w-full h-full p-2">
                  {address.businessLogo && (
                    <img
                      className="w-20"
                      src={address.businessLogo}
                      alt="Business Logo"
                    />
                  )}
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
                fill="primary"
                size="large"
                onClick={handleOpenModal}
                className="text-sm"
              >
                Add a Location!
                <IonIcon
                  size="large"
                  slot="start"
                  icon={addCircleOutline}
                ></IonIcon>
              </IonButton>
            </div>
          )}
        </IonCol>
      </IonRow>

      {locations.length > 0 && (
        <>
        <IonRow className="ion-justify-content-center ion-padding">
          <IonCol
            size="auto"
            color="primary"
            className="mx-auto ion-text-center ion-align-items-center text-black"
          >
            <div className="flex w-full h-full p-2 mx-auto items-center justify-center">
              <div
                onClick={() =>
                  currentAddressIndex > 0 &&
                  handleSlideChange(currentAddressIndex - 1)
                }
                className={`cursor-pointer p-2 ${
                  currentAddressIndex === 0 ? "text-slate-300" : "text-grean"
                }`}
              >
                <IonIcon icon={chevronBackOutline} size="large" />
              </div>

              {locations.map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`w-3 h-3 mx-1 rounded-full cursor-pointer ${
                    index === currentAddressIndex ? "bg-grean" : "bg-slate-300"
                  }`}
                ></div>
              ))}

              <div
                onClick={() =>
                  currentAddressIndex < locations.length - 1 &&
                  handleSlideChange(currentAddressIndex + 1)
                }
                className={`cursor-pointer p-2 ${
                  currentAddressIndex === locations.length - 1
                    ? "text-slate-300"
                    : "text-grean"
                }`}
              >
                <IonIcon icon={chevronForwardOutline} size="large" />
              </div>
            </div>
          </IonCol>
        </IonRow>
              <span className="px-2 absolute top-0 right-0">
              <IonButton
                shape="round"
                color="secondary"
                size="small"
                onClick={handleOpenModal}
              >
                <IonIcon slot="icon-only" icon={createOutline} />
              </IonButton>
            </span>
          </>
      )}

    </main>
  );
}

export default MyLocations;
