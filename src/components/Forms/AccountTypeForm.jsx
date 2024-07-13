import React from "react";
import { Form, Radio } from "antd";
import userIcon from "../../assets/icons/user.png";
import driverIcon from "../../assets/icons/driver.png";

function AccountTypeForm({ handleRoleChange }) {
    return (
      <section className="bg-white rounded-md container flex flex-col w-full gap-2 text-center">
        <h2 className="text-xl mb-2 font-bold">Account Type</h2>
        <div>
          <p className="text-sm">Select the type of account you'd like!</p>
          <p className="text-xs pb-4">(This can be changed later in your settings)</p>
        </div>
        <Form.Item
          name="accountType"
          className="w-full flex flex-col gap-2"
          rules={[
            {
              required: true,
              message: "Please select the type of account you'd like",
            },
          ]}
        >
          <Radio.Group
            className="w-full flex justify-center gap-4 text-center"
            onChange={handleRoleChange}
          >
            <Radio.Button className="basis-1/4 h-auto p-4 flex flex-col" value="Driver">
              <img src={driverIcon} alt="Driver Icon"/>
              <div className="text-sm text-dark-green">Driver</div>
            </Radio.Button>
            <Radio.Button className="basis-1/4 h-auto p-4 flex flex-col" value="User">
              <img src={userIcon} alt="User Icon"/>
              <div className="text-sm text-dark-green">User</div>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </section>
    );
  }
  
  export default AccountTypeForm;
  