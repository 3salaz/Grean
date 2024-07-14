//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     phoneNumber: "",
//     usersEmail: user ? user.email : "",
//     password: "",
//     accountType: "",
//     businessName: "",
//     businessEmail: "",
//     businessPhoneNumber: "",
//     businessWebsite: "",
//     businessDescription: "",
//     driverPaymentType: "",
//     driverPaymentInput: "",
//     driver1099Form: "",
//     locationName: "",
//     locationType: "",
//     street: "",
//     city: "",
//     state: "California",
//     lat: null,
//     lng: null,
//     uid: "",
//   });
import React, { useState, useEffect } from "react";
import { useAuthProfile } from "../../context/AuthProfileContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Form, Steps, Button, Radio } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import Step1SignUp from "../../components/Layout/Steps/Step1SignUp";
import Step2AccountType from "../../components/Layout/Steps/Step2AccountType";

function Signup({ handleCloseModal }) {
  const { Step } = Steps;
  const navigate = useNavigate();
  const { user, createUser, updateProfile } = useAuthProfile();
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    usersEmail: "",
    password: "",
    accountType: "",
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
      const profileData = {
        displayName: `${formData.firstName} ${formData.lastName}`,
        email: formData.usersEmail,
        accountType: formData.accountType,
        locations: { addresses: [] }
      };

      const newUser = await createUser(formData.usersEmail, formData.password, profileData);

      toast.success("User created successfully!");
      setStep(1);
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
      await updateProfile(user.uid, { accountType: formData.accountType });
      toast.success("Account type updated successfully!");
      navigate("/account")

    } catch (error) {
      toast.error("Error updating profile: " + error.message);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <Step1SignUp formData={formData} handleInputChange={handleInputChange} />;
      case 1:
        return <Step2AccountType formData={formData} handleInputChange={handleInputChange} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({ ...prevData, usersEmail: user.email }));
    }
  }, [user]);

  return (
    <AnimatePresence>
      <section className="w-full items-center justify-center flex flex-col gap-2 bg-white absolute overflow-auto z-40">
        <header className="w-full flex flex-row items-center justify-center gap-2 bg-white p-2 h-[10%] text-green">
          <Steps current={step} className="h-full w-full flex flex-row gap-4 drop-shadow-2xl" direction="horizontal" type="inline">
            <Step title="Sign Up" />
            <Step title="Account Type" />
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
          {step === 0 && (
            <div className="flex gap-4">
              <Button className="bg-red-500 text-white" type="primary" size="large" onClick={handleCloseModal}>
                Close
              </Button>
              <Button className="text-white bg-green" type="primary" size="large" onClick={handleSignupStep}>
                Sign Up
              </Button>
            </div>
          )}
          {step === 1 && (
            <div className="flex gap-4">
              <Button className="bg-red-500 text-white" type="primary" size="large" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button className="bg-green text-white" type="primary" size="large" onClick={handleAccountTypeStep}>
                Save
              </Button>
            </div>
          )}
        </nav>
      </section>
    </AnimatePresence>
  );
}

export default Signup;
