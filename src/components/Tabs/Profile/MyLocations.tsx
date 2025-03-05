import { IonButton, IonCol, IonIcon, IonModal, IonRow } from "@ionic/react";
import { useRef, useState, useEffect } from "react";
import {
  addCircleOutline,
  chevronBackOutline,
  chevronForwardOutline,
  createOutline,
} from "ionicons/icons";
import AddLocation from "./AddLocation";
import { UserProfile } from "../../../context/ProfileContext";

interface MyLocationsProps {
  profile: UserProfile | null;
}

const MyLocations: React.FC<MyLocationsProps> = ({ profile }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const addressRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Extract locations from profile. 
  // (Since UserProfile.locations is defined as string[], these might be location IDs or simple addresses.)
  const locations = profile?.locations || [];

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const handleSlideChange = (index: number) => {
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
            const index = addressRefs.current.findIndex((el) => el === entry.target);
            if (index !== -1) {
              setCurrentAddressIndex(index);
            }
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.5 }
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
        {/* Pass profile if needed, or simply use the modal to add a location */}
        <AddLocation profile={profile} handleClose={handleCloseModal} />
      </IonModal>

      <IonRow className="ion-no-padding flex-grow bg-transparent relative">
        <IonCol className="ion-no-padding gap-2 bg-none flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none no-scroll rounded-t-md">
          {locations.length > 0 ? (
            locations.map((loc, index) => (
              <div
                key={index}
                ref={(el) => (addressRefs.current[index] = el)}
                className="flex-none w-full h-full flex justify-center items-center snap-center bg-white ion-padding"
              >
                {/* Since locations is now an array of strings, simply display the string */}
                <div className="flex flex-col text-center items-center justify-center w-full h-full p-2">
                  <span>{loc}</span>
                </div>

                <div className="flex w-full h-full pt-1 mx-auto items-center justify-center">
                  <div
                    onClick={() =>
                      currentAddressIndex > 0 && handleSlideChange(currentAddressIndex - 1)
                    }
                    className={`cursor-pointer ${
                      currentAddressIndex === 0 ? "text-slate-300" : "text-white"
                    }`}
                  >
                    <IonIcon icon={chevronBackOutline} size="small" />
                  </div>

                  {locations.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSlideChange(idx)}
                      className={`w-1 h-1 mx-1 rounded-full cursor-pointer ${
                        idx === currentAddressIndex ? "bg-white" : "bg-slate-300"
                      }`}
                    ></div>
                  ))}

                  <div
                    onClick={() =>
                      currentAddressIndex < locations.length - 1 &&
                      handleSlideChange(currentAddressIndex + 1)
                    }
                    className={`cursor-pointer ${
                      currentAddressIndex === locations.length - 1 ? "text-slate-300" : "text-white"
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
          <div className="flex flex-col items-end justify-end">
            <div className="flex flex-col text-xs items-center justify-center font-bold">
              <IonButton shape="round" color="secondary" size="small">
                <IonIcon slot="icon-only" icon={createOutline} />
              </IonButton>
            </div>
            <div className="flex flex-col text-xs items-center justify-center font-bold">
              <IonButton size="small" shape="round" color="secondary" onClick={handleOpenModal}>
                <IonIcon slot="icon-only" icon={addCircleOutline} />
              </IonButton>
            </div>
          </div>
        </span>
      </IonRow>

      {locations.length > 0 && (
        <IonRow className="ion-justify-content-center">
          <IonCol size="auto" color="primary" className="mx-auto ion-text-center ion-align-items-center text-black" />
        </IonRow>
      )}
    </footer>
  );
};

export default MyLocations;
