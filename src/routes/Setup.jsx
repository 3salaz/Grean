import React, { useState } from "react";
import { useAuthProfile } from "../context/AuthProfileContext";
import { useLocations } from "../context/LocationsContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, Steps, Radio } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import userIcon from "../assets/icons/user.png";
import driverIcon from "../assets/icons/driver.png";
import homeIcon from "../assets/icons/home.png";
import businessIcon from "../assets/icons/business.png";
import f1099msc from "../assets/forms/f1099msc.pdf";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Setup() {
  const { Step } = Steps;
  const navigate = useNavigate();
  const { user, createProfile, createUser, updateProfile } = useAuthProfile();
  const { addLocation, createLocation } = useLocations();
  const [step, setStep] = useState(user ? 1 : 0);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    usersEmail: user ? user.email : "",
    password: "",
    accountType: "",
    businessName: "",
    businessEmail: "",
    businessPhoneNumber: "",
    businessWebsite: "",
    businessDescription: "",
    driverPaymentType: "",
    driverPaymentInput: "",
    driver1099Form: "",
    locationName: "",
    locationType: "",
    street: "",
    city: "",
    state: "California",
    lat: null,
    lng: null,
    uid: "",
  });

  const handleInputChange = (changedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));
  };

  const handleGeocodeAddress = async (address) => {
    const fullAddress = `${address.street}, ${address.city}, ${address.state}`;
    const apiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(fullAddress)}`;
  
    try {
      console.log("Fetching geocode data for:", fullAddress);
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (data && data.length > 0) {
        const { lat, lon: lng } = data[0];
        console.log("Geocoded data:", { lat, lng });
        return { lat, lng };
      } else {
        setError("No results found. Please try a different address.");
        console.error("No results found for address:", fullAddress);
        return null;
      }
    } catch (err) {
      setError("An error occurred while geocoding. Please try again.");
      console.error("Error geocoding address:", err);
      return null;
    }
  };
  

  const navigateHome = () => {
    navigate("/");
  };

  const handleSignupStep = async () => {
    if (!formData.usersEmail || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      let userId = user?.uid;

      if (!userId) {
        const newUser = await createUser(formData.usersEmail, formData.password);
        userId = newUser.uid;
        await createProfile(userId, {
          displayName: newUser.displayName,
          profilePic: newUser.photoURL,
          email: newUser.email,
          uid: newUser.uid,
        });

        await createLocation(userId);
        toast.success("User created successfully!");
      }

      const profileRef = doc(db, "profiles", userId);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        nextStep();
      } else {
        toast.error("Error creating user profile. Please try again.");
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Error: Email already in use.");
      } else {
        toast.error("Error creating user: " + error.message);
      }
    }
  };

  const handleAccountTypeStep = async () => {
    if (!formData.accountType) {
      toast.error("Please select the type of account");
      return;
    }

    try {
      const profileData = { accountType: formData.accountType };
      console.log("Updating profile with:", profileData);
      await updateProfile(user.uid, profileData);
      nextStep();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
    }
  };

  const handleLocationTypeStep = async (accountType) => {
    if (accountType === "Driver") {
      navigate("/account");
      return;
    }
    
    const { street, city, state, locationName, locationType } = formData;

    if (!locationType || !street || !city || !locationName) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      console.log("Geocoding address:", { street, city, state });
      const geocodedAddress = await handleGeocodeAddress({ street, city, state });
      if (!geocodedAddress) {
        toast.error("Geocoding failed. Please try again.");
        return;
      }

      console.log(user.uid);

      const locationData = {
        ...geocodedAddress,
        street,
        city,
        state,
        locationName,
        locationType,
      };
      console.log("Adding location for user:", user.uid);
      await addLocation(user.uid, locationData);

      const profileData = {
        locationType: formData.locationType,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        fullAddress: `${formData.street}, ${formData.city}, ${formData.state}`,
      };
      console.log("Updating profile with:", profileData);
      await updateProfile(user.uid, profileData);

      toast.success("Location added successfully!");
      navigate("/account");
    } catch (error) {
      console.error("Error adding location:", error);
      toast.error("Error adding location. Please try again.");
    }
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        return formData.usersEmail && formData.password;
      case 1:
        return formData.accountType;
      case 2:
        if (formData.accountType === "Driver") {
          return true;
        }
        return !!formData.locationType && formData.street && formData.city && formData.locationName;
      case 3:
        return formData.firstName && formData.lastName && formData.phoneNumber;
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

  return (
    <AnimatePresence mode="wait">
      <section className="w-full h-[92svh] items-center justify-center flex flex-col gap-2 bg-white absolute overflow-auto z-40">
        <header className="w-full flex flex-row items-center justify-center gap-2 bg-white p-2 h-[10%] text-green">
          <Steps className="h-full w-full flex flex-row gap-4 drop-shadow-2xl" current={step} direction="horizontal" type="inline" status={step}>
            {!user && <Step className="flex flex-col" title="Account" />}
            <Step title="Role" />
            <Step title="Location" />
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
              {step === 0 && !user && (
                <section className="bg-white rounded-md container flex flex-col w-full gap-2 text-center p-4">
                  <h2 className="text-xl mb-4">Sign Up!</h2>
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

              {step === 1 && (
                <section className="bg-white rounded-md container flex flex-col w-full gap-2 text-center">
                  <h2 className="text-xl mb-2 font-bold">Account Type</h2>
                  <div>
                    <p className="text-sm">Select the type of account you'd like!</p>
                    <p className="text-xs pb-4">(This can be changed later in your settings)</p>
                  </div>

                  <Form.Item
                    name="accountType"
                    className="w-full flex flex-col gap-2"
                    rules={[
                      {
                        required: true,
                        message: "Please select the type of account you'd like",
                      },
                    ]}
                  >
                    <Radio.Group className="w-full flex justify-center gap-4 text-center">
                      <Radio.Button className="basis-1/4 h-auto p-4 flex flex-col" value="Driver">
                        <img src={driverIcon} alt="Driver" />
                        <div className="text-sm text-dark-green">Driver</div>
                      </Radio.Button>
                      <Radio.Button className="basis-1/4 h-auto p-4 flex flex-col" value="User">
                        <img src={userIcon} alt="User" />
                        <div className="text-sm text-dark-green">User</div>
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </section>
              )}

              {step === 2 && (
                <section className="h-full overflow-auto rounded-md w-full flex flex-col items-center justify-center">
                  {formData.accountType === "Driver" && (
                    <div id="driver" className="w-full p-4">
                      <h2 className="text-xl mb-4">Driver Info</h2>
                      <Button>
                        <a href={f1099msc} download="1099 Form">
                          Download 1099 Form
                        </a>
                      </Button>
                    </div>
                  )}
                  {formData.accountType === "User" && (
                    <div id="user" className="flex flex-col items-center justify-center h-full container px-8 text-center">
                      <h2 className="text-xl mb-2 font-bold">Location</h2>
                      <div>
                        <p className="text-sm">Select the type of location you'd like!</p>
                        <p className="text-xs pb-4">(This can be changed later in your settings)</p>
                      </div>

                      <Form.Item
                        name="locationType"
                        className="w-full flex flex-col gap-2"
                        rules={[
                          {
                            required: true,
                            message: "Please select the type of location you'd like",
                          },
                        ]}
                      >
                        <Radio.Group
                          className="w-full flex justify-center gap-4 text-center"
                          onChange={(e) => {
                            handleInputChange({ locationType: e.target.value });
                          }}
                        >
                          <Radio.Button className="basis-1/4 h-auto p-4 flex flex-col" value="Home">
                            <img className="object-fit" src={homeIcon} alt="Home" />
                            <div className="text-sm text-dark-green">Home</div>
                          </Radio.Button>
                          <Radio.Button className="basis-1/4 h-auto aspect-square p-4 flex flex-col" value="Business">
                            <img className="object-fit" src={businessIcon} alt="Business" />
                            <div className="text-sm text-dark-green">Business</div>
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>

                      <AnimatePresence>
                        {formData.locationType && (
                          <motion.div
                            key="locationForm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col w-full"
                          >
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
                              <Input className="text-center" />
                            </Form.Item>
                            <Form.Item
                              label="City"
                              name="city"
                              rules={[
                                {
                                  required: true,
                                  message: "Please select your city!",
                                },
                              ]}
                            >
                              <Select>
                                <Select.Option value="Daly City">Daly City</Select.Option>
                                <Select.Option value="San Francisco">San Francisco</Select.Option>
                                <Select.Option value="South San Francisco">South San Francisco</Select.Option>
                              </Select>
                            </Form.Item>
                            <Form.Item
                              label="Location Name"
                              name="locationName"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input a name for your location!",
                                },
                              ]}
                            >
                              <Input placeholder="ex.San Francisco | Mission Location" />
                            </Form.Item>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </section>
              )}
            </section>
          </Form>
        </motion.main>

        <nav className="flex justify-center gap-4 mt-4 bg-white w-full items-start h-[20%]">
          {step > 1 && (
            <Button className="bg-red-500 text-white" type="primary" size="large" onClick={prevStep}>
              Back
            </Button>
          )}

          {step === 1 && !user && (
            <Button className="bg-red-500 text-white" type="primary" size="large" onClick={navigateHome}>
              Back
            </Button>
          )}

          {step === 0 && (
            <div className="flex gap-4">
              <Button className="bg-red-500 text-white" type="primary" size="large" onClick={navigateHome}>
                Back
              </Button>
              <Button className="text-white bg-green" type="primary" size="large" onClick={handleSignupStep}>
                Sign Up
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="flex gap-4">
              <Button className="bg-red-500 text-white" type="primary" size="large" onClick={navigateHome}>
                Back
              </Button>
              <Button className="bg-green text-white" type="primary" size="large" onClick={handleAccountTypeStep}>
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <Button className="bg-green text-white" type="primary" size="large" onClick={() => handleLocationTypeStep(formData.accountType)}>
              Submit
            </Button>
          )}
        </nav>
      </section>
    </AnimatePresence>
  );
}

export default Setup;
