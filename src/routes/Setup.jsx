import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { useLocations } from '../context/LocationsContext';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, Steps } from "antd";
import { motion, AnimatePresence } from "framer-motion";

function Setup() {
  const { Step } = Steps;
  const navigate = useNavigate();
  const { createUser } = UserAuth();
  const { createProfile } = useProfile();
  const { addLocation, addParentLocation } = useLocations();
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
    addresses: [{ street: "", city: "", state: "California", lat: null, lng: null }]
  });

  const handleChange = (changedValues) => {
    setFormData((prevState) => ({
      ...prevState,
      ...changedValues,
      addresses: prevState.addresses.map((address, index) => ({
        ...address,
        ...changedValues.addresses?.[index]
      })),
    }));
    setError(null);
    console.log(error);
  };

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
        setError("No results found. Please try a different address.");
        return null;
      }
    } catch (err) {
      setError("An error occurred while geocoding. Please try again.");
      console.error(err);
      return null;
    }
  };

  const navigateHome = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    try {
      // Create the user with Firebase Authentication
      const userCredential = await createUser(
        formData.usersEmail,
        formData.password
      );
      const user = userCredential.user;

      // Use the user.uid to store the profile data in Firestore
      await createProfile(user.uid, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        userRole: formData.userRole,
        usersEmail: formData.usersEmail
      });

      // Geocode and add locations
      const geocodedAddresses = await Promise.all(
        formData.addresses.map((address) => handleGeocodeAddress(address))
      );

      const validAddresses = formData.addresses.map((address, index) => ({
        ...address,
        ...geocodedAddresses[index]
      })).filter(address => address.lat && address.lng);

      // Adding multiple locations to sub-collection and optionally to parent collection
      await Promise.all(
        validAddresses.map(async (address) => {
          await addLocation(user.uid, address);
          if (formData.userRole === "Business") {
            await addParentLocation(user.uid, address);
          }
        })
      );

      toast.success("Profile and locations saved successfully!");
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
    <AnimatePresence mode="wait">
      <section className="w-full h-[92vh] items-center justify-center flex flex-col gap-2 max-w-lg mx-auto bg-grean">
        <header className="w-full h-[10%] flex flex-row overflow-x whitespace-nowrap gap-2 bg-white">
          <Steps
            className="flex items-center jusitfy-center flex-row flex-wrap"
            current={step}
            direction="horizontal"
          >
            <Step title="Basic Info" />
            <Step title="Role" />
            <Step title="Role Info" />
            <Step title="Account" />
          </Steps>
        </header>

        <motion.main
          key={step}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="p-2 h-[80%] w-full"
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={formData}
            onValuesChange={handleChange}
            className="w-full h-full"
          >
            <section className="h-full w-full flex items-center justify-center">
              {step === 0 && (
                <section className="bg-white p-2 rounded-md container">
                  <h2 className="text-xl mb-4">Basic Info</h2>
                  <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your first name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your last name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please input your phone number!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </section>
              )}

              {step === 1 && (
                <section className="bg-white p-2 rounded-md container">
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
                    rules={[
                      { required: true, message: "Please select your role!" },
                    ]}
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
                <section className="bg-white shadow-lg max-h-full overflow-auto p-2 rounded-md container">
                  {formData.userRole === "Business" && (
                    <div className="overflow-auto">
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
                            message:
                              "Please input your business street address!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="City"
                        name="city"
                        rules={[
                          {
                            required: true,
                            message: "Please input your city!",
                          },
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
                      <Form.List name="addresses">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                              <div key={key} className="address-field">
                                <Form.Item
                                  {...restField}
                                  label="Street"
                                  name={[name, "street"]}
                                  fieldKey={[fieldKey, "street"]}
                                  rules={[{ required: true, message: "Please input your street address!" }]}
                                >
                                  <Input />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  label="City"
                                  name={[name, "city"]}
                                  fieldKey={[fieldKey, "city"]}
                                  rules={[{ required: true, message: "Please input your city!" }]}
                                >
                                  <Input />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  label="State"
                                  name={[name, "state"]}
                                  fieldKey={[fieldKey, "state"]}
                                  rules={[{ required: true, message: "Please input your state!" }]}
                                >
                                  <Input />
                                </Form.Item>
                                <Button type="danger" onClick={() => remove(name)}>
                                  Remove Address
                                </Button>
                              </div>
                            ))}
                            <Button type="dashed" onClick={() => add()}>
                              Add Address
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </>
                  )}
                </section>
              )}

              {step === 3 && (
                <section className="bg-white p-2 rounded-md container">
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
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </section>
              )}
            </section>
          </Form>
        </motion.main>

        <nav className="flex justify-center gap-4 mt-4 h-[10%]">
          {step > 0 && (
            <Button
              className="bg-white text-black"
              type="primary"
              size="large"
              onClick={prevStep}
            >
              Previous
            </Button>
          )}
          {step === 3 && (
            <Button
              className="bg-white text-black"
              type="primary"
              size="large"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          )}

          {step < 1 && (
            <Button
              className="bg-red-500 text-white"
              type="primary"
              size="large"
              onClick={navigateHome}
            >
              Back
            </Button>
          )}

          {step < 3 && (
            <Button
              className="bg-white text-black"
              type="primary"
              size="large"
              onClick={nextStep}
            >
              Next
            </Button>
          )}
        </nav>
      </section>
    </AnimatePresence>
  );
}

export default Setup;
