import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonIcon,
  IonModal,
  IonRow,
  IonSpinner,
  IonText
} from "@ionic/react";
import { useRef, useState, useEffect } from "react";
import {
  addCircleOutline,
  chevronBackOutline,
  chevronForwardOutline,
  createOutline
} from "ionicons/icons";
import CreateLocation from "./CreateLocation";
import { UserProfile } from "../../context/ProfileContext";
import { useUserLocations, LocationData } from "../../hooks/useUserLocations";

interface MyLocationsProps {
  profile: UserProfile | null;
}

const MyLocations: React.FC<MyLocationsProps> = ({ profile }) => {
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
  const { locations: userLocations, loading } = useUserLocations(profile.locations || []);

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
  }, [userLocations]);

  // If the hook is loading or if the profile shows locations but none have been fetched yet,
  // show a spinner.
  const shouldShowSpinner = loading || (profile.locations.length > 0 && userLocations.length === 0);

  return (
    <IonCard className="max-w-4xl mx-auto shadow-lg mt-2 rounded-lg">
      <IonCardHeader className="bg-slate-100 rounded-t-lg ion-padding">
        <IonCardTitle className="flex w-full justify-between items-center">
          {/* Title Section */}
          <IonRow className="flex justify-between w-full">
            <IonCol
              size="12"
              className="rounded-full text-center bg-grean px-4 flex items-center justify-center"
            >
              <div className="rounded-full text-lg font-semibold text-center">My Locations</div>
            </IonCol>
          </IonRow>
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="bg-[#75B657]">
      <IonRow className="flex-grow bg-transparent relative ion-align-items-end pt-4">
        {/* Locations Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none gap-2">
          {userLocations.map((loc: LocationData, index) => (
            <IonCol size="auto" className="flex items-center justify-start p-0" key={loc.id}>
              <div
                ref={(el) => (addressRefs.current[index] = el)}
                className="flex-none bg-white w-32 h-32 rounded-2xl snap-center text-base border border-white flex flex-col items-center justify-center drop-shadow-md"
              >
                <span className="text-center text-xs">{loc.address}</span>
                {loc.businessName && <span className="text-center">{loc.businessName}</span>}
              </div>
            </IonCol>
          ))}
        </div>
      </IonRow>

      <IonRow className="container max-w-2xl mx-auto w-full rounded-t-md">
        <IonCol size="auto" className="py-2">
          <IonButton
            fill="outline"
            color="light"
            expand="block"
            shape="round"
            onClick={() => setIsModalVisible(true)}
            className="text-sm"
          >
            <IonIcon size="large" slot="icon-only" icon={addCircleOutline}></IonIcon>
          </IonButton>
        </IonCol>
      </IonRow>
      </IonCardContent>



      <IonModal isOpen={isModalVisible}>
        <CreateLocation profile={profile} handleClose={() => setIsModalVisible(false)} />
      </IonModal>
    </IonCard>
  );
};

export default MyLocations;
