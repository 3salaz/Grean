import React from "react";
import { Form, Input, Button } from "antd";

function SignupForm({ formData, handleSignupStep }) {
  return (
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
      <Button
        className="text-white bg-grean"
        type="primary"
        size="large"
        onClick={handleSignupStep}
      >
        Sign Up
      </Button>
    </section>
  );
}

export default SignupForm;
