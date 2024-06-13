import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Button, Form, Input, Typography } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import googleLogo from '../../assets/logos/Google__G__logo.png';

const { Title, Text } = Typography;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn, googleSignIn, user } = UserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      toast.success("Signed in successfully with Google!");
      navigate("/account");
    } catch (error) {
      console.log(error);
      toast.error("Error signing in with Google. Please try again.");
    }
  };

  const handleSignIn = async (values) => {
    setError("");
    try {
      await signIn(values.email, values.password);
      toast.success("Signed in successfully!");
      navigate("/account");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("User not found. Please check your email and try again.");
      } else {
        setError(error.message);
        toast.error(
          "Error signing in. Please check your credentials and try again."
        );
      }
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/account");
    }
  }, [user, navigate]);

  return (
    <div className="h-full w-full px-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex w-full justify-center items-center">
        <div className="container h-full flex items-center justify-center max-w-lg">
          <div className="container max-w-3xl mx-auto rounded-md">
            <div className="w-full rounded-md">
              <div className="mx-auto w-full">
                <Title level={3} className="mt-10 text-center text-[#75B657]">
                  Sign In To Your Account
                </Title>
              </div>
              <div className="my-8">
                <Form
                  name="login"
                  className="space-y-2"
                  onFinish={handleSignIn}
                >
                  <Form.Item
                    name="email"
                    label="Email"
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
                    <Input
                      placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    lable="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Password!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item className="text-right">
                    <a href="https://google.com" className="font-semibold text-blue-400 hover:text-slate-800">
                      Forgot password?
                    </a>
                  </Form.Item>
                  <Form.Item className="text-right">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-[#75B657] rounded-xl w-24 text-lg text-white"
                    >
                      Sign In
                    </Button>
                  </Form.Item>
                </Form>
                <Text className="mt-4 text-center text-sm text-gray-500">
                  Not a member?
                  <Link
                    to="/setup"
                    className="pl-1 font-semibold leading-6 text-[#75B657] hover:text-green-700"
                  >
                    Sign Up
                  </Link>
                </Text>
              </div>
              <div className="w-full flex flex-col items-center justify-center">
                <Button
                  icon={<GoogleOutlined />}
                  onClick={handleGoogleSignIn}
                  className="flex items-center bg-blue-500 text-white"
                >
                  Sign In with Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
