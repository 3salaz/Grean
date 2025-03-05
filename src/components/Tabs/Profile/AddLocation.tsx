import { useState, useEffect, useRef } from "react";
import { useLocations } from "../../../context/LocationsContext";
import { motion } from "framer-motion";
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonRadioGroup,
  IonRadio,
  IonImg,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonSpinner,
} from "@ionic/react";
import { toast, ToastContainer } from "react-toastify";
import homeIcon from "../../../assets/icons/home.png";
import businessIcon from "../../../assets/icons/business.png";
import { useProfile, UserProfile } from "../../../context/ProfileContext";

// Import APIProvider and useMapsLibrary for autocomplete functionality.
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";

// ---------- PlaceAutocomplete Component ----------
interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({ onPlaceSelect }) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const options = {
      fields: ["geometry", "name", "formatted_address"],
      types: ["address"],
      componentRestrictions: { country: "us" },
    };
    const auto = new places.Autocomplete(inputRef.current, options);
    setAutocomplete(auto);
  }, [places]);

  useEffect(() => {
    if (!autocomplete) return;
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      onPlaceSelect(place);
    });
  }, [autocomplete, onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      placeholder="Enter street address"
      className="bg-white p-2 w-full"
    />
  );
};

// ---------- Main Component ----------
interface AddLocationProps {
  profile: UserProfile | null;
  handleClose: () => void;
}

