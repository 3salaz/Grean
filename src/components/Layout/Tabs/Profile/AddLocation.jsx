import { useState } from "react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { useLocations } from "../../../../context/LocationsContext";
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
  IonToolbar,
  IonSelectOption,
  IonSelect,
} from "@ionic/react";
import Loader from "../../../Common/Loader"; // Adjust the import path as needed
import homeIcon from "../../../../assets/icons/home.png";
import businessIcon from "../../../../assets/icons/business.png";

const AddLocation = ({ handleClose }) => {
  const { profile, updateProfileField } = useAuthProfile(); // Access AuthProfileContext
  const { createLocation, locations } = useLocations(); // Access LocationsContext

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingCoordinates, setLoadingCoordinates] = useState(false);
  const [formData, setFormData] = useState({
    locationType: "",
    homeName: "",
    street: "",
    city: "",
    state: "California",
    businessName: "",
    businessPhoneNumber: "",
    category: "",
  });

  const handleInputChange = (name, value) => {
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
        return formData.street && formData.city && formData.state;
      case 2:
        return formData.locationType === "Business"
          ? formData.businessName && formData.businessPhoneNumber && formData.category
          : formData.homeName;
      default:
        return false;
    }
  };

  const getCoordinates = async (address) => {
    const response = await fetch(
      `https://geocode.maps.co/search?q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    }
    throw new Error("Unable to retrieve coordinates for the address.");
  };

  const nextStep = async () => {
    if (!validateStep()) {
      console.log("Please fill in all required fields before proceeding.");
      return;
    }

    if (step === 1) {
      setLoadingCoordinates(true);
      const fullAddress = `${formData.street}, ${formData.city}, ${formData.state}`;
      try {
        const { latitude, longitude } = await getCoordinates(fullAddress);
        setFormData((prevData) => ({ ...prevData, latitude, longitude }));
      } catch (error) {
        console.error("Error fetching coordinates:", error.message);
      } finally {
        setLoadingCoordinates(false);
      }
    }

    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const handleSubmit = async () => {
    if (!validateStep()) {
      console.log("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const newLocation = {
        locationType: formData.locationType || "Unknown",
        street: formData.street || "",
        city: formData.city || "",
        state: formData.state || "California",
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
        ...(formData.locationType === "Home" && {
          homeName: formData.homeName || "Home",
        }),
        ...(formData.locationType === "Business" && {
          businessName: formData.businessName || "",
          businessPhoneNumber: formData.businessPhoneNumber || "",
          category: formData.category || "Other",
        }),
      };

      const newLocationId = await createLocation(newLocation);

      // Update profile.locations with the new location ID
      const locationWithId = { ...newLocation, id: newLocationId };
      await updateProfileField(profile.uid, "locations", locationWithId, "addToArray");

      console.log("Location added successfully!");
      handleClose(); // Close the modal on success
    } catch (error) {
      console.error("Error adding location:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <IonRadioGroup
            value={formData.locationType}
            className="w-full flex justify-center gap-4"
            onIonChange={(e) =>
              handleInputChange("locationType", e.detail.value)
            }
          >
            <IonRadio value="Business" labelPlacement="stacked">
              <IonImg className="h-40 w-40" src={businessIcon} alt="Business" />
              <IonText className="text-center" color="primary">
                <h4>Business</h4>
              </IonText>
            </IonRadio>
            <IonRadio value="Home" labelPlacement="stacked">
              <IonImg className="h-40 w-40" src={homeIcon} alt="Home" />
              <IonText className="text-center" color="primary">
                <h4>Home</h4>
              </IonText>
            </IonRadio>
          </IonRadioGroup>
        );
      case 1:
        return (
          <>
            <IonItem>
              <IonLabel position="stacked">Street</IonLabel>
              <IonInput
                value={formData.street}
                onIonChange={(e) => handleInputChange("street", e.detail.value)}
                placeholder="Enter street address"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">City</IonLabel>
              <IonSelect
                value={formData.city}
                onIonChange={(e) => handleInputChange("city", e.detail.value)}
                placeholder="Select a city"
              >
                <IonSelectOption value="San Francisco">San Francisco</IonSelectOption>
                <IonSelectOption value="Daly City">Daly City</IonSelectOption>
              </IonSelect>
            </IonItem>
          </>
        );
      case 2:
        return formData.locationType === "Home" ? (
          <IonItem>
            <IonLabel position="stacked">Home Name</IonLabel>
            <IonInput
              value={formData.homeName}
              onIonChange={(e) => handleInputChange("homeName", e.detail.value)}
              placeholder="Enter home name"
            />
          </IonItem>
        ) : (
          <>
            <IonItem>
              <IonLabel position="stacked">Business Name</IonLabel>
              <IonInput
                value={formData.businessName}
                onIonChange={(e) =>
                  handleInputChange("businessName", e.detail.value)
                }
                placeholder="Enter business name"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Business Phone Number</IonLabel>
              <IonInput
                value={formData.businessPhoneNumber}
                onIonChange={(e) =>
                  handleInputChange("businessPhoneNumber", e.detail.value)
                }
                placeholder="Enter business phone number"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Category</IonLabel>
              <IonSelect
                value={formData.category}
                onIonChange={(e) =>
                  handleInputChange("category", e.detail.value)
                }
                placeholder="Select a Category"
              >
                {[
                  "Restaurant",
                  "Bar",
                  "Hotel",
                  "Grocery Store",
                  "Office",
                  "Event Venue",
                  "Other",
                ].map((category) => (
                  <IonSelectOption key={category} value={category}>
                    {category}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <IonContent className="flex h-full items-center justify-center">
      <IonGrid className="max-w-4xl h-full flex items-center justify-center">
        <IonRow className="w-full">
          <IonCol size="12">
            <IonCard className="w-full m-0 shadow-none">
              <IonCardHeader>
                <IonCardTitle>Add Location</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                  {loadingCoordinates && <Loader />}
                </motion.div>
                {loading && <Loader />}
              </IonCardContent>
            </IonCard>
            <IonToolbar>
              <IonRow className="ion-margin-top ion-justify-content-center">
                {step === 0 && (
                  <IonCol size="4">
                    <IonButton
                      color="danger"
                      expand="block"
                      onClick={handleClose}
                    >
                      Exit
                    </IonButton>
                  </IonCol>
                )}
                {step > 0 && (
                  <IonCol size="4">
                    <IonButton expand="block" onClick={prevStep}>
                      Back
                    </IonButton>
                  </IonCol>
                )}
                {step < 2 && (
                  <IonCol size="4">
                    <IonButton expand="block" onClick={nextStep}>
                      Next
                    </IonButton>
                  </IonCol>
                )}
                {step === 2 && (
                  <IonCol size="4">
                    <IonButton expand="block" onClick={handleSubmit}>
                      Submit
                    </IonButton>
                  </IonCol>
                )}
              </IonRow>
            </IonToolbar>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default AddLocation;
