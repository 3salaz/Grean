import React, {useState, useEffect} from "react";
import {IonCol, IonGrid, IonRow, IonSpinner} from "@ionic/react";
import {APIProvider, Map, AdvancedMarker} from "@vis.gl/react-google-maps";
import {motion, AnimatePresence} from "framer-motion"; // Import Framer Motion
import businessIcon from "../../assets/icons/business.png";
import homeIcon from "../../assets/icons/home.png";
import {useLocations, Location} from "../../context/LocationsContext";
import {UserProfile} from "../../context/ProfileContext";

// San Francisco center coordinates
const sanFranciscoCenter = {
  lat: 37.7749,
  lng: -122.4194
};

interface MapContainerProps {
  profile: UserProfile | null;
}

const MapContainer: React.FC<MapContainerProps> = ({profile}) => {
  const {profileLocations, businessLocations, loading} = useLocations();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [mapCenter, setMapCenter] = useState(sanFranciscoCenter);
  const [mapZoom, setMapZoom] = useState(11);

  // Merge profile and business locations while preventing duplicates
  const allLocations = [...profileLocations, ...businessLocations].reduce(
    (unique, loc) => {
      if (!unique.some((existing) => existing.id === loc.id)) {
        unique.push(loc);
      }
      return unique;
    },
    [] as Location[]
  );

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    setMapCenter({lat: location.latitude!, lng: location.longitude!});
    setMapZoom(14);
  };

  useEffect(() => {
    setMapCenter(sanFranciscoCenter);
  }, [allLocations]);

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "";

  if (loading) {
    return (
      <IonGrid className="h-full flex items-center justify-center">
        <IonRow className="container">
          <IonCol size="auto" className="mx-auto">
            <IonSpinner />
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="relative h-full w-full">
        <Map
          style={{width: "100%", height: "100%"}}
          defaultCenter={mapCenter}
          defaultZoom={mapZoom}
          mapId={MAP_ID}
          gestureHandling="greedy"
        >
          {allLocations.map((location) => {
            const iconSrc =
              location.locationType === "Home" ? homeIcon : businessIcon;
            return (
              <AdvancedMarker
                key={location.id}
                position={{lat: location.latitude, lng: location.longitude}}
                onClick={() => handleMarkerClick(location)}
              >
                <img src={iconSrc} width={32} height={32} />
              </AdvancedMarker>
            );
          })}
        </Map>

        {/* Bottom Panel with Framer Motion Animation */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{y: "100%"}} // Start off-screen
              animate={{y: 0}} // Slide up into view
              exit={{y: "100%"}} // Slide down when closed
              transition={{type: "spring", stiffness: 100, damping: 15}}
              className="absolute bottom-0 left-0 w-full bg-white shadow-lg p-4 border-t rounded-t-lg h-[50%]"
            >
              <button
                className="absolute top-2 right-4 text-lg"
                onClick={() => setSelectedLocation(null)}
              >
                ✖
              </button>
              <h3 className="text-lg font-semibold">
                {selectedLocation.businessName ||
                  selectedLocation.homeName ||
                  "No Name"}
              </h3>
              <p className="text-gray-600">
                {selectedLocation.address || "No address provided"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </APIProvider>
  );
};

export default MapContainer;
