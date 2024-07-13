import React from "react";
import { Form, Input } from "antd";
import { motion } from "framer-motion";

function BasicInfoForm({ formData, handleChange }) {
  return (
    <section className="flex flex-col h-full container px-8 text-center">
      {formData.locationType === "Business" && (
        <motion.div
          key="businessForm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col w-full gap-2"
        >
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
            label="Business Website"
            name="businessWebsite"
            rules={[
              {
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
          >
            <Input.TextArea />
          </Form.Item>
        </motion.div>
      )}
      {formData.locationType === "Home" && (
        <div className="">
          <h2 className="text-xl mb-4">Profile Info</h2>
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
        </div>
      )}
    </section>
  );
}

export default BasicInfoForm;
