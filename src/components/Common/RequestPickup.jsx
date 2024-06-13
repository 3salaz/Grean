import { useEffect, useState, useMemo, useCallback } from "react";
import { usePickups } from "../../context/PickupsContext";
import { useProfile } from "../../context/ProfileContext";
import { Form, Input, Button, Select, DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

function RequestPickup({ handleClose }) {
  const { requestPickup } = usePickups();
  const { profile } = useProfile();

  const initialFormData = useMemo(() => ({
    pickupDate: getCurrentDate(),
    pickupTime: "12:00",
    pickupNote: "",
    businessAddress: profile?.fullAddress || "",
  }), [profile]);

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (profile?.fullAddress) {
      setFormData((prevData) => ({
        ...prevData,
        businessAddress: profile.fullAddress,
      }));
    }
  }, [profile]);

  const handleChange = useCallback((name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async () => {
    await requestPickup(formData, handleClose);
  };

  function getCurrentDate() {
    return dayjs().format('YYYY-MM-DD');
  }

  return (
    <div id="pickup" className="w-full h-full flex justify-center items-center overflow-auto">
      <Form className="flex flex-col gap-2 w-full h-full px-2" onFinish={handleSubmit}>
        <header className="flex flex-col gap-1">
          <div className="text-center text-xl font-bold text-grean">Request Pickup</div>
          <div className="text-xs text-center text-white font-bold bg-grean container p-2 mx-auto">
            Schedule your next pickup!
          </div>
        </header>

        <main>
          <section className="flex flex-col gap-2 overflow-auto">
            <Form.Item
              label="Business Address:"
              name="businessAddress"
              rules={[{ required: true, message: 'Please select a business address!' }]}
            >
              <Select
                value={formData.businessAddress}
                defaultValue={formData.businessAddress}
                placeholder="Select your address"
                onChange={(value) => handleChange('businessAddress', value)}
                className="rounded-lg font-normal text-xs"
              >
                {formData.businessAddress && (
                  <Option className="text-center" value={formData.businessAddress}>
                    {formData.businessAddress}
                  </Option>
                )}
              </Select>
            </Form.Item>

            <div className="flex w-full">
              <Form.Item
                label="Date:"
                name="pickupDate"
                rules={[{ required: true, message: 'Please select a date!' }]}
                className="basis-1/2"
              >
                <DatePicker
                  value={formData.pickupDate ? dayjs(formData.pickupDate) : null}
                  onChange={(date) => handleChange('pickupDate', date ? date.format('DD-MM-YYYY') : null)}
                  className="text-sm font-normal p-2 rounded-md"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  format="DD MMMM, YYYY" // Custom date format
                />
              </Form.Item>
              
              <Form.Item
                label="Time:"
                name="pickupTime"
                rules={[{ required: true, message: 'Please select a time!' }]}
                className="basis-1/2"
              >
                <TimePicker
                  value={formData.pickupTime ? dayjs(formData.pickupTime, 'HH:mm') : null}
                  onChange={(time) => handleChange('pickupTime', time ? time.format('HH:mm') : null)}
                  className="text-sm font-normal p-2 rounded-md"
                  minuteStep={30} // Ensures only 30-minute intervals can be selected
                  format="h:mm A"
                  use12Hours
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Pickup Notes:"
              name="pickupNote"
              rules={[{ required: true, message: 'Please enter pickup notes!' }]}
            >
              <TextArea
                rows={3}
                value={formData.pickupNote}
                onChange={(e) => handleChange('pickupNote', e.target.value)}
                className="block rounded-md p-2 text-black shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-grean sm:text-sm sm:leading-6"
              />
            </Form.Item>
          </section>
        </main>

        <section className="flex h-[10%] items-end justify-center flex-row w-full">
          <Button className="bg-grean" type="primary" htmlType="submit" size="medium">
            Request
          </Button>
        </section>
      </Form>
    </div>
  );
}

export default RequestPickup;
