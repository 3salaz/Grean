import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMapGl, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import { useLocations } from "../../context/LocationContext";

function Map() {
  const [viewPort, setViewPort] = useState({
    center: [-122.433247, 37.742646], // starting position
    latitide: 37.742646,
    longitude: -122.433247,
    zoom: 11,
  });

  const bounds = [
    [-122.66336, 37.492987], // Southwest coordinates
    [-122.250481, 37.871651], // Northeast coordinates
  ];

  const [popupInfo, setPopupInfo] = useState(null);
  const { locations } = useLocations(); // Use the context to get locations

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

  const pins = useMemo(
    () =>
      locations.map((location, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={location.lng}
          latitude={location.lat}
          anchor="bottom"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(location);
          }}
        >
          <div className="flex flex-col items-center justify-center rounded-full p-1 drop-shadow-xl border-grean text-grean border-2 hover:text-orange hover:border-orange slate-800 bg-white">
            <ion-icon
              className="w-full h-full flex items-center justify-center"
              name="pin-sharp"
              size="small"
            ></ion-icon>
          </div>
        </Marker>
      )),
    [locations]
  );

  return (
    <div id="map" className="h-full w-full relative">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white h-[80%] mt-[8svh]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center text-white font-bold aspect-square bg-grean rounded-full flex items-center justify-center p-4"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              Loading...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <ReactMapGl
          {...viewPort}
          onMove={(evt) => setViewPort(evt.viewState)}
          maxBounds={bounds} // Set the map's geographical boundaries.
          mapboxAccessToken="pk.eyJ1IjoiM3NhbGF6IiwiYSI6ImNsZG1xNjZ2aDBidnozb21kNTIxNTQ1a2wifQ.0JC6qoYDFC96znCbHh4kpQ"
          transitionDuration="30"
          className="h-full w-full overflow-hidden"
          mapStyle={"mapbox://styles/3salaz/cli6bc4e000m201rf0dfp3oyh"}
        >
          <GeolocateControl position="top-left" />
          <FullscreenControl position="top-left" />
          <NavigationControl position="top-left" />
          {/* <ScaleControl /> */}
          {pins}
          {popupInfo && (
            <Popup
              anchor="top"
              longitude={Number(popupInfo.lng)}
              latitude={Number(popupInfo.lat)}
              onClose={() => setPopupInfo(null)}
              className="border-grean border-b-4"
            >
              <div className="bg-white flex flex-col gap-1">
                <header>
                  <div className="flex items-center justify-center">
                    <img className="w-full rounded-full basis-1/3" src={popupInfo.busisnessLogo} alt="business logo" /> 
                  </div>

                  <div className="flex text-[16px] items-center justify-center">
                    <div className="text-2xl">{popupInfo.businessName}</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <a className="text-grean font-bold basis-1/3 text-center" target="_new" href={popupInfo.website}>
                      Website
                    </a>
                  </div>
                </header>
                <div id="stats" className="flex gap-1 text-white text-center">
                  <div className="basis-1/3 bg-grean rounded-sm">
                    Trash: 12lbs
                  </div>
                  <div className="basis-1/3 bg-grean rounded-sm">Home: 12lbs</div>
                  <div className="basis-1/3 bg-grean rounded-sm">Car: 12lbs</div>
                </div>
                <div>
                  <div className="text-center">{popupInfo.description}</div>
                </div>
              </div>
            </Popup>
          )}
        </ReactMapGl>
      )}
    </div>
  );
}

export default Map;
