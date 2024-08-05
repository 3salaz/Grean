import React, { useEffect, useState, useMemo, useCallback } from "react";
import { usePickups } from "../../context/PickupsContext";
import { useAuthProfile } from "../../context/AuthProfileContext";
import { Form, Input, Select, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import Button from "../Layout/Button";
import homeIcon from "../../assets/icons/home.png";
import '../../custom-antd.css';

const { TextArea } = Input;
const { Option } = Select;

function RequestPickup({ handleClose }) {
  const { createPickup } = usePickups();
  const { profile } = useAuthProfile();
  const [profileLocations, setProfileLocations] = useState([]);

  const initialFormData = useMemo(
    () => ({
      pickupDate: getCurrentDate(),
      pickupTime: "12:00",
      pickupNote: "",
      address: "",
      appliance: null,
    }),
    [profile]
  );

  const [pickupRequestData, setPickupRequestData] = useState(initialFormData);

  useEffect(() => {
    if (profile?.addresses) {
      setProfileLocations(profile.addresses);
    }
  }, [profile]);

  const handleChange = useCallback(
    (name, value) => {
      setPickupRequestData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      if (name === "address") {
        const selectedAddress = profileLocations.find(
          (address) => address.street === value
        );

        if (selectedAddress) {
          console.log("Selected Address:", selectedAddress);
        } else {
          console.error("Selected address not found:", value);
        }
      }
    },
    [profileLocations]
  );

  const handleSubmit = async () => {
    const formDataWithFile = { ...pickupRequestData };

    const selectedAddress = profileLocations.find(
      (address) => address.street === pickupRequestData.address
    );

    if (!selectedAddress) {
      console.error("Selected address not found:", pickupRequestData.address);
      return;
    }

    const pickupData = {
      ...formDataWithFile,
      addressData: selectedAddress,
      longitude: selectedAddress.longitude,
      latitude: selectedAddress.latitude,
    };

    try {
      await createPickup(pickupData);
      handleClose();
    } catch (error) {
      console.error("Error creating pickup:", error);
    }
  };

  function getCurrentDate() {
    return dayjs().format("YYYY-MM-DD");
  }

  return (
    <div
      id="pickup"
      className="w-full h-full flex justify-center items-center overflow-auto"
    >
      <Form
        className="flex flex-col gap-2 w-full h-full px-2"
        onFinish={handleSubmit}
      >
        <header className="flex flex-col gap-1 h-[10%]">
          <div className="text-center text-xl font-bold text-grean">
            Request Pickup
          </div>
          <div className="text-xs text-center text-white font-bold bg-grean container p-2 mx-auto">
            Schedule your next pickup!
          </div>
        </header>

        <main className="h-[90%] max-h-[90%]">
          <section className="flex flex-col h-full overflow-auto">
            <Form.Item
              label="Address:"
              name="address"
              rules={[{ required: true, message: "Please select an address!" }]}
            >
              <Select
                placeholder="Select your address"
                onChange={(value) => handleChange("address", value)}
                className="rounded-lg font-normal text-xs"
                value={pickupRequestData.address}
              >
                {profileLocations.map((address, index) => (
                  <Option
                    key={index}
                    className="text-center flex flex-row items-center justify-center"
                    value={address.street}
                  >
                    <div className="flex items-center gap-4 justify-start">
                      <img className="w-6" src={homeIcon} alt="Home Icon" />
                      {address.street}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Appliance:"
              name="appliance"
              rules={[
                { required: true, message: "Please select an appliance!" },
              ]}
            >
              <Select
                placeholder="Select appliance"
                onChange={(value) => handleChange("appliance", value)}
                className="rounded-lg font-normal text-xs"
              >
                <Option value="washingMachine">Washing Machine</Option>
                <Option value="refrigerator">Refrigerator</Option>
                <Option value="oven">Oven</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <div className="flex w-full gap-4">
              <Form.Item
                label="Date:"
                name="pickupDate"
                rules={[{ required: true, message: "Please select a date!" }]}
                className="basis-1/2"
              >
                <DatePicker
                  value={
                    pickupRequestData.pickupDate
                      ? dayjs(pickupRequestData.pickupDate)
                      : null
                  }
                  onChange={(date) =>
                    handleChange(
                      "pickupDate",
                      date ? date.format("YYYY-MM-DD") : null
                    )
                  }
                  className="text-sm font-normal p-2 rounded-md w-full"
                  disabledDate={(current) => {
                    const today = dayjs().startOf("day");
                    const weekAhead = today.add(7, "day").endOf("day");
                    return current && (current < today || current > weekAhead);
                  }}
                  format="DD-MM-YYYY" // Custom date format
                />
              </Form.Item>

              <Form.Item
                label="Time:"
                name="pickupTime"
                rules={[{ required: true, message: "Please select a time!" }]}
                className="basis-1/2"
              >
                <TimePicker
                  value={
                    pickupRequestData.pickupTime
                      ? dayjs(pickupRequestData.pickupTime, "HH:mm")
                      : null
                  }
                  onChange={(time) =>
                    handleChange(
                      "pickupTime",
                      time ? time.format("HH:mm") : null
                    )
                  }
                  className="text-sm font-normal p-2 rounded-md w-full"
                  minuteStep={30} // Ensures only 30-minute intervals can be selected
                  format="h:mm A"
                  use12Hours
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Pickup Notes:"
              name="pickupNote"
              rules={[
                { required: true, message: "Please enter pickup notes!" },
              ]}
            >
              <TextArea
                rows={3}
                value={pickupRequestData.pickupNote}
                onChange={(e) => handleChange("pickupNote", e.target.value)}
                className="block rounded-md p-2 text-black shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-grean sm:text-sm sm:leading-6"
              />
            </Form.Item>
          </section>
        </main>

        <section className="flex items-end justify-center flex-row w-full">
          <Button
            className="bg-blue-400 text-white"
            type="primary"
            size="medium"
          >
            Request
          </Button>
        </section>
      </Form>
    </div>
  );
}

export default RequestPickup;
