import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { useLocations } from "../context/LocationContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, Steps } from "antd";

function Setup() {
  const { Step } = Steps;
  const navigate = useNavigate();
  const { createUser } = UserAuth();
  const { updateProfile } = useProfile();
  const { updateLocation } = useLocations();
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    usersEmail: "",
    password: "",
    userRole: "",
    businessName: "",
    businessEmail: "",
    businessPhoneNumber: "",
    businessAddress: "",
    street: "",
    city: "",
    state: "California",
    businessWebsite: "",
    businessDescription: "",
    driverPaymentType: "",
    driverPaymentInput: "",
    driver1099Form: "",
    homeName: "",
    lat: null,
    lng: null,
  });

  const handleChange = (changedValues) => {
    setFormData((prevState) => ({
      ...prevState,
      ...changedValues,
    }));
    setError(null);
    console.log(error)
  };

  const handleGeocodeAddress = async () => {
    const fullAddress = `${formData.street}, ${formData.city}, California`;
    const apiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(
      fullAddress
    )}&api_key=660502575887c637237148utr0d3092`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates({ lat, lng: lon });
        console.log(coordinates)
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

    if (formData.userRole === "Business" || formData.userRole === "Home") {
      const geocodedCoords = await handleGeocodeAddress();
      if (!geocodedCoords) {
        toast.error(
          "Could not geocode address. Please check the address details."
        );
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
      // Create the user with Firebase Authentication
      const userCredential = await createUser(
        formData.usersEmail,
        formData.password
      );
      const user = userCredential.user;

      // Use the user.uid to store the profile data in Firestore
      await updateProfile(user.uid, updatedFormData);

      // Update the location if applicable
      if (
        (formData.userRole === "Business" || formData.userRole === "Home") &&
        coords.lat &&
        coords.lng
      ) {
        await updateLocation(user.uid, { ...updatedFormData, ...coords });
      }

      toast.success("Profile saved successfully!");
      navigate("/account");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Error: Email already in use.");
      } else {
        toast.error("Error saving profile: " + error.message);
      }
      console.error("Error saving profile: ", error);
    }
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        return formData.firstName && formData.lastName && formData.phoneNumber;
      case 1:
        return formData.userRole;
      case 2:
        if (formData.userRole === "Business") {
          return (
            formData.businessName &&
            formData.businessEmail &&
            formData.businessPhoneNumber &&
            formData.street &&
            formData.city &&
            formData.businessWebsite &&
            formData.businessDescription
          );
        }
        if (formData.userRole === "Driver") {
          return (
            formData.driverPaymentType &&
            formData.driverPaymentInput &&
            formData.driver1099Form
          );
        }
        if (formData.userRole === "Home") {
          return formData.street && formData.city;
        }
        return true;
      case 3:
        return formData.usersEmail && formData.password;
      default:
        return true;
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

  return (
    <section className="w-full h-full items-center justify-center flex flex-col gap-4 max-w-lg mx-auto p-2 bg-white rounded-lg">
      <header className="w-full flex flex-row gap-2 overflow-y">
        <Steps className="flex flex-row flex-wrap" current={step}>
          <Step title="Basic Info" />
          <Step title="Role" />
          <Step title="Role Info" />
          <Step title="Account" />
        </Steps>
      </header>

      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onValuesChange={handleChange}
        className="w-full h-full"
      >
        {step === 0 && (
          <section>
            <h2 className="text-xl mb-4">Basic Info</h2>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input />
            </Form.Item>
          </section>
        )}

        {step === 1 && (
          <section>
            <h2 className="text-xl mb-2 font-bold">Role</h2>
            <p className="text-sm">
              Select the role you plan to have with Grean.
            </p>
            <p className="text-xs pb-4">
              (This can be changed later in your settings)
            </p>
            <Form.Item
              label="Role"
              name="userRole"
              rules={[{ required: true, message: "Please select your role!" }]}
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
          <section>
            {formData.userRole === "Business" && (
              <div className="overflow-auto max-h-80">
                <h2 className="text-xl mb-4">Business Info</h2>
                <Form.Item
                  label="Business Name"
                  name="businessName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your business name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Business Email"
                  name="businessEmail"
                  rules={[
                    {
                      required: true,
                      message: "Please input your business email!",
                      type: "email",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Business Phone Number"
                  name="businessPhoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please input your business phone number!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Business Website"
                  name="businessWebsite"
                  rules={[
                    {
                      required: true,
                      message: "Please input your business website!",
                      type: "url",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Business Description"
                  name="businessDescription"
                  rules={[
                    {
                      required: true,
                      message: "Please input your business description!",
                    },
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  label="Business Address (Street)"
                  name="street"
                  rules={[
                    {
                      required: true,
                      message: "Please input your business street address!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="City"
                  name="city"
                  rules={[
                    { required: true, message: "Please input your city!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            )}
            {formData.userRole === "Driver" && (
              <>
                <h2 className="text-xl mb-4">Driver Info</h2>
                <Form.Item
                  label="Payment Type"
                  name="driverPaymentType"
                  rules={[
                    {
                      required: true,
                      message: "Please select your payment type!",
                    },
                  ]}
                >
                  <Select>
                    <Select.Option value="Paypal">Paypal</Select.Option>
                    <Select.Option value="Zelle">Zelle</Select.Option>
                    <Select.Option value="Venmo">Venmo</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Payment Input"
                  name="driverPaymentInput"
                  rules={[
                    {
                      required: true,
                      message: "Please input your payment details!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="1099 Form"
                  name="driver1099Form"
                  rules={[
                    {
                      required: true,
                      message: "Please provide your 1099 form details!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </>
            )}
            {formData.userRole === "Home" && (
              <>
                <h2 className="text-xl mb-4">Home Info</h2>
                <Form.Item
                  label="Home Name"
                  name="homeName"
                  rules={[
                    {
                      required: true,
                      message: "Please provide a name for your home",
                    },
                  ]}
                >
                  <Input
                    placeholder="ex. My Home, Grandmas, The Crib"
                    value={formData.homeName || `${formData.lastName} House`}
                  />
                </Form.Item>
                <Form.Item
                  label="Street"
                  name="street"
                  rules={[
                    {
                      required: true,
                      message: "Please input your street address!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="City"
                  name="city"
                  rules={[
                    { required: true, message: "Please input your city!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </>
            )}
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="text-xl mb-4">Account Info</h2>
            <Form.Item
              label="Email"
              name="usersEmail"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                  type: "email",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </section>
        )}

        <div className="flex justify-center gap-4 mt-4">
          {step > 0 && (
            <Button
              className="bg-grean"
              type="primary"
              size="large"
              onClick={prevStep}
            >
              Previous
            </Button>
          )}
          {step === 3 && (
            <Button
              className="bg-grean"
              type="primary"
              size="large"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          )}

          {step < 3 && (
            <Button
              className="bg-grean"
              type="primary"
              size="large"
              onClick={nextStep}
            >
              Next
            </Button>
          )}
        </div>
      </Form>
    </section>
  );
}

export default Setup;
