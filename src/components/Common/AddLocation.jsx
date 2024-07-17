import { useState } from "react";
import { useAuthProfile } from "../../context/AuthProfileContext";
import { useLocations } from "../../context/LocationsContext";
import { toast } from "react-toastify";
import { Form, Steps, Button, Input, Radio, Select, Upload } from "antd";
import { motion } from "framer-motion";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import homeIcon from "../../assets/icons/home.png";
import businessIcon from "../../assets/icons/business.png";

const AddLocation = ({ handleClose }) => {
  const { Step } = Steps;
  const { profile } = useAuthProfile();
  const { updateLocation } = useLocations();
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    locationType: "",
    homeName: "Home",
    street: "",
    streetType: "Street",
    city: "",
    state: "California",
    businessName: "",
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

  const handleSubmit = async () => {
    if (!validateStep()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const newAddress = {
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

      // Define the collection name based on your needs (e.g., 'profiles' or 'locations')
      await updateLocation(profile.uid, newAddress, "profiles");
      await updateLocation(profile.uid, newAddress, "locations");
      handleClose();
      toast.success("Location added successfully!");
    } catch (error) {
      toast.error("Error adding location: " + error.message);
    }
  };

  const handleLogoUpload = (file) => {
    setUploading(true);
    const storageRef = ref(storage, `logos/${file.uid}`);
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
          <Form.Item className="w-full text-center" required>
            <Radio.Group
              className="flex items-center justify-center gap-4 w-full"
              value={formData.locationType}
              onChange={(e) =>
                handleInputChange({ locationType: e.target.value })
              }
            >
              <Radio.Button
                className="basis-1/4 h-auto p-4 flex flex-col"
                value="Home"
              >
                <img src={homeIcon} alt="Home" />
                <div className="text-sm text-dark-green">Home</div>
              </Radio.Button>
              <Radio.Button
                className="basis-1/4 h-auto p-4 flex flex-col"
                value="Business"
              >
                <img src={businessIcon} alt="Business" />
                <div className="text-sm text-dark-green">Business</div>
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        );
      case 1:
        return (
          <>
            <Form.Item label="Street" name="street">
              <Input
                value={formData.street}
                onChange={(e) => handleInputChange({ street: e.target.value })}
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
            <Form.Item label="City" name="city">
              <Input
                value={formData.city}
                onChange={(e) => handleInputChange({ city: e.target.value })}
                placeholder="Enter city"
              />
            </Form.Item>
            <Form.Item label="State" name="state">
              <Input
                value={formData.state}
                onChange={(e) => handleInputChange({ state: e.target.value })}
                placeholder="Enter state"
              />
            </Form.Item>
          </>
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
                  <>
                    <Upload
                      name="logo"
                      listType="picture"
                      customRequest={({ file }) => handleLogoUpload(file)}
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
                  </>
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
    <div className="w-full p-4 items-center justify-center flex flex-col gap-2 overflow-auto z-40">
      <header className="w-full flex flex-row items-center justify-center gap-2 p-2 h-[10%] text-green">
        <Steps current={step}>
          <Step title="Location Type" />
          <Step title="Address" />
          <Step title="Location Details" />
        </Steps>
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
              className="bg-green text-white"
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
              className="bg-green text-white"
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
            className="bg-green text-white"
            type="primary"
            size="large"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
      </nav>
    </div>
  );
};

export default AddLocation;
