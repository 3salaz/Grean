import {
  IonButton,
  IonCol,
  IonIcon,
  IonModal,
  IonRow,
  IonSpinner,
  IonText
} from "@ionic/react";
import {useRef, useState, useEffect} from "react";
import {
  addCircleOutline,
  chevronBackOutline,
  chevronForwardOutline,
  createOutline
} from "ionicons/icons";
import CreateLocation from "./CreateLocation";
import {UserProfile} from "../../../context/ProfileContext";
import {useUserLocations, LocationData} from "../../../hooks/useUserLocations";

interface MyLocationsProps {
  profile: UserProfile | null;
}

const MyLocations: React.FC<MyLocationsProps> = ({profile}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const addressRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Pass the locations array (of IDs) from the profile to your hook.
  const {locations: userLocations, loading} = useUserLocations(
    profile?.locations || []
  );

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const handleSlideChange = (index: number) => {
    const element = addressRefs.current[index];
    if (element) {
      element.scrollIntoView({behavior: "smooth", inline: "center"});
      setCurrentAddressIndex(index);
    }
  };

  // Observe intersection to update currentAddressIndex for pagination.
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
      {root: null, rootMargin: "0px", threshold: 0.5}
    );

    addressRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => {
      addressRefs.current.forEach((ref) => ref && observer.unobserve(ref));
    };
  }, [userLocations]);

  return (
    <footer className="container mx-auto max-w-2xl relative">
      <IonModal
        isOpen={isModalVisible}
        onDidDismiss={handleCloseModal}
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        <CreateLocation profile={profile} handleClose={handleCloseModal} />
      </IonModal>

      <IonRow className="ion-padding flex-grow bg-transparent relative ion-align-items-end">
        {/* Add Location Button */}
        <IonCol size="auto" className="flex items-end justify-items-end p-0">
          <div
            onClick={handleOpenModal}
            className="flex-none w-32 h-32 ion-padding rounded-2xl snap-center border-2 border-dashed border-gray-800 flex flex-col gap-2 items-center justify-center cursor-pointer"
          >
            <IonIcon icon={addCircleOutline} size="large" />
            <IonText className="text-sm">Add Location</IonText>
          </div>
        </IonCol>
        {/* Locations Container */}
        <IonCol
          size="auto"
          className="flex items-center justify-start ion-padding-horizontal"
        >
          <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-non gap-2">
            {loading ? (
              <IonSpinner />
            ) : userLocations.length > 0 ? (
              userLocations.map((loc: LocationData, index) => (
                <div
                  key={loc.id}
                  ref={(el) => (addressRefs.current[index] = el)}
                  className="flex-none w-32 h-32 snap-center bg-white border flex flex-col items-center justify-center rounded-md shadow-lg"
                >
                  <span className="text-center">{loc.locationType}</span>
                  {loc.businessName && (
                    <span className="text-center">{loc.businessName}</span>
                  )}
                  {/* Render additional details as needed */}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                No locations found
              </div>
            )}
          </div>
          {/* Pagination Dots */}
          <div className="flex justify-center mt-2">
            {userLocations.map((_, idx) => (
              <div
                key={idx}
                onClick={() => handleSlideChange(idx)}
                className={`w-3 h-3 mx-1 rounded-full cursor-pointer ${
                  idx === currentAddressIndex ? "bg-white" : "bg-slate-300"
                }`}
              ></div>
            ))}
          </div>
        </IonCol>
      </IonRow>

      {userLocations.length > 0 && (
        <IonRow className="ion-justify-content-center">
          <IonCol
            size="auto"
            color="primary"
            className="mx-auto ion-text-center ion-align-items-center text-black"
          />
        </IonRow>
      )}
    </footer>
  );
};

export default MyLocations;
