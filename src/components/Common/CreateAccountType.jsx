import React, { useState } from "react";
import { useAuthProfile } from "../../context/AuthProfileContext";
import { Form, Radio, Typography } from "antd";
import { toast } from "react-toastify";
import driverIcon from '../../assets/icons/driver.png';
import userIcon from '../../assets/icons/user.png';
import Button from "../Layout/Button";

const { Title } = Typography;

function CreateAccountType({ handleClose }) {
  const { user, updateProfile } = useAuthProfile();
  const [accountType, setAccountType] = useState("");

  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value);
  };

  const handleSubmit = async () => {
    if (!accountType) {
      toast.error("Please select an account type");
      return;
    }

    try {
      await updateProfile(user.uid, { accountType });
      toast.success("Account type updated successfully!");
      if (handleClose) handleClose();  // Close the modal after successful update
    } catch (error) {
      toast.error("Error updating account type: " + error.message);
    } finally {
    }
  };

  return (
    <section className="w-full h-full flex flex-col items-center justify-center gap-8">
      <Title level={3}>Set Account Type</Title>
      <Form layout="vertical" className="w-full max-w-md text-center justify-between flex flex-col items-center p-0">
        <Form.Item className="w-full text-center" required>
          <Radio.Group className="flex items-center justify-center gap-4 w-full" onChange={handleAccountTypeChange} value={accountType}>
            <Radio.Button
              className="basis-1/4 h-auto p-4 flex flex-col"
              value="Driver"
            >
              <img src={driverIcon} alt="Driver" />
              <div className="text-sm text-dark-green">Driver</div>
            </Radio.Button>
            <Radio.Button
              className="basis-1/4 h-auto p-4 flex flex-col"
              value="User"
            >
              <img src={userIcon} alt="User" />
              <div className="text-sm text-dark-green">User</div>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Button variant="primary" size="medium" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </section>
  );
}

export default CreateAccountType;
