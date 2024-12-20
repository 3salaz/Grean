import { useState, useEffect, useRef } from "react";
import { useLocations } from "../../../../context/LocationsContext";
import ReactMapGl, { Marker, Popup } from "react-map-gl";
import {
  IonInput,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonFooter,
} from "@ionic/react";
import businessIcon from "../../../../assets/icons/business.png";

function Map() {
  const { businessLocations } = useLocations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popupInfo, setPopupInfo] = useState(null);
  const [viewPort, setViewPort] = useState({
    latitude: 37.742646,
    longitude: -122.433247,
    zoom: 11,
  });

  const mapRef = useRef(null);

  useEffect(() => {
    // Resize map on viewport change
    if (mapRef.current) {
      mapRef.current.resize();
    }
  }, [viewPort]);

  useEffect(() => {
    console.log(businessLocations.categories)
    // Dynamically generate categories
    const uniqueCategories = Array.from(
      new Set(businessLocations.map((location) => location.category))
    ).filter(Boolean); // Remove null or undefined categories
    setCategories(["all", ...uniqueCategories]);
  }, [businessLocations]);

  useEffect(() => {
    // Filter locations by search query and category
    const results = businessLocations.filter((location) => {
      const matchesSearch =
        searchQuery === "" ||
        location.businessName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        location.category?.toLowerCase() === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredLocations(results);
  }, [searchQuery, selectedCategory, businessLocations]);

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
      {/* Search Bar and Category Filter */}
      <main className="absolute top-0 left-0 right-0 z-50 p-2">
        <IonRow className="w-full container mx-auto max-w-4xl">
          <IonCol size="10" className="mx-auto">
            <IonInput
              value={searchQuery}
              placeholder="Search for businesses"
              onIonChange={(e) => setSearchQuery(e.detail.value)}
              className="search-bar bg-white p-2 text-center rounded-lg drop-shadow-lg"
            />
          </IonCol>
        </IonRow>
      </main>

      {/* Map Component */}
      <IonRow className="h-full flex-grow">
        <IonCol size="12" id="map-container" className="h-full ion-no-padding">
          <ReactMapGl
            {...viewPort}
            ref={mapRef}
            onMove={(evt) => setViewPort(evt.viewState)}
            mapboxAccessToken="pk.eyJ1IjoiM3NhbGF6IiwiYSI6ImNsZG1xNjZ2aDBidnozb21kNTIxNTQ1a2wifQ.0JC6qoYDFC96znCbHh4kpQ"
            transitionDuration="30"
            mapStyle="mapbox://styles/3salaz/cli6bc4e000m201rf0dfp3oyh"
            style={{ width: "100%", height: "100%", position: "relative" }}
          >
            {pins}
            {popupInfo && (
              <Popup
                anchor="top"
                longitude={Number(popupInfo.longitude)}
                latitude={Number(popupInfo.latitude)}
                onClose={() => setPopupInfo(null)}
                closeOnClick={false}
              >
                <IonCard>
                  <IonCardHeader>
                    <h3>{popupInfo.businessName}</h3>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>{popupInfo.street}</p>
                    <p>
                      {popupInfo.city}, {popupInfo.state}
                    </p>
                    {popupInfo.businessWebsite && (
                      <a
                        href={popupInfo.businessWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </a>
                    )}
                  </IonCardContent>
                </IonCard>
              </Popup>
            )}
          </ReactMapGl>
        </IonCol>
      </IonRow>
      <IonFooter className="mx-auto container h-auto max-w-4xl shadow-none absolute bottom-10 p-2">
        <IonRow className="w-full gap-2 container mx-auto max-w-xl justify-center items-center">
        <IonCol size="10" className="mx-auto pt-2 rounded-md h-8">
            <IonSegment
              scrollable={true}
              value={selectedCategory}
              className="bg-slate-200 bg-opacity-80 rounded-full no-scroll p-0 m-0"
              onIonChange={(e) => setSelectedCategory(e.detail.value)}
            >
              {categories.map((category, index) => (
                <IonSegmentButton
                  key={index}
                  value={category.toLowerCase()}
                  className="max-w-20 m-0 p-0"
                >
                  <IonLabel className="bg-grean rounded-full px-2 p-1 box-border text-white text-xs flex">
                    {category}
                  </IonLabel>
                </IonSegmentButton>
              ))}
            </IonSegment>
          </IonCol>
        </IonRow>
      </IonFooter>
    </IonGrid>
  );
}

export default Map;
