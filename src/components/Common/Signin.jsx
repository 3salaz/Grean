import { Link, useNavigate } from "react-router-dom";
import { useAuthProfile } from "../../context/AuthProfileContext";
import { toast } from "react-toastify";
import { Form, Input, Typography } from "antd";
import Button from "../Layout/Button";
import { GoogleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

function Signin() {
  const [form] = Form.useForm();
  const { signIn, googleSignIn } = useAuthProfile();
  const navigate = useNavigate();
  const { Title, Text } = Typography;

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
    try {
      await signIn(values.email, values.password);
      toast.success("Signed in successfully!");
      navigate("/account");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("User not found. Please check your email and try again.");
      } else {
        toast.error("Error signing in. Please check your credentials and try again.");
      }
    }
  };

  return (
    <section className="w-full h-full items-center justify-between flex flex-col gap-2 bg-white z-40">
      <motion.main
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
        className="overflow-auto w-full"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSignIn}
          className="w-full h-full"
        >
          <div
            className="h-full w-full px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full justify-center items-center">
              <div className="container h-full flex items-center justify-center max-w-lg">
                <div className="container max-w-3xl mx-auto rounded-md">
                  <div className="w-full rounded-md p-2">
                    <div className="mx-auto w-full">
                      <Title
                        level={3}
                        className="py-6 text-center text-[#75B657]"
                      >
                        Sign In To Your Account
                      </Title>
                    </div>
                    <section className="w-full flex flex-col gap-2 items-center">
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
                      <div className="w-full flex items-center justify-center pb-2">
                        <Text className="text-center text-sm text-gray-500 w-full">
                          Not a member?
                          <Link
                            to="/setup"
                            className="pl-1 font-semibold leading-6 text-[#75B657] hover:text-green-700"
                          >
                            Sign Up
                          </Link>
                        </Text>
                      </div>
                    </section>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        onClick={handleGoogleSignIn}
                        size="medium"
                        className="flex text-sm items-center bg-blue-500 text-white"
                      >
                        <span className="flex flex-col items-center">
                          <GoogleOutlined className="text-2xl" />
                        </span>
                      </Button>
                      <Button
                        type="primary"
                        size="medium"
                        shape="round"
                        className="bg-[#75B657] text-white"
                      >
                        Sign In
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </motion.main>
    </section>
  );
}

export default Signin;
