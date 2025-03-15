import React, {useState} from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  useLoadScript
} from "@react-google-maps/api";
import {IonSpinner} from "@ionic/react";
import businessIcon from "../../assets/icons/business.png";
import {useBusinessLocations} from "../../hooks/useBusinessLocations";
import {LocationData} from "../../hooks/useUserLocations";

// Define the container style for the map.
const containerStyle = {
  width: "100%",
  height: "100%"
};

// Default center of the map.
const defaultCenter = {
  lat: 37.742646,
  lng: -122.433247
};

const Map: React.FC = () => {
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  const {locations: businessLocations, loading} = useBusinessLocations();
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(11);

  const handleMarkerClick = (location: LocationData) => {
    setSelectedLocation(location);
    setMapCenter({lat: location.latitude!, lng: location.longitude!});
    setMapZoom(14);
  };

  if (loadError) {
    console.error("Error loading Google Maps:", loadError);
    return <div>Error loading map</div>;
  }

  // Show spinner until both the API is loaded and data is fetched.
  if (!isLoaded || loading) {
    return <IonSpinner />;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={mapZoom}
    >
      {businessLocations.map((location) => (
        <Marker
          key={location.id}
          position={{lat: location.latitude!, lng: location.longitude!}}
          icon={{
            url: businessIcon,
            scaledSize: window.google?.maps
              ? new window.google.maps.Size(40, 40)
              : undefined
          }}
          onClick={() => handleMarkerClick(location)}
        />
      ))}

      {selectedLocation && (
        <InfoWindow
          position={{
            lat: selectedLocation.latitude!,
            lng: selectedLocation.longitude!
          }}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <div>
            <h3>{selectedLocation.businessName}</h3>
            <p>{selectedLocation.address}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default Map;
