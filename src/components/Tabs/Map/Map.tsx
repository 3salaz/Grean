import { useState, useEffect, useRef, MutableRefObject } from "react";
import { useLocations } from "../../../context/LocationsContext";
import ReactMapGl, { Marker, Popup, ViewStateChangeEvent, MapRef } from "react-map-gl";
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
import businessIcon from "../../../assets/icons/business.png";
import { UserProfile } from "../../../context/ProfileContext";

interface BusinessLocation {
  businessName: string;
  category: string;
  longitude: number;
  latitude: number;
  street?: string;
  city?: string;
  state?: string;
  businessWebsite?: string;
}

interface MapProps {
  profile: UserProfile | null;
}

function Map({ profile }: MapProps) {
  const { businessLocations } = useLocations() as { businessLocations: BusinessLocation[] };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredLocations, setFilteredLocations] = useState<BusinessLocation[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [popupInfo, setPopupInfo] = useState<BusinessLocation | null>(null);
  const [viewPort, setViewPort] = useState({
    latitude: 37.742646,
    longitude: -122.433247,
    zoom: 11,
  });

const mapRef = useRef<MapRef | null>(null);


  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize?.();
    }
  }, [viewPort]);

  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(businessLocations.map((location) => location.category))
    ).filter(Boolean) as string[];

    setCategories(["all", ...uniqueCategories]);
  }, [businessLocations]);

  useEffect(() => {
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

  const pins = filteredLocations.map((location, index) => (
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
    <IonGrid className="h-full w-full ion-no-padding flex flex-col">
      {/* Search Bar and Category Filter */}
      <main className="absolute top-0 left-0 right-0 z-50 p-2">
        <IonRow className="w-full container mx-auto max-w-4xl">
          <IonCol size="10" className="mx-auto">
            <IonInput
              value={searchQuery}
              placeholder="Search for businesses"
              onIonChange={(e: CustomEvent) =>
                setSearchQuery((e.detail as { value: string }).value)
              }
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
            onMove={(evt: ViewStateChangeEvent) => {
              setViewPort(evt.viewState);
              mapRef.current?.flyTo({
                center: [evt.viewState.longitude, evt.viewState.latitude],
                zoom: evt.viewState.zoom,
                duration: 300,
              });
            }}
            
            mapboxAccessToken="pk.eyJ1IjoiM3NhbGF6IiwiYSI6ImNsZG1xNjZ2aDBidnozb21kNTIxNTQ1a2wifQ.0JC6qoYDFC96znCbHh4kpQ"
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

      <IonFooter className="mx-auto w-full h-auto shadow-none absolute bottom-10 p-2">
        <IonRow className="w-full gap-2 container mx-auto max-w-xl justify-center items-center">
          <IonCol size="10" className="mx-auto rounded-md h-8">
            <IonSegment
              scrollable={true}
              value={selectedCategory}
              className="bg-white rounded-full no-scroll p-0 m-0"
              onIonChange={(e: CustomEvent) => setSelectedCategory(e.detail.value!)}
            >
              {categories.map((category, index) => (
                <IonSegmentButton
                  key={index}
                  value={category.toLowerCase()}
                  className="max-w-20 m-0 p-0"
                >
                  <IonLabel className="bg-green rounded-full px-2 p-1 m-0 text-white text-xs flex">
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
