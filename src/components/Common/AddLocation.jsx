import { useState } from "react";
import { useAuthProfile } from "../../context/AuthProfileContext";
import { useLocations } from "../../context/LocationsContext";
import { toast } from "react-toastify";
import { Form, Steps, Button, Input, Radio, Select } from "antd";
import { motion } from "framer-motion";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const AddLocation = ({ onSave }) => {
  const { Step } = Steps;
  const { user, updateProfile } = useAuthProfile();
  const { locations } = useLocations();
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({
    accountType: "",
    locationName: "Home",
    street: "",
    streetType: "Street",
    city: "",
    state: "California",
    businessName: "",
  });

  const handleInputChange = (changedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handleAccountTypeStep = () => {
    if (!formData.accountType) {
      toast.error("Please select the type of account");
      return;
    }
    nextStep();
  };

  const handleLocationDetailsStep = async () => {
    if (!formData.street || !formData.city || !formData.state) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const newAddress = {
        type: formData.accountType,
        name: formData.locationName,
        street: `${formData.street} ${formData.streetType}`,
        city: formData.city,
        state: formData.state,
      };

      if (formData.accountType === "Business") {
        newAddress.businessName = formData.businessName;
      }

      const updatedAddresses = [...(locations.addresses || []), newAddress];

      // Update the user's profile with the new location
      await updateProfile(user.uid, { locations: { addresses: updatedAddresses } });

      // Create a new location document in the locations collection
      await setDoc(doc(db, "locations", user.uid), { addresses: updatedAddresses });

      toast.success("Location added successfully!");
      onSave(newAddress); // Call the onSave function to update the parent state and close the modal
    } catch (error) {
      toast.error("Error adding location: " + error.message);
    }
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        return formData.accountType;
      case 1:
        return formData.street && formData.city && formData.state;
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

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Form.Item label="Account Type" name="accountType">
            <Radio.Group
              value={formData.accountType}
              onChange={(e) => handleInputChange({ accountType: e.target.value })}
            >
              <Radio.Button value="Home">Home</Radio.Button>
              <Radio.Button value="Business">Business</Radio.Button>
            </Radio.Group>
          </Form.Item>
        );
      case 1:
        return (
          <div className="flex flex-col">
            {formData.accountType === "Home" ? (
              <>
                <Form.Item label="Home Name" name="locationName">
                  <Input
                    value={formData.locationName}
                    onChange={(e) => handleInputChange({ locationName: e.target.value || "Home" })}
                    placeholder="Enter home name"
                  />
                </Form.Item>
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
            ) : (
              <>
                <Form.Item label="Business Name" name="businessName">
                  <Input
                    value={formData.businessName}
                    onChange={(e) => handleInputChange({ businessName: e.target.value })}
                    placeholder="Enter business name"
                  />
                </Form.Item>
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
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-4 items-center justify-center flex flex-col gap-2 bg-white absolute overflow-auto z-40">
      <header className="w-full flex flex-row items-center justify-center gap-2 bg-white p-2 h-[10%] text-green">
        <Steps current={step}>
          <Step title="Account Type" />
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
          <section className="h-full w-full flex items-center justify-center mx-auto max-w-xl">
            {renderStep()}
          </section>
        </Form>
      </motion.main>

      <nav className="flex justify-center gap-4 mt-4 bg-white w-full items-start h-[20%]">
        {step > 0 && (
          <Button className="bg-red-500 text-white" type="primary" size="large" onClick={prevStep}>
            Back
          </Button>
        )}

        {step === 0 && (
          <Button className="bg-green text-white" type="primary" size="large" onClick={handleAccountTypeStep}>
            Next
          </Button>
        )}

        {step === 1 && (
          <Button className="bg-green text-white" type="primary" size="large" onClick={handleLocationDetailsStep}>
            Submit
          </Button>
        )}
      </nav>
    </div>
  );
};

export default AddLocation;
