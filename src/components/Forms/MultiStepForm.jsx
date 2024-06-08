import React, { useState, useEffect } from "react";
import { UserAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { useLocations } from "../../context/LocationContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, Steps } from 'antd';

const { Step } = Steps;

const MultiStepForm = () => {
  const navigate = useNavigate();
  const { createUser } = UserAuth();
  const { profile, updateProfile } = useProfile();
  const { updateLocation } = useLocations();
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    driverName: "",
    usersEmail: "",
    userRole: "",
    businessName: "",
    businessAddress: "",
    street: "",
    city: "",
    state: "California",
    businessWebsite: "",
    businessDescription: "",
    businessEmail: "",
  });

  useEffect(() => {
    setFormData(profile || {});
    form.setFieldsValue(profile || {});
  }, [profile, form]);

  const handleChange = (changedValues) => {
    setFormData((prevState) => ({
      ...prevState,
      ...changedValues,
    }));
    setError(null);
  };

  const handleGeocodeAddress = async () => {
    const fullAddress = `${formData.street}, ${formData.city}, California`;
    const apiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(fullAddress)}&api_key=660502575887c637237148utr0d3092`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates({ lat, lng: lon });
        setError("");
        return { lat, lng: lon };
      } else {
        setError("No results found. Please try a different address.");
        return null;
      }
    } catch (err) {
      setError("An error occurred while geocoding. Please try again.");
      console.error(err);
      return null;
    }
  };

  const handleSubmit = async () => {
    let coords = { lat: null, lng: null };
    const fullAddress = `${formData.street}, ${formData.city}, California`;

    if (formData.userRole === "Business") {
      const geocodedCoords = await handleGeocodeAddress();
      if (!geocodedCoords) {
        toast.error("Could not geocode address. Please check the address details.");
        return;
      }
      coords = geocodedCoords;
    }

    const updatedFormData = {
      ...formData,
      fullAddress,
      ...(coords.lat && coords.lng ? { lat: coords.lat, lng: coords.lng } : {}),
    };

    try {
      await createUser(formData.usersEmail, formData.password); // Assuming you have a password field in your form
      await updateProfile(updatedFormData);
      if (formData.userRole === "Business" && coords.lat && coords.lng) {
        await updateLocation({ ...updatedFormData, ...coords });
      }
      toast.success("Profile saved successfully!");
      navigate("/account");
    } catch (error) {
      toast.error("Error saving profile: " + error.message);
      console.error("Error saving profile: ", error);
    }
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        return formData.firstName && formData.lastName && formData.usersEmail;
      case 1:
        return formData.userRole;
      case 2:
        return formData.street && formData.city;
      case 3:
        // Assuming payment type is selected here
        return true;
      case 4:
        if (formData.userRole === "Business") {
          return (
            formData.businessName &&
            formData.businessEmail &&
            formData.businessWebsite &&
            formData.businessDescription
          );
        }
        if (formData.userRole === "Driver") {
          return formData.driverName;
        }
        if (formData.userRole === "Home") {
          return formData.street && formData.city && formData.businessEmail;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prevStep) => Math.min(prevStep + 1, 4));
    } else {
      toast.error("Please fill in all required fields before proceeding.");
    }
  };

  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0));

  return (
    <main className="w-full flex flex-col gap-4 max-w-lg mx-auto p-4 bg-white rounded-lg">
      <header className="relative flex flex-col gap-2">
        <Steps current={step}>
          <Step title="Basic Info" />
          <Step title="Role" />
          <Step title="Address" />
          <Step title="Payment" />
          <Step title="Sign Up" />
        </Steps>
      </header>

      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onValuesChange={handleChange}
      >
        {step === 0 && (
          <section className="min-h-[80%]">
            <h2 className="text-xl mb-4">Basic Info</h2>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please input your first name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Please input your last name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="usersEmail"
              rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
            >
              <Input />
            </Form.Item>
          </section>
        )}

        {step === 1 && (
          <section className="min-h-[80%]">
            <h2 className="text-xl mb-2 font-bold">Role</h2>
            <p className="text-sm">Select the role you plan to have with Grean.</p>
            <p className="text-xs pb-4">(This can be changed later in your settings)</p>
            <Form.Item
              label="Role"
              name="userRole"
              rules={[{ required: true, message: 'Please select your role!' }]}
            >
              <Select>
                <Select.Option value="Driver">Driver</Select.Option>
                <Select.Option value="Business">Business</Select.Option>
                <Select.Option value="Home">Home</Select.Option>
              </Select>
            </Form.Item>
          </section>
        )}

        {step === 2 && (
          <section className="min-h-[80%]">
            <h2 className="text-xl mb-4">Address</h2>
            <Form.Item
              label="Street"
              name="street"
              rules={[{ required: true, message: 'Please input your street!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: 'Please input your city!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="State"
              name="state"
            >
              <Input readOnly />
            </Form.Item>
          </section>
        )}

        {step === 3 && (
          <section className="min-h-[80%]">
            <h2 className="text-xl mb-4">Payment Type</h2>
            <Form.Item
              label="Payment Type"
              name="paymentType"
              rules={[{ required: true, message: 'Please select your payment type!' }]}
            >
              <Select>
                <Select.Option value="Paypal">Paypal</Select.Option>
                <Select.Option value="Zelle">Zelle</Select.Option>
                <Select.Option value="Venmo">Venmo</Select.Option>
              </Select>
            </Form.Item>
          </section>
        )}

        {step === 4 && (
          <section className="min-h-[600px]">
            {formData.userRole === "Business" && (
              <>
                <h2 className="text-xl mb-4">Business Info</h2>
                <Form.Item
                  label="Business Name"
                  name="businessName"
                  rules={[{ required: true, message: 'Please input your business name!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Business Email"
                  name="businessEmail"
                  rules={[{ required: true, message: 'Please input your business email!', type: 'email' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Business Website"
                  name="businessWebsite"
                  rules={[{ required: true, message: 'Please input your business website!', type: 'url' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Business Description"
                  name="businessDescription"
                  rules={[{ required: true, message: 'Please input your business description!' }]}
                >
                  <Input.TextArea />
                </Form.Item>
              </>
            )}
            {formData.userRole === "Driver" && (
              <>
                <h2 className="text-xl mb-4">Driver Info</h2>
                <Form.Item
                  label="Driver's Name"
                  name="driverName"
                  rules={[{ required: true, message: 'Please input your driver name!' }]}
                >
                  <Input />
                </Form.Item>
              </>
            )}
            {formData.userRole === "Home" && (
              <>
                <h2 className="text-xl mb-4">Home Info</h2>
                <Form.Item
                  label="Street"
                  name="street"
                  rules={[{ required: true, message: 'Please input your street!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="City"
                  name="city"
                  rules={[{ required: true, message: 'Please input your city!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="businessEmail"
                  rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
                >
                  <Input />
                </Form.Item>
              </>
            )}
            <Form.Item>
              <Button type="primary" size="large" onClick={handleSubmit}>
                Submit
              </Button>
            </Form.Item>
          </section>
        )}

        <div className="flex justify-center gap-4 mt-4">
          {step > 0 && step <= 4 && (
            <Button type="primary" size="large" onClick={prevStep}>
              Previous
            </Button>
          )}
          {step < 4 && (
            <Button type="primary" size="large" onClick={nextStep}>
              Next
            </Button>
          )}
        </div>
      </Form>
    </main>
  );
};

export default MultiStepForm;