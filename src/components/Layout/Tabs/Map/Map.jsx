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
import ReactMapGl, { Marker, Popup } from "react-map-gl"; // Removed unnecessary imports for the controls
import {
  IonIcon,
  IonButton,
  IonRow,
  IonCol,
  IonModal,
  IonFabButton,
  IonBadge,
  IonGrid,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonInput,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/react";
import { caretUpSharp, closeCircle } from "ionicons/icons";
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

  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [filteredLocations, setFilteredLocations] = useState([]); // Filtered business locations
  const categories = [
    "All",
    "Restaurants",
    "Bars",
    "Hotels",
    "Grocery Stores",
    "Offices",
    "Event Venues",
  ];

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
  }, [mapRef, viewPort]);

  const bounds = [
    [-122.66336, 37.492987],
    [-122.250481, 37.871651],
  ];

  const [popupInfo, setPopupInfo] = useState(null);
  const { businessLocations } = useLocations();

  useEffect(() => {
    // Filter the business locations based on the search query
    if (searchQuery === "") {
      setFilteredLocations(businessLocations);
    } else {
      setFilteredLocations(
        businessLocations.filter((location) =>
          location.businessName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, businessLocations]);

  const pins = filteredLocations?.map((location, index) => (
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
      {/* Search Bar Overlay */}
      <main className="absolute top-0 left-0 right-0 z-50 p-2">
        <IonRow className="w-full container mx-auto max-w-4xl">
          {/* Filter */}

          {/* Search */}
          <IonCol size="10" className="mx-auto">
            <IonInput
              value={searchQuery}
              placeholder="Search for businesses"
              onIonChange={(e) => setSearchQuery(e.detail.value)}
              className="search-bar bg-white p-2 text-center rounded-lg drop-shadow-lg"
            />
          </IonCol>
          <IonCol size="10" className="mx-auto pt-2 rounded-md h-8">
            <IonSegment
              scrollable="true"
              value="default"
              className="bg-slate-200 bg-opacity-80 rounded-full no-scroll"
            >
              {categories.map((category, index) => (
                <IonSegmentButton className="p-0 m-0" key={index} value={category.toLowerCase()}>
                  <IonLabel className="bg-grean rounded-lg px-2 p-1 box-border text-white text-xs">
                    {category}
                  </IonLabel>
                </IonSegmentButton>
              ))}
            </IonSegment>
          </IonCol>
        </IonRow>
      </main>

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
            {pins}
            {popupInfo && (
              <Popup
                anchor="top"
                longitude={Number(popupInfo.longitude)}
                latitude={Number(popupInfo.latitude)}
                closeButton={false}
                closeOnClick={false}
                onClose={() => setPopupInfo(null)}
                className="w-full z-50"
                maxWidth="600px"
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
                    <div className="absolute top-0 right-0 z-40">
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
    </IonGrid>
  );
}

export default Map;
