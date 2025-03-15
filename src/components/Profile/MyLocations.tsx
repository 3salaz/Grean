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
import {UserProfile} from "../../context/ProfileContext";
import {useUserLocations, LocationData} from "../../hooks/useUserLocations";

interface MyLocationsProps {
  profile: UserProfile | null;
}

const MyLocations: React.FC<MyLocationsProps> = ({profile}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const addressRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Ensure the profile is loaded before calling the hook.
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-full">
        <IonSpinner />
      </div>
    );
  }

  // Fetch full location details based on the location IDs stored in the profile.
  const {locations: userLocations, loading} = useUserLocations(
    profile.locations || []
  );

  useEffect(() => {
    // console.log("Fetched user locations:", userLocations);
  }, [userLocations]);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  // Observe intersection to update currentAddressIndex for pagination.
  useEffect(() => {
    if (userLocations.length === 0) return;
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

  // If the hook is loading or if the profile shows locations but none have been fetched yet,
  // show a spinner.
  const shouldShowSpinner =
    loading || (profile.locations.length > 0 && userLocations.length === 0);

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
        <IonCol size="auto" className="flex items-center justify-center p-0">
          <div
            onClick={handleOpenModal}
            className="flex-none w-32 h-32 ion-padding rounded-2xl m-2 snap-center border-2 border-dashed border-gray-800 flex flex-col gap-2 items-center justify-center cursor-pointer"
          >
            <IonIcon icon={addCircleOutline} size="large" />
            <IonText className="text-sm">Add Location</IonText>
          </div>
        </IonCol>

        {/* Locations Container */}
        <IonCol size="auto" className="flex items-center justify-start p-0">
          <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none gap-2">
            {shouldShowSpinner ? (
              <IonSpinner />
            ) : userLocations.length > 0 ? (
              userLocations.map((loc: LocationData, index) => (
                <div
                  key={loc.id}
                  ref={(el) => (addressRefs.current[index] = el)}
                  className="flex-none w-32 h-32 m-2 rounded-2xl snap-center bg-white border flex flex-col items-center justify-center drop-shadow-md"
                >
                  <span className="text-center">{loc.address}</span>
                  {loc.businessName && (
                    <span className="text-center">{loc.businessName}</span>
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                No locations found
              </div>
            )}
          </div>
          {/* Pagination Dots */}
          {/* <div className="flex justify-center mt-2">
            {userLocations.map((_, idx) => (
              <div
                key={idx}
                onClick={() => handleSlideChange(idx)}
                className={`w-3 h-3 mx-1 rounded-full cursor-pointer ${
                  idx === currentAddressIndex ? "bg-white" : "bg-slate-300"
                }`}
              ></div>
            ))}
          </div> */}
        </IonCol>
      </IonRow>
    </footer>
  );
};

export default MyLocations;
