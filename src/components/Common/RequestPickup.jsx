import { useEffect, useState, useMemo, useCallback } from "react";
import { usePickups } from "../../context/PickupsContext";
import { useAuthProfile } from "../../context/AuthProfileContext";
import { useLocations } from "../../context/LocationsContext";
import { Form, Input, Select, DatePicker, TimePicker, Upload } from 'antd';
import dayjs from 'dayjs';
import { UploadOutlined } from '@ant-design/icons';
import Button from "../Layout/Button";

const { TextArea } = Input;
const { Option } = Select;

function RequestPickup({ handleClose }) {
  const { requestPickup } = usePickups();
  const { profile } = useAuthProfile();
  const { getUserAddresses } = useLocations();

  const initialFormData = useMemo(() => ({
    pickupDate: getCurrentDate(),
    pickupTime: "12:00",
    pickupNote: "",
    businessAddress: profile?.fullAddress || "Address goes here when you save to database",
    appliance: null,
    applianceImage: null,
  }), [profile]);

  const [formData, setFormData] = useState(initialFormData);
  const [fileList, setFileList] = useState([]);

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

  const handleUpload = ({ file }) => {
    setFileList([file]);
  };

  const handleSubmit = async () => {
    const formDataWithFile = { ...formData };

    if (fileList.length > 0) {
      const file = fileList[0];
      formDataWithFile.applianceImage = file;
    }

    await requestPickup(formDataWithFile, handleClose);
  };

  function getCurrentDate() {
    return dayjs().format('YYYY-MM-DD');
  }

  return (
    <div id="pickup" className="w-full h-full flex justify-center items-center overflow-auto">
      <Form className="flex flex-col gap-2 w-full h-full px-2" onFinish={handleSubmit}>
        <header className="flex flex-col gap-1 h-[10%]">
          <div className="text-center text-xl font-bold text-grean">Request Pickup</div>
          <div className="text-xs text-center text-white font-bold bg-grean container p-2 mx-auto">
            Schedule your next pickup!
          </div>
        </header>

        <main className="h-[90%] max-h-[90%]">
          <section className="flex flex-col h-full overflow-auto">
            <Form.Item
              label="Business Address:"
              name="businessAddress"
              rules={[{ required: true, message: 'Please select a business address!' }]}
            >
              <Select
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

            <Form.Item
              label="Appliance:"
              name="appliance"
              rules={[{ required: true, message: 'Please select an appliance!' }]}
            >
              <Select
                placeholder="Select appliance"
                onChange={(value) => handleChange('appliance', value)}
                className="rounded-lg font-normal text-xs"
              >
                <Option value="washingMachine">Washing Machine</Option>
                <Option value="refrigerator">Refrigerator</Option>
                <Option value="oven">Oven</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            {formData.appliance && (
              <Form.Item
                label="Upload Appliance Image:"
                name="applianceImage"
                rules={[{ required: true, message: 'Please upload an image of the appliance!' }]}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false} // Prevent automatic upload
                  onChange={handleUpload}
                  fileList={fileList}
                >
                  <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
                </Upload>
              </Form.Item>
            )}

            <div className="flex w-full gap-4">
              <Form.Item
                label="Date:"
                name="pickupDate"
                rules={[{ required: true, message: 'Please select a date!' }]}
                className="basis-1/2"
              >
                <DatePicker
                  value={formData.pickupDate ? dayjs(formData.pickupDate) : null}
                  onChange={(date) => handleChange('pickupDate', date ? date.format('YYYY-MM-DD') : null)}
                  className="text-sm font-normal p-2 rounded-md w-full"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  format="DD-MM-YYYY" // Custom date format
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

        <section className="flex items-end justify-center flex-row w-full">
          <Button className="bg-grean text-white" type="primary" size="medium" htmlType="submit">
            Request
          </Button>
        </section>
      </Form>
    </div>
  );
}

export default RequestPickup;
