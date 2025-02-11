import { IonButton, IonCol, IonIcon, IonModal, IonRow } from "@ionic/react";
import { useRef, useState, useEffect } from "react";
import { useLocations } from "../../../context/LocationsContext"; // Import the context
import {
  addCircleOutline,
  chevronBackOutline,
  chevronForwardOutline,
  createOutline,
} from "ionicons/icons";
import AddLocation from "./AddLocation";
import { useProfile } from "../../../context/ProfileContext";

function MyLocations() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const addressRefs = useRef([]);
  const { locations } = useLocations(); // Access the real-time locations from context
  const { profile } = useProfile(); // Ensures profile is available before usage

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = addressRefs.current.findIndex(
              (el) => el === entry.target
            );
            if (index !== -1) {
              setCurrentAddressIndex(index);
            }
          }
        });
      },
      {
        root: null, // Observing the viewport
        rootMargin: "0px",
        threshold: 0.5, // Trigger when 50% of the element is visible
      }
    );

    addressRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => {
      addressRefs.current.forEach((ref) => ref && observer.unobserve(ref));
    };
  }, [locations]);

  return (
    <footer className="container mx-auto max-w-4xl md:rounded-md relative shadow-xl">
      <IonModal
        isOpen={isModalVisible}
        onDidDismiss={handleCloseModal}
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        <AddLocation handleClose={handleCloseModal} />
      </IonModal>
      <IonRow className="ion-no-padding flex-grow bg-transparent relative">
        <IonCol className="ion-no-padding gap-2 bg-none flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none no-scroll rounded-t-md">
          {locations.length > 0 && profile?.accountType === "User" ? (
            locations.map((address, index) => (
              <div
                key={index}
                ref={(el) => (addressRefs.current[index] = el)}
                className="flex-none w-full h-full flex justify-center items-center snap-center bg-white ion-padding"
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
                              <div className="flex w-full h-full pt-1 mx-auto items-center justify-center">
                <div
                  onClick={() =>
                    currentAddressIndex > 0 &&
                    handleSlideChange(currentAddressIndex - 1)
                  }
                  className={`cursor-pointer ${
                    currentAddressIndex === 0 ? "text-slate-300" : "text-white"
                  }`}
                >
                  <IonIcon icon={chevronBackOutline} size="small" />
                </div>

                {locations.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => handleSlideChange(index)}
                    className={`w-1 h-1 mx-1 rounded-full cursor-pointer ${
                      index === currentAddressIndex
                        ? "bg-white"
                        : "bg-slate-300"
                    }`}
                  ></div>
                ))}

                <div
                  onClick={() =>
                    currentAddressIndex < locations.length - 1 &&
                    handleSlideChange(currentAddressIndex + 1)
                  }
                  className={`cursor-pointer ${
                    currentAddressIndex === locations.length - 1
                      ? "text-slate-300"
                      : "text-white"
                  }`}
                >
                  <IonIcon icon={chevronForwardOutline} size="small" />
                </div>
              </div>
              </div>
            ))
          ) : (
            <div>No locations found</div>
          )}
        </IonCol>
        <span className="p-2 absolute rounded-tr-md h-full flex flex-col items-center justify-center top-0 right-0 bg-orange">
          <div size="2" className="flex flex-col items-end justify-end">
            <div className="flex flex-col text-xs items-center justify-center font-bold">
              <IonButton
                shape="round"
                color="secondary"
                size="small"
                onClick={""}
              >
                <IonIcon slot="icon-only" icon={createOutline} />
              </IonButton>
            </div>
            <div className="flex flex-col text-xs items-center justify-center font-bold">
              <IonButton
                size="small"
                shape="round"
                color="secondary"
                onClick={handleOpenModal}
              >
                <IonIcon slot="icon-only" icon={addCircleOutline} />
              </IonButton>
            </div>
          </div>
        </span>
      </IonRow>

      {locations.length > 0 && profile?.accountType === "User" && (
          <IonRow className="ion-justify-content-center">
            <IonCol
              size="auto"
              color="primary"
              className="mx-auto ion-text-center ion-align-items-center text-black"
            >

            </IonCol>
          </IonRow>
      )}
    </footer>
  );
}

export default MyLocations;
