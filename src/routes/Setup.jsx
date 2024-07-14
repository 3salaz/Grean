import React, { useState } from "react";
import { useAuthProfile } from "../context/AuthProfileContext";
import { useLocations } from "../context/LocationsContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Form, Steps, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Step1SignUp from "../components/Layout/Steps/Step1SignUp";
import Step2AccountType from "../components/Layout/Steps/Step2AccountType";

function Setup() {
  const { Step } = Steps;
  const navigate = useNavigate();
  const { user, createProfile, createUser, updateProfile } = useAuthProfile();
  const { createLocation } = useLocations();
  const [step, setStep] = useState(user ? 1 : 0);
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
          locations: {addresses: []}
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
      await updateProfile(user.uid, profileData);
      nextStep();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
    }
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        return formData.usersEmail && formData.password;
      case 1:
        return formData.accountType;
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
        return <Step1SignUp formData={formData} handleInputChange={handleInputChange} />;
      case 1:
        return <Step2AccountType formData={formData} handleInputChange={handleInputChange} />;
      // Add more cases for other steps as needed
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <section className="w-full h-full items-center justify-center flex flex-col gap-2 bg-white absolute overflow-auto z-40">
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
              {renderStep()}
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
            <Button className="bg-red-500 text-white" type="primary" size="large" onClick={navigate("/")}>
              Back
            </Button>
          )}

          {step === 0 && (
            <div className="flex gap-4">
              <Button className="bg-red-500 text-white" type="primary" size="large" onClick={navigate("/")}>
                Back
              </Button>
              <Button className="text-white bg-green" type="primary" size="large" onClick={handleSignupStep}>
                Sign Up
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="flex gap-4">
              <Button className="bg-red-500 text-white" type="primary" size="large">
                Back
              </Button>
              <Button className="bg-green text-white" type="primary" size="large" onClick={handleAccountTypeStep}>
                Next
              </Button>
            </div>
          )}
        </nav>
      </section>
    </AnimatePresence>
  );
}

export default Setup;
