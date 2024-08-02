import React, { useEffect, useState, useRef } from "react";
import { useAuthProfile } from "../../context/AuthProfileContext";
import { useLocations } from "../../context/LocationsContext";
import AddLocation from "./AddLocation";
import SpringModal from "../Layout/Modals/SpringModal";
import { Button, Form, Input } from "antd";
function ProfileLocations() {
  const { profile } = useAuthProfile();
  const { updateProfileLocation } = useLocations();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [profileAddresses, setProfileAddresses] = useState([]);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [form] = Form.useForm();
  const addressRefs = useRef([]);

  useEffect(() => {
    if (profile.addresses) {
      setProfileAddresses(profile.addresses || []);
    }
  }, [profile]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = addressRefs.current.indexOf(entry.target);
            setCurrentAddressIndex(index);
            console.log("Current Address Index:", index); // Debugging: log the current index
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    addressRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      addressRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const openAddLocationModal = () => {
    setIsAddModalVisible(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalVisible(false);
  };

  const handleEdit = () => {
    const address = profileAddresses[currentAddressIndex];
    setAddressToEdit(address);
    form.setFieldsValue(address); // Set form fields with the selected address data
    setIsEditModalVisible(true);
    console.log("Editing address:", address);
  };

  const handleSaveEdit = async (values) => {
    const updatedAddresses = profileAddresses.map((addr, index) =>
      index === currentAddressIndex ? { ...addr, ...values } : addr
    );

    await updateProfileLocation(profile.id, { ...addressToEdit, ...values });
    setProfileAddresses(updatedAddresses);
    setIsEditModalVisible(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
  };

  return (
    <main className="w-full h-full flex flex-col justify-between gap-2 container mx-auto">
      <SpringModal
        isOpen={isAddModalVisible}
        handleClose={handleCloseAddModal}
        showCloseButton={false}
      >
        <AddLocation handleClose={handleCloseAddModal} />
      </SpringModal>

      <SpringModal
        isOpen={isEditModalVisible}
        handleClose={handleCloseEditModal}
        showCloseButton={false}
      >
        {addressToEdit && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveEdit}
            initialValues={addressToEdit}
          >
            <Form.Item
              label="Location Type"
              name="locationType"
              rules={[{ required: true, message: 'Please input the location type!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Street"
              name="street"
              rules={[{ required: true, message: 'Please input the street!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: 'Please input the city!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="State"
              name="state"
              rules={[{ required: true, message: 'Please input the state!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
              <Button onClick={handleCloseEditModal} style={{ marginLeft: '8px' }}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        )}
      </SpringModal>

      <div
        id="locationDetails"
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none no-scroll p-4 gap-4"
      >
        {profileAddresses.length > 0 ? (
          profileAddresses.map((address, index) => (
            <div
              key={index}
              ref={(el) => (addressRefs.current[index] = el)}
              className="section flex-none w-full h-full flex justify-center items-center snap-center bg-white p-4 rounded-md"
            >
              <div className="flex flex-col text-center items-center justify-center w-full h-full p-4">
                {address.businessLogo && (
                  <img
                    className="w-20"
                    src={address.businessLogo}
                    alt="Business Logo"
                  />
                )}
                <span>{address.locationType}</span>
                <span>{address.street}</span>
                <span>{address.city}</span>
                <span>{address.state}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="section rounded-md flex-none w-full h-full flex justify-center items-center snap-center bg-white">
            <div
              variant="primary"
              className="aspect-square flex flex-col items-center justify-center gap-2"
              size="large"
              onClick={openAddLocationModal}
            >
              Add a Location!
              <ion-icon name="arrow-down-outline"></ion-icon>
            </div>
          </div>
        )}
      </div>
      {profileAddresses.length > 0 && (
        <div className="flex justify-between items-center px-4">
          <div className="flex justify-end gap-4 h-10 w-full rounded-full">
            <Button
              type="primary"
              shape="circle"
              icon={<ion-icon size="large" name="add-circle-outline"></ion-icon>}
              onClick={openAddLocationModal}
            />

            <Button
              shape="circle"
              icon={<ion-icon size="large" name="create-outline"></ion-icon>}
              onClick={handleEdit}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default ProfileLocations;
