import React, {useState, useEffect, useRef} from "react";
import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonAlert,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonList,
  IonSpinner,
  IonRadioGroup,
  IonRadio,
  IonImg,
  IonText
} from "@ionic/react";
import {useProfile, UserProfile} from "../context/ProfileContext";
import {toast, ToastContainer} from "react-toastify";
import {useLocations} from "../context/LocationsContext";
import {APIProvider, useMapsLibrary} from "@vis.gl/react-google-maps";
import homeIcon from "../assets/icons/home.png";
import businessIcon from "../assets/icons/business.png";

// PlaceAutocomplete Component
interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({
  onPlaceSelect
}) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const options = {
      fields: ["geometry", "name", "formatted_address"],
      types: ["address"],
      componentRestrictions: {country: "us"}
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

function Testing() {
  const {createProfile, updateProfile, deleteProfile, profile} = useProfile();
  const {createLocation} = useLocations();
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [locationData, setLocationData] = useState({
    locationType: "",
    address: "", // Complete address from autocomplete
    homeName: "",
    businessName: "",
    businessPhoneNumber: "",
    category: "",
    latitude: null as number | null,
    longitude: null as number | null
  });
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCoordinates, setLoadingCoordinates] = useState<boolean>(false);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName,
        email: profile.email,
        photoURL: profile.photoURL,
        uid: profile.uid,
        locations: profile.locations,
        pickups: profile.pickups,
        accountType: profile.accountType
      });
    }
  }, [profile]);

  const handleChange = (e: CustomEvent) => {
    const target = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value
    }));
  };

  const handleLocationChange = (e: CustomEvent) => {
    const target = e.target as HTMLInputElement;
    setLocationData((prev) => ({
      ...prev,
      [target.name]: target.value
    }));
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place) {
      const updatedFields: Partial<typeof locationData> = {};
      if (place.formatted_address) {
        updatedFields.address = place.formatted_address;
      }
      if (place.geometry && place.geometry.location) {
        updatedFields.latitude = place.geometry.location.lat();
        updatedFields.longitude = place.geometry.location.lng();
      }
      setLocationData((prevData) => ({
        ...prevData,
        ...updatedFields
      }));
    }
    setSelectedPlace(place);
  };

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
        const {lat, lng} = data.results[0].geometry.location;
        return {latitude: lat, longitude: lng};
      } else {
        throw new Error(`Geocoding API Error: ${data.status}`);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        return locationData.locationType;
      case 1:
        return (
          locationData.address &&
          locationData.latitude &&
          locationData.longitude
        );
      case 2:
        return locationData.locationType === "Business"
          ? locationData.businessName &&
              locationData.businessPhoneNumber &&
              locationData.category
          : locationData.homeName;
      default:
        return false;
    }
  };

  const nextStep = async () => {
    if (!validateStep()) {
      toast.error("Please fill in all required fields before proceeding.");
      return;
    }
    if (step === 1 && !selectedPlace) {
      setLoadingCoordinates(true);
      try {
        const coordinates = await getCoordinates(locationData.address);
        if (coordinates) {
          setLocationData((prevData) => ({
            ...prevData,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
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

  const handleCreateProfile = async () => {
    try {
      await createProfile(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (formData.displayName) {
        await updateProfile("displayName", formData.displayName);
      }
      if (formData.email) {
        await updateProfile("email", formData.email);
      }
      if (formData.photoURL) {
        await updateProfile("photoURL", formData.photoURL);
      }
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.log(error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await deleteProfile();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateLocation = async () => {
    if (!profile?.uid) {
      toast.error("User profile not found.");
      return;
    }
    setLoading(true);
    try {
      let newLocation: any = {
        locationType: locationData.locationType,
        address: locationData.address,
        latitude: locationData.latitude ?? undefined,
        longitude: locationData.longitude ?? undefined
      };

      if (locationData.locationType === "Home") {
        newLocation.homeName = locationData.homeName;
      } else if (locationData.locationType === "Business") {
        newLocation.businessName = locationData.businessName;
        newLocation.businessPhoneNumber = locationData.businessPhoneNumber;
        newLocation.category = locationData.category;
      }

      // const newLocationId = await
      createLocation(newLocation);
    } catch (error) {
      console.error("Error adding location:", error);
      toast.error("Failed to add location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <ToastContainer />
      <IonContent scroll-y="false">
        <IonGrid class="container mx-auto max-w-xl">
          <IonCard className="ion-padding ion-margin">
            <IonCardHeader>
              <IonCardTitle>Profile Functions</IonCardTitle>
            </IonCardHeader>
            <IonCardContent class="flex gap-4">
              <IonRow>
                <IonCol size="auto" className="ion-padding">
                  <IonButton onClick={handleCreateProfile}>
                    Create Profile
                  </IonButton>
                </IonCol>
              </IonRow>
              {profile && (
                <IonRow class="bg-pink-100 ion-padding">
                  <IonCol size="12">
                    <IonItem>
                      <IonLabel position="fixed">Name</IonLabel>
                      <IonInput
                        name="displayName"
                        value={formData.displayName || ""}
                        onIonInput={handleChange}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="fixed">Email</IonLabel>
                      <IonInput
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onIonInput={handleChange}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="fixed">Profile Picture URL</IonLabel>
                      <IonInput
                        name="photoURL"
                        type="text"
                        value={formData.photoURL || ""}
                        onIonInput={handleChange}
                      />
                    </IonItem>
                  </IonCol>
                  <IonCol size="auto" className="ion-padding">
                    <IonButton onClick={handleUpdateProfile}>
                      Edit Profile
                    </IonButton>
                  </IonCol>
                </IonRow>
              )}
              {profile && (
                <IonRow>
                  <IonCol>
                    <IonButton onClick={() => setShowDeleteAlert(true)}>
                      Delete Profile
                    </IonButton>
                  </IonCol>
                </IonRow>
              )}
            </IonCardContent>
          </IonCard>

          <IonCard className="ion-padding ion-margin">
            <IonCardHeader>
              <IonCardTitle>Location Functions</IonCardTitle>
            </IonCardHeader>
            <IonCardContent class="flex gap-4">
              <IonRow>
                <IonCol size="12">
                  {step === 0 && (
                    <IonRadioGroup
                      value={locationData.locationType}
                      onIonChange={(e) =>
                        setLocationData((prev) => ({
                          ...prev,
                          locationType: e.detail.value
                        }))
                      }
                      className="w-full flex justify-center gap-2"
                    >
                      <IonItem>
                        <IonRadio slot="start" value="Business" />
                        <IonImg
                          src={businessIcon}
                          alt="Business"
                          className="w-20 h-20 text-center"
                        />
                        <IonText>Business</IonText>
                      </IonItem>
                      <IonItem>
                        <IonRadio slot="start" value="Home" />
                        <IonImg
                          src={homeIcon}
                          alt="Home"
                          className="w-20 h-20 text-center"
                        />
                        <IonText>Home</IonText>
                      </IonItem>
                    </IonRadioGroup>
                  )}
                  {step === 1 && (
                    <APIProvider apiKey={API_KEY}>
                      <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} />
                    </APIProvider>
                  )}
                  {step === 2 && (
                    <IonList>
                      {locationData.locationType === "Business" ? (
                        <>
                          <IonItem>
                            <IonLabel position="stacked">
                              Business Name
                            </IonLabel>
                            <IonInput
                              name="businessName"
                              value={locationData.businessName}
                              onIonInput={handleLocationChange}
                            />
                          </IonItem>
                          <IonItem>
                            <IonLabel position="stacked">Phone Number</IonLabel>
                            <IonInput
                              name="businessPhoneNumber"
                              value={locationData.businessPhoneNumber}
                              onIonInput={handleLocationChange}
                            />
                          </IonItem>
                          <IonItem>
                            <IonLabel position="stacked">Category</IonLabel>
                            <IonInput
                              name="category"
                              value={locationData.category}
                              onIonInput={handleLocationChange}
                            />
                          </IonItem>
                        </>
                      ) : (
                        <IonItem>
                          <IonLabel position="stacked">Home Name</IonLabel>
                          <IonInput
                            name="homeName"
                            value={locationData.homeName}
                            onIonInput={handleLocationChange}
                          />
                        </IonItem>
                      )}
                    </IonList>
                  )}
                  {loadingCoordinates && <IonSpinner />}
                </IonCol>
                <IonCol size="auto" className="ion-padding">
                  <IonButton
                    onClick={step < 2 ? nextStep : handleCreateLocation}
                    disabled={loadingCoordinates}
                  >
                    {step < 2 ? "Next" : "Submit"}
                  </IonButton>
                  {step > 0 && (
                    <IonButton onClick={prevStep} color="light">
                      Back
                    </IonButton>
                  )}
                </IonCol>
              </IonRow>
            </IonCardContent>
          </IonCard>
        </IonGrid>
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header={"Delete Profile"}
          message={
            "Are you sure you want to delete your profile? This action cannot be undone."
          }
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {
                setShowDeleteAlert(false);
              }
            },
            {
              text: "Delete",
              handler: () => {
                handleDeleteProfile();
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
}

export default Testing;
