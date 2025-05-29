import React, { useState, useEffect, useRef } from "react";
import { IonGrid, IonRow, IonCol, IonSpinner } from "@ionic/react";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { motion, AnimatePresence } from "framer-motion";
import { useLocations, Location } from "../../context/LocationsContext";
import { UserProfile } from "../../context/ProfileContext";
import businessIcon from "../../assets/icons/business.png";
import homeIcon from "../../assets/icons/home.png";

// San Francisco center
const sanFranciscoCenter = { lat: 37.7749, lng: -122.4194 };
const SF_BAY_AREA_BOUNDS = {
    north: 38.343,
    south: 36.800,
    west: -123.173,
    east: -121.684
};
const BUSINESS_CATEGORIES = [
    "Retail", "Food & Beverage", "Health & Wellness",
    "Professional Services", "Education", "Entertainment", "Other"
];

interface InternalMapProps {
    profile: UserProfile | null;
}

const InternalMap: React.FC<InternalMapProps> = ({ profile }) => {
    const { profileLocations, businessLocations, loading } = useLocations();
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState(sanFranciscoCenter);
    const [mapZoom, setMapZoom] = useState(11);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Location[]>([]);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const filterRowRef = useRef<HTMLIonRowElement | null>(null);

    const scrollFilterToStart = () => {
        const el = filterRowRef.current;
        if (!el) return;

        // Wait until Ionic is ready
        el.componentOnReady().then(() => {
            const scrollable = el.shadowRoot?.querySelector("div") || el.querySelector("div");
            scrollable?.scrollTo({ left: 0, behavior: "smooth" });
        });
    };




    const map = useMap();

    useEffect(() => {
        function handleClickOutside(event: PointerEvent) {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setSelectedLocation(null);
            }
        }

        if (selectedLocation) {
            document.addEventListener("pointerdown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    }, [selectedLocation]);


    useEffect(() => {
        if (map) {
            map.setOptions({
                restriction: {
                    latLngBounds: SF_BAY_AREA_BOUNDS,
                    strictBounds: true,
                },
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
            });
        }
    }, [map]);

    const filteredLocations = [...profileLocations, ...businessLocations].reduce((unique, loc) => {
        const isHome = loc.locationType === "Home";
        const matchesCategory = !selectedCategory || loc.category === selectedCategory;

        if (!unique.some((existing) => existing.id === loc.id) && (isHome || matchesCategory)) {
            unique.push(loc);
        }
        return unique;
    }, [] as Location[]);

    const handleMarkerClick = (location: Location) => {
        setSelectedLocation(location);
        setMapCenter({ lat: location.latitude!, lng: location.longitude! });
        setMapZoom(14);
    };

    if (loading) {
        return (
            <IonGrid className="h-full ion-no-padding container mx-auto">
                <IonRow className="h-full">
                    <IonCol className="flex items-center justify-center w-full h-full bg-white">
                        <IonSpinner color="primary" name="crescent" />
                    </IonCol>
                </IonRow>
            </IonGrid>
        );
    }

    return (
        <main className="relative container max-w-2xl mx-auto flex-grow overflow-auto">
            {/* Overlay: Category Filter */}
            <IonGrid className="absolute top-0 left-0 w-full z-10 p-2">
                <IonRow
                    ref={filterRowRef}
                    className="flex-nowrap overflow-x-auto no-scrollbar bg-white/90 p-2 rounded-xl shadow-md text-xs gap-2"
                    style={{ WebkitOverflowScrolling: "touch" }}
                >
                    <IonCol
                        size="auto"
                        className={`flex-shrink-0 px-3 py-1 rounded-full ${selectedCategory === null ? "bg-green-600 text-white" : "bg-gray-200"
                            }`}
                    >
                        <button onClick={() => {
                            setSelectedCategory(null);
                            scrollFilterToStart();
                        }}>All</button>
                    </IonCol>
                    {BUSINESS_CATEGORIES.map((category) => (
                        <IonCol
                            key={category}
                            size="auto"
                            className={`flex-shrink-0 px-3 py-1 rounded-full ${selectedCategory === category ? "bg-green-600 text-white" : "bg-gray-200"
                                }`}
                        >
                            <button onClick={() => setSelectedCategory(category)}>{category}</button>
                        </IonCol>
                    ))}
                </IonRow>
            </IonGrid>


            {/* Map */}
            <Map
                style={{ width: "100%", height: "100%" }}
                defaultCenter={mapCenter}
                defaultZoom={mapZoom}
                mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || ""}
                gestureHandling="greedy"
            >
                {filteredLocations.map((location) => {
                    const { latitude, longitude } = location;
                    if (latitude == null || longitude == null) return null;
                    const iconSrc = location.locationType === "Home" ? homeIcon : businessIcon;

                    return (
                        <AdvancedMarker
                            key={location.id}
                            position={{ lat: latitude, lng: longitude }}
                            onClick={() => handleMarkerClick(location)}
                        >
                            <img src={iconSrc} width={32} height={32} />
                        </AdvancedMarker>
                    );
                })}
            </Map>

            <AnimatePresence>
                {!selectedLocation && (
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className="absolute bottom-0 left-0 w-full z-20 p-2 flex justify-center"
                    >
                        <IonGrid className="w-full max-w-xl flex-col gap-2 bg-white/90 p-2 rounded-xl shadow-md">
                            <IonRow>
                                <IonCol size="12" className="bg-white">
                                    <input
                                        type="text"
                                        placeholder="Search by name or address"
                                        onFocus={() => {
                                            setSelectedCategory(null);
                                            scrollFilterToStart();
                                        }}
                                        value={searchQuery}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setSearchQuery(value);
                                            if (value.trim() === "") {
                                                setSearchResults([]);
                                            } else {
                                                const results = filteredLocations.filter((loc) =>
                                                    [loc.businessName, loc.homeName, loc.address]
                                                        .some((field) =>
                                                            field?.toLowerCase().includes(value.toLowerCase())
                                                        )
                                                );
                                                setSearchResults(results);
                                            }
                                        }}
                                        className="w-full p-2 border border-2 border-[#75B657] rounded-lg"
                                    />
                                </IonCol>
                            </IonRow>
                            {searchResults.length > 0 && (
                                <IonRow>
                                    <IonCol size="auto" className="bg-white border rounded-lg overflow-y-auto h-40 w-full">
                                        {searchResults.map((loc) => (
                                            <div
                                                key={loc.id}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedLocation(loc);
                                                    setMapCenter({ lat: loc.latitude!, lng: loc.longitude! });
                                                    setMapZoom(14);
                                                    setSearchQuery("");
                                                    setSearchResults([]);
                                                }}
                                            >
                                                <div className="font-semibold">
                                                    {loc.businessName || loc.homeName || "Unnamed"}
                                                </div>
                                                <div className="text-sm text-gray-500">{loc.address}</div>
                                            </div>
                                        ))}
                                    </IonCol>
                                </IonRow>
                            )}
                        </IonGrid>
                    </motion.div>
                )}
            </AnimatePresence>





            {/* Bottom Panel */}
            <AnimatePresence>
                {selectedLocation && (
                    <motion.section
                        ref={panelRef}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className="absolute bottom-0 left-0 shadow-lg rounded-t-lg md:h-[40%] w-full"
                    >
                        <div className="bg-white max-w-xl mx-auto border-2 border-[#75B657] border-b-0 h-full relative ion-padding rounded-md">
                            <button
                                className="absolute top-2 right-4 text-lg"
                                onClick={() => setSelectedLocation(null)}
                            >
                                ✖
                            </button>
                            <h3 className="text-lg font-semibold">
                                {selectedLocation.businessName || selectedLocation.homeName || "No Name"}
                            </h3>
                            <p className="text-gray-600">
                                {selectedLocation.address || "No address provided"}
                            </p>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </main >
    );
};

export default InternalMap;
