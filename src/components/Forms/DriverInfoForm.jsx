import React from "react";
import { Form, Select, Input, Button } from "antd";
import f1099msc from "../../assets/forms/f1099msc.pdf";

function DriverInfoForm() {
    return (
      <div id="driver" className="w-full p-4">
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
          label="Payment Details"
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
        <Button>
          <a href={f1099msc} download="1099 Form">
            Download 1099 Form
          </a>
        </Button>
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
      </div>
    );
  }
  
  export default DriverInfoForm;