const AddLocation: React.FC<AddLocationProps> = ({ profile, handleClose }) => {
  const { createLocation } = useLocations();
  const { updateProfile } = useProfile();
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCoordinates, setLoadingCoordinates] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    locationType: "",
    homeName: "",
    street: "",
    city: "",
    state: "California",
    businessName: "",
    businessPhoneNumber: "",
    category: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });
  // Track the selected place from autocomplete.
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  // Your API key (used for both APIProvider and fallback geocoding)
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // When a place is selected from autocomplete, update the form data.
  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place) {
      // Store the complete address.
      if (place.formatted_address) {
        setFormData((prevData) => ({
          ...prevData,
          street: place.formatted_address,
        }));
      }
      // Also store latitude and longitude if available.
      if (place.geometry && place.geometry.location) {
        setFormData((prevData) => ({
          ...prevData,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        }));
      }
    }
    setSelectedPlace(place);
  };

  // Fallback function to fetch coordinates using the Geocoding API if autocomplete doesn't provide them.
  const getCoordinates = async (address: string) => {
    if (!API_KEY) {
      toast.error("Google Maps API Key is missing.");
      return null;
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        throw new Error(`Geocoding API Error: ${data.status}`);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        return formData.locationType;
      case 1:
        // In step 1, we expect that the address (street) is filled (from autocomplete)
        // and that the city has been manually entered.
        return formData.street && formData.city;
      case 2:
        return formData.locationType === "Business"
          ? formData.businessName &&
              formData.businessPhoneNumber &&
              formData.category
          : formData.homeName;
      default:
        return false;
    }
  };

  const nextStep = async () => {
    if (!validateStep()) {
      toast.error("Please fill in all required fields before proceeding.");
      return;
    }
    // If no place was selected in step 1, attempt to fetch coordinates as a fallback.
    if (step === 1 && !selectedPlace) {
      setLoadingCoordinates(true);
      const fullAddress = `${formData.street}, ${formData.city}, ${formData.state}`;
      try {
        const coordinates = await getCoordinates(fullAddress);
        if (coordinates) {
          setFormData((prevData) => ({
            ...prevData,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          }));
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      } finally {
        setLoadingCoordinates(false);
      }
    }
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const handleSubmit = async () => {
    if (!profile?.uid) {
      toast.error("User profile not found.");
      return;
    }
    setLoading(true);
    try {
      const newLocation = {
        locationType: formData.locationType,
        street: formData.street, // complete address
        city: formData.city,
        state: formData.state,
        latitude: formData.latitude ?? undefined,
        longitude: formData.longitude ?? undefined,
        ...(formData.locationType === "Home" && {
          homeName: formData.homeName,
        }),
        ...(formData.locationType === "Business" && {
          businessName: formData.businessName,
          businessPhoneNumber: formData.businessPhoneNumber,
          category: formData.category,
        }),
      };

      const newLocationId = await createLocation(newLocation);
      await updateProfile("locations", newLocationId, "addToArray");

      toast.success("Location added successfully!");
      handleClose();
    } catch (error) {
      console.error("Error adding location:", error);
      toast.error("Failed to add location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonContent>
      <ToastContainer autoClose={3000} position="top-center" />

      <IonGrid className="h-full flex flex-col">
        <IonRow className="w-full flex-grow">
          <IonCol size="12">
            <IonCard className="w-full m-0 shadow-none flex flex-col items-center justify-center">
              <IonCardHeader>
                <IonCardTitle>Add Location</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="flex flex-col items-center justify-center p-2 w-full">
                <motion.div
                  key={step}
                  className="w-full p-2 flex flex-col"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 0 && (
                    <div>
                      <IonRadioGroup
                        value={formData.locationType}
                        onIonChange={(e) =>
                          handleInputChange("locationType", e.detail.value ?? "")
                        }
                        className="w-full flex justify-center gap-2"
                      >
                        <IonRadio value="Business">
                          <IonImg src={businessIcon} alt="Business" className="w-20 h-20" />
                          <IonText>Business</IonText>
                        </IonRadio>
                        <IonRadio value="Home">
                          <IonImg src={homeIcon} alt="Home" className="w-20 h-20" />
                          <IonText>Home</IonText>
                        </IonRadio>
                      </IonRadioGroup>
                    </div>
                  )}
                  {step === 1 && (
                    <div className="w-full">
                      {/* Wrap the autocomplete in an APIProvider so the Places library is loaded */}
                      <APIProvider apiKey={API_KEY}>
                        <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} />
                      </APIProvider>
                      {/* Optionally, you can include additional inputs (like City) */}
                      <IonItem>
                        <IonLabel position="stacked">City</IonLabel>
                        <IonInput
                          value={formData.city}
                          onIonChange={(e) =>
                            handleInputChange("city", e.detail.value ?? "")
                          }
                        />
                      </IonItem>
                    </div>
                  )}
                  {step === 2 && (
                    <IonList>
                      {formData.locationType === "Business" ? (
                        <>
                          <IonItem>
                            <IonLabel position="stacked">Business Name</IonLabel>
                            <IonInput
                              value={formData.businessName}
                              onIonChange={(e) =>
                                handleInputChange("businessName", e.detail.value ?? "")
                              }
                            />
                          </IonItem>
                          <IonItem>
                            <IonLabel position="stacked">Phone Number</IonLabel>
                            <IonInput
                              value={formData.businessPhoneNumber}
                              onIonChange={(e) =>
                                handleInputChange("businessPhoneNumber", e.detail.value ?? "")
                              }
                            />
                          </IonItem>
                          <IonItem>
                            <IonLabel position="stacked">Category</IonLabel>
                            <IonInput
                              value={formData.category}
                              onIonChange={(e) =>
                                handleInputChange("category", e.detail.value ?? "")
                              }
                            />
                          </IonItem>
                        </>
                      ) : (
                        <IonItem>
                          <IonLabel position="stacked">Home Name</IonLabel>
                          <IonInput
                            value={formData.homeName}
                            onIonChange={(e) =>
                              handleInputChange("homeName", e.detail.value ?? "")
                            }
                          />
                        </IonItem>
                      )}
                    </IonList>
                  )}
                  {loadingCoordinates && <IonSpinner />}
                </motion.div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow className="flex items-center justify-around ion-padding">
          {step > 0 && (
            <IonCol size="3">
              <IonButton expand="block" onClick={prevStep}>
                Back
              </IonButton>
            </IonCol>
          )}
          <IonCol size="3">
            <IonButton expand="block" color="medium" onClick={handleClose}>
              Cancel
            </IonButton>
          </IonCol>
          {step < 2 ? (
            <IonCol size="3">
              <IonButton expand="block" onClick={nextStep}>
                Next
              </IonButton>
            </IonCol>
          ) : (
            <IonCol size="3">
              <IonButton expand="block" onClick={handleSubmit} disabled={loading}>
                {loading ? <IonSpinner name="crescent" /> : "Submit"}
              </IonButton>
            </IonCol>
          )}
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default AddLocation;
