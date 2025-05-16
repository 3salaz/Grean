import {
  IonButton,
  IonCol,
  IonIcon,
  IonModal,
  IonRow,
  IonSpinner,
  IonText
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import {
  addCircle,
  settings
} from "ionicons/icons";
import CreateLocation from "./CreateLocation";
import { UserProfile } from "../../context/ProfileContext";
import { useUserLocations, LocationData } from "../../hooks/useUserLocations";
import { useLocations } from "../../context/LocationsContext";
import EditLocation from "./EditLocation";

interface MyLocationsProps {
  profile: UserProfile | null;
}

const MyLocations: React.FC<MyLocationsProps> = ({ profile }) => {
  useEffect(() => {
    presentingElement.current = document.querySelector('ion-router-outlet');
  }, []);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const addressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { currentLocation, setCurrentLocation } = useLocations();
  const modalRef = useRef<HTMLIonModalElement>(null);
  const presentingElement = useRef<HTMLElement | null>(null);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-full">
        <IonSpinner />
      </div>
    );
  }

  const { locations: userLocations, loading } = useUserLocations(profile.locations || []);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);


  return (
    <IonRow className="border-b border-slate-200 ion-padding">
      <IonCol size="12">
        <IonText className="text-lg font-semibold text-[#3a6833]">My Locations</IonText>
      </IonCol>
      <IonCol size="12" className="ion-padding-vertical">
        {userLocations.length === 0 ? (
          <div className="text-center font-medium italic ion-padding bg-white bg-opacity-40 rounded-md">
            <IonText className="text-xs text-[#3a6833]">
              No Locations (Add a location to get started)
            </IonText>
          </div>
        ) : (
          userLocations.map((loc: LocationData, index) => (
            <div className="flex items-center justify-start p-0" key={loc.id}>
              <div
                onClick={() => setCurrentLocation(loc)}
                ref={(el) => (addressRefs.current[index] = el)}
                className={`flex-none w-32 h-32 rounded-xl snap-center text-sm flex flex-col items-center justify-center cursor-pointer transition 
    ${currentLocation?.id === loc.id
                    ? "border-2 border-orange-500 bg-white"
                    : "border border-slate-200 bg-white/80 backdrop-blur"}`}
              >
                <span className="text-center text-xs text-gray-800">{loc.address}</span>
                {loc.businessName && (
                  <span className="text-center text-sm text-gray-600">{loc.businessName}</span>
                )}
              </div>
            </div>
          ))
        )}
      </IonCol>
      <div className="flex items-center justify-center gap-1">
      <IonCol size="auto">
        <IonButton
          fill="outline"
          color="primary"
          shape="round"
          size="small"
          onClick={() => setShowCreateModal(true)} // for addCircle
          className="bg-white rounded-full"
        >
          <IonIcon slot="icon-only" icon={addCircle} />
        </IonButton>
      </IonCol>
      {currentLocation && (
        <IonCol size="auto">
          <IonButton
            fill="outline"
            color="primary"
            shape="round"
            size="small"
            onClick={() => setShowEditModal(true)} // for addCircle}
            className="bg-white rounded-full"
          >
            <IonIcon slot="icon-only" icon={settings} />
          </IonButton>
        </IonCol>
      )}
            </div>
      <IonModal
        isOpen={showCreateModal}
        presentingElement={presentingElement.current ?? undefined}
      >
        <CreateLocation profile={profile} handleClose={() => setShowCreateModal(false)} />
      </IonModal>

      <IonModal
        isOpen={showEditModal}
        presentingElement={presentingElement.current ?? undefined}
      >
        <EditLocation location={currentLocation} onClose={() => setShowEditModal(false)} />
      </IonModal>
    </IonRow>
  );
};


export default MyLocations;
