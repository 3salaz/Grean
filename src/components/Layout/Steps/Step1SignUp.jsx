import React from "react";
import { Form, Input } from "antd";

const Step1SignUp = ({ formData, handleInputChange }) => (
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
      <Input value={formData.usersEmail} onChange={(e) => handleInputChange({ usersEmail: e.target.value })} />
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
      <Input.Password value={formData.password} onChange={(e) => handleInputChange({ password: e.target.value })} />
    </Form.Item>
  </section>
);

export default Step1SignUp;
