// src/components/Layout/Steps/StepLocationType.js

import React from "react";
import { Form, Radio } from "antd";

const Step3LocationType = ({ formData, handleInputChange }) => {
  return (
    <div>
          <Form.Item label="Account Type" name="accountType">
      <Radio.Group
        value={formData.accountType}
        onChange={(e) => handleInputChange({ accountType: e.target.value })}
      >
        <Radio.Button value="Home">Home</Radio.Button>
        <Radio.Button value="Business">Business</Radio.Button>
      </Radio.Group>
    </Form.Item>
    <Form.Item label="Location Type" name="locationType">
      <Radio.Group
        value={formData.locationType}
        onChange={(e) => handleInputChange({ locationType: e.target.value })}
      >
        <Radio.Button value="Home">Home</Radio.Button>
        <Radio.Button value="Business">Business</Radio.Button>
      </Radio.Group>
    </Form.Item>

    </div>
  );
};

export default Step3LocationType;
