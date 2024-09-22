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
} from "@ionic/react";
import Loader from "../../../Common/Loader"; // Adjust the import path as needed
import homeIcon from "../../../../assets/icons/home.png";
import businessIcon from "../../../../assets/icons/business.png";

const AddLocation = ({ handleClose }) => {
  const { profile, addAddressToProfile } = useAuthProfile();
  const { addLocationToCollection } = useLocations();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingCoordinates, setLoadingCoordinates] = useState(false);
  const [formData, setFormData] = useState({
    locationType: "",
    homeName: "Home",
    street: "",
    city: "",
    state: "California",
    businessName: "",
    businessPhoneNumber: "",
    businessLogo: "",
  });

  const handleAddLocation = async (address) => {
    if (profile) {
      await addAddressToProfile(profile.uid, address);
      await addLocationToCollection(profile.uid, address);
    }
  };

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
        if (formData.locationType === "Business") {
          return formData.businessName && formData.businessPhoneNumber;
        } else {
          return formData.homeName;
        }
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
    } else {
      throw new Error("Unable to retrieve coordinates for the address.");
    }
  };

  const nextStep = async () => {
    if (!validateStep()) {
      console.log("Please fill in all required fields before proceeding.");
      return;
    }

    if (step === 1) {
      setLoadingCoordinates(true); // Start loading
      const fullAddress = `${formData.street}, ${formData.city}, ${formData.state}`;
      try {
        const { latitude, longitude } = await getCoordinates(fullAddress);
        setFormData((prevData) => ({
          ...prevData,
          latitude,
          longitude,
        }));
      } catch (error) {
        console.log("Error fetching coordinates:", error.message);
        console.log(loadingCoordinates);
        setLoadingCoordinates(false);
        return;
      }
      setLoadingCoordinates(false); // Stop loading after the coordinates are fetched
    }

    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const handleSubmit = async () => {
    if (!validateStep()) {
      console.log("Please fill in all required fields.");
      return;
    }

    setLoading(true); // Start loading

    try {
      // Construct the address object with all required and optional fields
      const address = {
        locationType: formData.locationType || "Unknown", // Default to "Unknown" if locationType is not selected
        street: formData.street || "", // Default to empty string if street is not filled
        city: formData.city || "", // Default to empty string if city is not filled
        state: formData.state || "California", // Default to "California" if state is not filled
        latitude: formData.latitude || null, // Default to null if latitude is not available
        longitude: formData.longitude || null, // Default to null if longitude is not available
        ...(formData.locationType === "Home" && {
          homeName: formData.homeName || "Home", // Default to "Home" if homeName is not filled
        }),
        ...(formData.locationType === "Business" && {
          businessName: formData.businessName || "", // Default to empty string if businessName is not filled
          businessPhoneNumber: formData.businessPhoneNumber || "", // Default to empty string if businessPhoneNumber is not filled
        }),
      };

      // Check for undefined values in the address object before adding it to Firestore
      for (const key in address) {
        if (address[key] === undefined) {
          throw new Error(
            `Field ${key} is undefined. Please ensure all required fields are filled.`
          );
        }
      }

      await handleAddLocation(address);
      console.log("Location added successfully!");
      handleClose();
    } catch (error) {
      console.log("Error adding location: " + error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const renderStep = () => {
    return (
      <IonGrid className="h-full flex-col flex justify-center items-center">
        <IonRow className="ion-justify-content-center w-full ">
          <IonCol size="12" size-md="12" className="flex flex-col items-center">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {step === 0 && (
                <IonRadioGroup
                  value={formData.locationType}
                  className="w-full flex justify-center gap-4"
                  onIonChange={(e) =>
                    handleInputChange("locationType", e.detail.value)
                  }
                >
                  <IonRadio value="Business" labelPlacement="stacked">
                    <IonImg
                      className="h-40 w-40 aspect-square object-cover"
                      src={businessIcon}
                      alt="business"
                    ></IonImg>
                    <IonText color="primary" className="ion-text-center">
                      <h4>Business</h4>
                    </IonText>
                  </IonRadio>
                  <IonRadio
                    value="Home"
                    labelPlacement="stacked"
                    alignment="center"
                  >
                    <IonImg
                      className="h-40 w-40 aspect-square object-cover"
                      src={homeIcon}
                      alt="Home"
                    ></IonImg>
                    <IonText color="primary" className="ion-text-center">
                      <h4>Home</h4>
                    </IonText>
                  </IonRadio>
                </IonRadioGroup>
              )}
              {step === 1 && (
                <IonGrid>
                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonLabel position="stacked">Street</IonLabel>
                        <IonInput
                          value={formData.street}
                          onIonChange={(e) =>
                            handleInputChange("street", e.detail.value)
                          }
                        />
                      </IonItem>
                      <IonItem>
                        <IonLabel position="stacked">City</IonLabel>
                        <IonInput
                          value={formData.city}
                          onIonChange={(e) =>
                            handleInputChange("city", e.detail.value)
                          }
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              )}
              {step === 2 && (
                <IonGrid>
                  <IonRow>
                    <IonCol size="12">
                      {formData.locationType === "Home" ? (
                        <IonItem>
                          <IonLabel position="stacked">Home Name</IonLabel>
                          <IonInput
                            value={formData.homeName}
                            onIonChange={(e) =>
                              handleInputChange(
                                "homeName",
                                e.detail.value || "Home"
                              )
                            }
                            placeholder="Enter home name"
                          />
                        </IonItem>
                      ) : (
                        <>
                          <IonItem>
                            <IonLabel position="stacked">
                              Business Name
                            </IonLabel>
                            <IonInput
                              value={formData.businessName}
                              onIonChange={(e) =>
                                handleInputChange(
                                  "businessName",
                                  e.detail.value
                                )
                              }
                              placeholder="Enter business name"
                            />
                          </IonItem>

                          <IonItem>
                            <IonLabel position="stacked">
                              Business Phone Number
                            </IonLabel>
                            <IonInput
                              value={formData.businessPhoneNumber}
                              onIonChange={(e) =>
                                handleInputChange(
                                  "businessPhoneNumber",
                                  e.detail.value
                                )
                              }
                              placeholder="Enter Business Number"
                            />
                          </IonItem>
                        </>
                      )}
                    </IonCol>
                  </IonRow>
                </IonGrid>
              )}
            </motion.div>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  };

  return (
    <IonContent className="flex items-center justify-center">
      <IonGrid className="h-[92svh] max-w-xl">
        <IonRow className="h-full">
          <IonCol size="12" className="ion-align-self-center">
            <IonCard className="">
              <IonCardHeader>
                <IonCardTitle>Add Location</IonCardTitle>
                {/* <IonCardSubtitle>Basic</IonCardSubtitle> */}
              </IonCardHeader>
              <IonCardContent>
                {renderStep()}
                {loading && <Loader />}
              </IonCardContent>
            </IonCard>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonToolbar>
                    <IonGrid>
                      <IonRow className="ion-margin-top ion-justify-content-center">
                        {step > 0 && (
                          <IonCol size="6">
                            <IonButton expand="block" onClick={prevStep}>
                              Back
                            </IonButton>
                          </IonCol>
                        )}

                        {step === 0 && (
                          <>
                            <IonCol
                              size="6"
                            >
                              <IonButton
                                expand="block"
                                color="danger"
                                onClick={handleClose}
                              >
                                Close
                              </IonButton>
                            </IonCol>
                            <IonCol size="6">
                              <IonButton expand="block" onClick={nextStep}>
                                Next
                              </IonButton>
                            </IonCol>
                          </>
                        )}

                        {step === 1 && (
                          <IonCol size="6">
                            <IonButton expand="block" onClick={nextStep}>
                              Next
                            </IonButton>
                          </IonCol>
                        )}

                        {step === 2 && (
                          <IonCol size="6">
                            <IonButton expand="block" onClick={handleSubmit}>
                              Submit
                            </IonButton>
                          </IonCol>
                        )}
                      </IonRow>
                    </IonGrid>
                  </IonToolbar>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default AddLocation;
