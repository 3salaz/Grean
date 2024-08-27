import React, { useState } from "react";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { useLocations } from "../../../../context/LocationsContext";
import { toast } from "react-toastify";
import { Form, Button, Input, Radio, Select, Upload } from "antd";
import { motion } from "framer-motion";
import { storage } from "../../../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Loader from "../../../Common/Loader"; // Adjust the import path as needed
import homeIcon from "../../../../assets/icons/home.png";
import businessIcon from "../../../../assets/icons/business.png";

const AddLocation = ({ handleClose }) => {
  const { profile, addAddressToProfile } = useAuthProfile();
  const { addLocationToCollection } = useLocations();
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const [formData, setFormData] = useState({
    locationType: "",
    homeName: "Home",
    street: "",
    streetType: "Street",
    city: "",
    state: "California",
    businessName: "Business 1",
    businessLogo: "",
    businessWebsite: "",
    businessPhoneNumber: "",
  });

  const handleInputChange = (changedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
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
          return formData.businessName && formData.businessLogo;
        } else {
          return formData.homeName;
        }
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prevStep) => prevStep + 1);
    } else {
      toast.error("Please fill in all required fields before proceeding.");
    }
  };

  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const handleGeocodeAddress = async (address) => {
    const fullAddress = `${address.street}, ${address.city}, California`;
    const apiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(
      fullAddress
    )}&api_key=660502575887c637237148utr0d3092`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lng: lon };
      } else {
        toast.error("No results found. Please try a different address.");
        return null;
      }
    } catch (err) {
      toast.error("An error occurred while geocoding. Please try again.");
      console.error(err);
      return null;
    }
  };

  const handleAddLocation = async (address) => {
    if (profile) {
      await addAddressToProfile(profile.uid, address);
      await addLocationToCollection(profile.uid, address);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true); // Start loading

    try {
      const address = {
        locationType: formData.locationType,
        homeName: formData.locationType === "Home" ? formData.homeName : "",
        street: `${formData.street} ${formData.streetType}`,
        city: formData.city,
        state: formData.state,
        businessName:
          formData.locationType === "Business" ? formData.businessName : "",
        businessLogo:
          formData.locationType === "Business" ? formData.businessLogo : "",
        businessWebsite:
          formData.locationType === "Business" ? formData.businessWebsite : "",
        businessPhoneNumber:
          formData.locationType === "Business"
            ? formData.businessPhoneNumber
            : "",
      };

      const geocodedLocation = await handleGeocodeAddress(address);
      if (!geocodedLocation) {
        setLoading(false); // Stop loading
        return;
      }

      address.latitude = geocodedLocation.lat;
      address.longitude = geocodedLocation.lng;

      await handleAddLocation(address);

      toast.success("Location added successfully!");
      handleClose();
    } catch (error) {
      toast.error("Error adding location: " + error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleLogoUpload = ({ file }) => {
    setUploading(true);
    const storageRef = ref(storage, `logos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        toast.error("Error uploading logo: " + error.message);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prevData) => ({
          ...prevData,
          businessLogo: downloadURL,
        }));
        toast.success("Logo uploaded successfully!");
        setUploading(false);
      }
    );
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <Form.Item className="w-full text-center m-0" required>
              <Radio.Group
                className="flex items-center justify-center gap-4 w-full"
                value={formData.locationType}
                onChange={(e) =>
                  handleInputChange({ locationType: e.target.value })
                }
              >
                <Radio.Button
                  className="h-20 aspect-square p-4 flex flex-col"
                  value="Home"
                >
                  <img
                    className="h-full w-full object-fit"
                    src={homeIcon}
                    alt="Home"
                  />
                </Radio.Button>
                <Radio.Button
                  className="h-20 aspect-square p-4 flex flex-col"
                  value="Business"
                >
                  <img
                    className="h-full w-full object-fit"
                    src={businessIcon}
                    alt="Business"
                  />
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </>
        );
      case 1:
        return (
          <div className="flex flex-wrap">
            <div className="flex gap-2 items-end justify-end">
              <Form.Item label="Street" name="street">
                <Input
                  value={formData.street}
                  onChange={(e) =>
                    handleInputChange({ street: e.target.value })
                  }
                  placeholder="Enter street address"
                />
              </Form.Item>
              <Form.Item label="Street Type" name="streetType">
                <Select
                  value={formData.streetType}
                  onChange={(value) => handleInputChange({ streetType: value })}
                >
                  <Select.Option value="Street">Street</Select.Option>
                  <Select.Option value="Boulevard">Boulevard</Select.Option>
                  <Select.Option value="Avenue">Avenue</Select.Option>
                  <Select.Option value="Drive">Drive</Select.Option>
                  <Select.Option value="Lane">Lane</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="flex flex-row w-full gap-2">
              <Form.Item className="w-full" label="City" name="city">
                <Select
                  value={formData.city}
                  onChange={(value) => handleInputChange({ city: value })}
                  placeholder="Enter City"
                >
                  <Select.Option value="San Francisco">San Francisco</Select.Option>
                  <Select.Option value="Oakland">Oakland</Select.Option>
                  <Select.Option value="Daly City">Daly City</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
        );
      case 2:
        return (
          <>
            {formData.locationType === "Home" ? (
              <Form.Item label="Home Name" name="homeName">
                <Input
                  value={formData.homeName}
                  onChange={(e) =>
                    handleInputChange({
                      homeName: e.target.value || "Home",
                    })
                  }
                  placeholder="Enter home name"
                />
              </Form.Item>
            ) : (
              <>
                <Form.Item label="Business Name" name="businessName">
                  <Input
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange({ businessName: e.target.value })
                    }
                    placeholder="Enter business name"
                  />
                </Form.Item>
                <Form.Item label="Business Logo" name="businessLogo">
                  <Upload
                    name="logo"
                    listType="picture"
                    customRequest={handleLogoUpload}
                    showUploadList={false}
                  >
                    <Button loading={uploading}>Upload Logo</Button>
                  </Upload>
                  {formData.businessLogo && (
                    <img
                      src={formData.businessLogo}
                      alt="Business Logo"
                      style={{ width: "100px", marginTop: "10px" }}
                    />
                  )}
                </Form.Item>
              </>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-4 items-center justify-center flex flex-col gap-10 overflow-auto z-40">
      <header className="w-full flex flex-row items-center justify-center gap-2 p-2 h-[10%] text-light-gray">
        <div className="flex justify-center w-full">
          {[
            "Location Type",
            `${formData.locationType} Address`,
            "Location Details",
          ].map((title, index) => (
            <div
              key={title}
              className={`flex-1 p-2 text-center border-b-2 ${
                step === index
                  ? "border-grean text-grean"
                  : index < step
                  ? "border-grean text-grean"
                  : "border-white text-light-gray"
              }`}
            >
              {title}
            </div>
          ))}
        </div>
      </header>

      <motion.main
        key={step}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
        className="h-[70%] overflow-auto w-full"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={formData}
          onValuesChange={handleInputChange}
          className="w-full h-full"
        >
          <section className="h-full w-full flex items-center justify-center mx-auto max-w-xl flex-col">
            {renderStep()}
          </section>
        </Form>
      </motion.main>

      <nav className="flex justify-center gap-4 mt-4 bg-white w-full items-start h-[20%]">
        {step > 0 && (
          <Button
            className="bg-red-500 text-white"
            type="primary"
            size="large"
            onClick={prevStep}
          >
            Back
          </Button>
        )}

        {step === 0 && (
          <div className="flex gap-2">
            <Button
              className="bg-red-500 text-white"
              type="primary"
              size="large"
              onClick={handleClose}
            >
              Close
            </Button>

            <Button
              className="bg-grean text-white"
              type="primary"
              size="large"
              onClick={nextStep}
            >
              Next
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="flex gap-2">
            <Button
              className="bg-grean text-white"
              type="primary"
              size="large"
              onClick={nextStep}
            >
              Next
            </Button>
          </div>
        )}

        {step === 2 && (
          <Button
            className="bg-grean text-white"
            type="primary"
            size="large"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
      </nav>

      {loading && <Loader fullscreen />} {/* Show loader when loading */}
    </div>
  );
};

export default AddLocation;
