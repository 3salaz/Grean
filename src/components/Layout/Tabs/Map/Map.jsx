import { useState, useEffect, useRef } from "react";
import { usePickups } from "../../../../context/PickupsContext";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { motion } from "framer-motion";
import RequestPickup from "./RequestPickup";
import Schedule from "./Schedule";
import Alerts from "./Alerts";
import AddLocation from "../Profile/AddLocation";
import PickupQueue from "./PickupQueue";
import businessIcon from "../../../../assets/icons/business.png";
import "mapbox-gl/dist/mapbox-gl";
import ReactMapGl, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import {
  IonIcon,
  IonButton,
  IonRow,
  IonCol,
  IonModal,
  IonFabButton,
  IonBadge,
  IonToolbar,
  IonContent,
  IonGrid,
  IonFooter,
  IonCard,
  IonCardHeader,
  IonCardContent, // Add IonContent for proper layout
} from "@ionic/react";
import {
  leafOutline,
  calendarNumberOutline,
  notificationsOutline,
  caretUpSharp,
  closeCircle,
} from "ionicons/icons";
import { useLocations } from "../../../../context/LocationsContext";

function Map() {
  const { profile } = useAuthProfile();
  const { userAcceptedPickups, userCreatedPickups, visiblePickups } =
    usePickups();

  const [modalState, setModalState] = useState({
    requestPickupOpen: false,
    scheduleOpen: false,
    alertsOpen: false,
    pickupQueueOpen: false,
  });

  const closeModal = (modalName) => {
    setModalState((prevState) => ({ ...prevState, [modalName]: false }));
  };

  const openModal = (modalName) => {
    setModalState((prevState) => ({ ...prevState, [modalName]: true }));
  };

  const mapRef = useRef(null); // Create a ref to store the map instance
  const [viewPort, setViewPort] = useState({
    latitude: 37.742646,
    longitude: -122.433247,
    zoom: 11,
  });

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
  }, [mapRef, viewPort]); // Move this after mapRef has been declared

  const bounds = [
    [-122.66336, 37.492987],
    [-122.250481, 37.871651],
  ];

  const [popupInfo, setPopupInfo] = useState(null);
  const { businessLocations } = useLocations();

  const pins = businessLocations?.map((location, index) => (
    <Marker
      key={`marker-${index}`}
      longitude={location.longitude}
      latitude={location.latitude}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        setPopupInfo(location);
        setViewPort((prev) => ({
          ...prev,
          latitude: location.latitude,
          longitude: location.longitude,
          zoom: 14,
        }));
      }}
    >
      <div className="w-8 flex flex-col items-center justify-center rounded-full p-1 border-green text-green border-2 hover:text-orange hover:border-orange slate-800 bg-white">
        <img className="object-fit" src={businessIcon} alt="business-icon" />
      </div>
    </Marker>
  ));

  return (
    <IonGrid className="h-full ion-no-padding flex flex-col">
      {/* Driver Navigations */}
      <IonModal
        isOpen={modalState.scheduleOpen}
        onDidDismiss={() => closeModal("scheduleOpen")}
      >
        <Schedule handleClose={() => closeModal("scheduleOpen")} />
      </IonModal>

      <IonModal
        isOpen={modalState.alertsOpen}
        onDidDismiss={() => closeModal("alertsOpen")}
      >
        <Alerts handleClose={() => closeModal("alertsOpen")} />
      </IonModal>


      {/* User Navigation */}
      <IonModal
        isOpen={modalState.pickupQueueOpen}
        onDidDismiss={() => closeModal("pickupQueueOpen")}
      >
        <PickupQueue handleClose={() => closeModal("pickupQueueOpen")} />
      </IonModal>

      <IonModal
        isOpen={modalState.requestPickupOpen}
        onDidDismiss={() => closeModal("requestPickupOpen")}
      >
        <RequestPickup handleClose={() => closeModal("requestPickupOpen")} />
      </IonModal>



      {/* <IonModal
        isOpen={modalState.addLocationOpen}
        onDidDismiss={() => closeModal("addLocationOpen")}
      >
        <AddLocation handleClose={() => closeModal("addLocationOpen")} />
      </IonModal> */}

      {/* Toolbar at the top or bottom */}

      {/* Map component */}
      <IonRow className="h-full flex-grow">
        <IonCol size="12" id="map-container" className="h-full ion-no-padding">
          <ReactMapGl
            {...viewPort}
            ref={mapRef} // Attach the map instance to the ref
            onMove={(evt) => setViewPort(evt.viewState)}
            mapboxAccessToken="pk.eyJ1IjoiM3NhbGF6IiwiYSI6ImNsZG1xNjZ2aDBidnozb21kNTIxNTQ1a2wifQ.0JC6qoYDFC96znCbHh4kpQ"
            transitionDuration="30"
            mapStyle="mapbox://styles/3salaz/cli6bc4e000m201rf0dfp3oyh"
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              zIndex: "10",
            }} // Ensure the map takes full height and width
            maxBounds={bounds}
          >
            <GeolocateControl position="top-left" />
            <FullscreenControl position="top-left" />
            <NavigationControl position="top-left" />
            {pins}
            {popupInfo && (
              <Popup
                anchor="top"
                longitude={Number(popupInfo.longitude)}
                latitude={Number(popupInfo.latitude)}
                closeButton={false}
                closeOnClick={false}
                onClose={() => setPopupInfo(null)}
                className="w-full"
                maxWidth="600px z-50"
              >
                <motion.div
                  className="flex flex-col rounded-md  drop-shadow-lg w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <IonRow className="m-0 p-0">
                    <IonCol
                      size="12"
                      className="p-0 m-0  flex items-center justify-center"
                    >
                      <IonIcon
                        color="primary"
                        size="large"
                        icon={caretUpSharp}
                      ></IonIcon>
                    </IonCol>
                  </IonRow>

                  <IonCard className="relative pt-0 mt-0">
                    <div className="absolute top-0 right-0">
                      <IonButton
                        color="danger"
                        size="small"
                        onClick={() => setPopupInfo(null)}
                        className="rounded-full p-1"
                      >
                        <IonIcon icon={closeCircle}> </IonIcon>
                      </IonButton>
                    </div>
                    <IonCardHeader className=" p-2">
                      <img
                        className="h-10 w-10 ion-align-self-center bg-slate-200 aspect-square rounded-full"
                        src={popupInfo.businessLogo}
                        alt="Logo"
                      />
                    </IonCardHeader>
                    <IonCardContent className="p-2">
                      <div className="flex text-[16px] items-center justify-center">
                        <div className="text-2xl">{popupInfo.businessName}</div>
                      </div>
                      <div className="flex items-center justify-center">
                        <a
                          href={popupInfo.businessWebsite}
                          className=" font-bold p-2 text-center"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {popupInfo.street}
                        </a>
                      </div>
                      <div className="w-full">
                        <div className="text-center">
                          {popupInfo.description}
                        </div>
                      </div>

                      <div className="flex gap-1 text-center px-2">
                        <div className="basis-1/3 bg-green text-white rounded-sm flex flex-col p-2">
                          <div className="font-bold">Plastic</div>
                          <div>12lbs</div>
                        </div>
                        <div className="basis-1/3 bg-green text-white rounded-sm flex flex-col p-2">
                          <div className="font-bold">Aluminum</div>
                          <div>12lbs</div>
                        </div>
                        <div className="basis-1/3 bg-green text-white rounded-sm flex flex-col p-2">
                          <div className="font-bold">Total</div>
                          <div>24lbs</div>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </motion.div>
              </Popup>
            )}
          </ReactMapGl>
        </IonCol>
      </IonRow>

      <IonRow className="absolute bottom-2 mx-auto gap-2 w-full left-0 ion-justify-content-center z-50">

        {/* User */}
        {profile?.accountType === "User" && profile?.addresses.length > 0 && (
          <>
            <IonCol size="auto" className="ion-align-self-center">
              <IonButton
                expand="block"
                color="primary"
                onClick={() => openModal("requestPickupOpen")}
                className="rounded-md"
              >
                Request Pickup
              </IonButton>
            </IonCol>
            <IonCol size="auto" className="relative">
              <IonFabButton
                onClick={() => openModal("alertsOpen")}
                color="primary"
              >
                <IonIcon icon={leafOutline} />
              </IonFabButton>
              <IonBadge className="absolute top-0 right-0 bg-red-500 rounded-full aspect-square w-5">
                {userCreatedPickups.length}
              </IonBadge>
            </IonCol>
          </>
        )}

        {/* Driver */}
        {profile?.accountType === "Driver" && (
          <>
            <IonCol size="auto" className="relative">
              <IonFabButton
                onClick={() => openModal("scheduleOpen")}
                color="tertiary"
              >
                <IonIcon icon={calendarNumberOutline} />
              </IonFabButton>
              <IonBadge className="absolute top-0 right-0 bg-white text-grean rounded-full aspect-square w-5">
                {
                  userAcceptedPickups.filter((pickup) => !pickup.isCompleted)
                    .length
                }
              </IonBadge>
            </IonCol>
            <IonCol size="auto" className="relative">
              <IonFabButton
                onClick={() => openModal("pickupQueueOpen")}
                color="danger"
                className="relative"
              >
                <IonIcon icon={notificationsOutline} />
              </IonFabButton>
              <IonBadge className="absolute top-0 right-0 bg-white text-grean rounded-full aspect-square w-5">
                {visiblePickups.length}
              </IonBadge>
            </IonCol>
          </>
        )}

      </IonRow>
    </IonGrid>
  );
}

export default Map;
