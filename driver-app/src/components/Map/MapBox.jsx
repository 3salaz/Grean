import { useState, useEffect, useRef } from "react";
import ReactMapGl, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import { motion } from "framer-motion";
import businessIcon from "../../../../assets/icons/business.png";
import { IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonFabButton, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { calendarNumberOutline, caretUpSharp, closeCircle, notificationsOutline } from "ionicons/icons";
import { useLocations } from "../../../../context/LocationsContext";

function MapBox() {
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
        <img
          className="object-fit"
          src={businessIcon}
          alt="business-icon"
        />
      </div>
    </Marker>
  ));

  return (
    <IonCol size="12" id="map-container" className="h-full  ion-no-padding z-10">
      <ReactMapGl
        {...viewPort}
        ref={mapRef} // Attach the map instance to the ref
        onMove={(evt) => setViewPort(evt.viewState)}
        mapboxAccessToken="pk.eyJ1IjoiM3NhbGF6IiwiYSI6ImNsZG1xNjZ2aDBidnozb21kNTIxNTQ1a2wifQ.0JC6qoYDFC96znCbHh4kpQ"
        transitionDuration="30"
        mapStyle="mapbox://styles/3salaz/cli6bc4e000m201rf0dfp3oyh"
        style={{ width: "100%", height: "100%", position: "relative" }} // Ensure the map takes full height and width
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
                <IonCardHeader className=" p-2">
                  <img
                    className="h-10 w-10 ion-align-self-center bg-slate-200 aspect-square rounded-full"
                    src={popupInfo.businessLogo}
                    alt="Logo"
                  />
                </IonCardHeader>
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
                    <div className="text-center">{popupInfo.description}</div>
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
  );
}

export default MapBox;
