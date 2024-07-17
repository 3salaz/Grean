import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthProfile } from "../../../context/AuthProfileContext";
import { toast } from "react-toastify";
import { Form, Input, Typography } from "antd";
import Button from "../../Layout/Button";
import { GoogleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function Step1SignUp({ formData, handleInputChange, setStep, form }) {
  const { createUser, googleSignIn } = useAuthProfile();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    try {
      await googleSignIn();
      toast.success("Signed up successfully with Google!");
      setStep(1); // Move to the next step
    } catch (error) {
      console.log(error);
      toast.error("Error signing up with Google. Please try again.");
    }
  };

  const handleSignUp = async () => {
    try {
      // Validate fields before submitting
      const values = await form.validateFields();

      setLoading(true);
      const profileData = {
        displayName: values.displayName,
        email: values.email,
        locations: { addresses: [] },
      };

      await createUser(values.email, values.password, profileData);
      toast.success("User created successfully!");
      setStep(1); // Move to the next step
    } catch (error) {
      setLoading(false);
      if (error.errorFields) {
        toast.error("Please fill in all required fields.");
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("Error: Email already in use.");
      } else {
        toast.error("Error creating user: " + error.message);
      }
    }
  };

  return (
    <div className="h-full w-full px-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex w-full justify-center items-center">
        <div className="container h-full flex items-center justify-center max-w-lg">
          <div className="container max-w-3xl mx-auto rounded-md">
            <div className="w-full rounded-md">
              <div className="mx-auto w-full">
                <Title level={3} className="py-6 text-center text-[#75B657]">
                  Sign Up for an Account
                </Title>
              </div>
              <section className="w-full flex flex-col gap-2 items-center">
                <Form.Item
                  name="displayName"
                  label="Display Name"
                  className="mb-0 w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Display Name!",
                    },
                  ]}
                >
                  <Input placeholder="Enter your display name" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  className="mb-0 w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Email!",
                    },
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Password!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>
              </section>
              <Form.Item className="flex justify-end gap-2">
                <Button
                  type="primary"
                  size="medium"
                  shape="round"
                  className="bg-[#75B657] text-white"
                  htmlType="submit"
                  loading={loading}
                >
                  Sign Up
                </Button>
              </Form.Item>

              <Text className="text-center text-sm text-gray-500 w-full">
                Already a member?
                <Link
                  to="/login"
                  className="pl-1 font-semibold leading-6 text-[#75B657] hover:text-green-700"
                >
                  Sign In
                </Link>
              </Text>

              <div className="w-full flex flex-col items-center justify-center">
                <Button
                  onClick={handleGoogleSignUp}
                  size="medium"
                  className="flex text-sm items-center bg-blue-500 text-white"
                >
                  <span className="flex flex-col items-center">
                    <GoogleOutlined className="text-2xl" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step1SignUp;
