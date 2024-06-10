import { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useLocations } from "../../context/LocationContext";
import { useProfile } from "../../context/ProfileContext";
import { motion } from "framer-motion";
import { Form, Input, Button, Row, Col } from "antd";


const ProfileForm = () => {
  const { user } = UserAuth();
  const { profile, updateProfile } = useProfile();
  const { updateLocation } = useLocations();
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    driverName: "",
    usersEmail: user.email,
    userRole: "",
    businessName: "",
    businessAddress: "",
    street: "",
    city: "",
    state: "California",
    businessWebsite: "",
    businessDescription: "",
    businessEmail: "",
  });

  const locationData = {
    businessName: formData.businessName,
    businessAddress: formData.fullAddress,
    businessDescription: formData.businessDescription || "",
    businessEmail: formData.businessEmail || "",
    businessWebsite: formData.businessWebsite || "",
  };
  
  const [editMode, setEditMode] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(profile || {});
    form.setFieldsValue(profile || {});
  }, [profile, form]);

  const handleGeocodeAddress = async () => {
    const fullAddress = `${formData.street}, ${formData.city}, California`;
    const apiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(
      fullAddress
    )}&api_key=660502575887c637237148utr0d3092`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates({ lat, lng: lon });
        console.log(coordinates)
        setError("");
        return { lat, lng: lon };
      } else {
        setError("No results found. Please try a different address.");
        console.log(error)
        return null;
      }
    } catch (err) {
      setError("An error occurred while geocoding. Please try again.");
      console.error(err);
      return null;
    }
  };

  const handleSubmit = async (values) => {
    let coords = { lat: null, lng: null };
    const fullAddress = `${values.street}, ${values.city}, California`;

    if (values.userRole === "Business") {
      const geocodedCoords = await handleGeocodeAddress();
      if (!geocodedCoords) {
        toast.error(
          "Could not geocode address. Please check the address details."
        );
        return;
      }
      coords = geocodedCoords;
    }

    const updatedFormData = {
      ...values,
      fullAddress,
      ...(coords.lat && coords.lng ? { lat: coords.lat, lng: coords.lng } : {}),
    };

    try {
      await updateProfile(updatedFormData);
      if (values.userRole === "Business" && coords.lat && coords.lng) {
        await updateLocation({ ...locationData, ...coords });
      }
      toast.success("Profile saved successfully!");
      navigate("/Account");
    } catch (error) {
      toast.error("Error saving profile: " + error.message);
      console.error("Error saving profile: ", error);
    }
  };

  const handleEdit = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  const roles = [
    { name: "Home", icon: "home-outline" },
    { name: "Driver", icon: "car-outline" },
    { name: "Business", icon: "business-outline" },
  ];

  return (
    <Form
      form={form}
      className="h-[90%] rounded-lg flex flex-col items-center"
      onFinish={handleSubmit}
      layout="vertical"
    >
      <main className="container mx-auto h-full flex flex-col justify-between">
        <div className="min-h-[80%] max-h-[80%] w-full overflow-auto">
          <section className="p-2 h-full" id="profileFormDetails">
            <div className="flex flex-col h-full w-full gap-4 rounded-md">
              <div className="rounded-md p-1 gap-4 flex flex-col w-full bg-white">
                {/* Profile */}
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="flex items-center gap-1">
                    <ion-icon
                      size="small"
                      className="font-bold"
                      name="person-circle-outline"
                    ></ion-icon>
                    <div className="text-md font-bold">Profile</div>
                  </div>
                  <div className="text-xs">
                    Please fill out the details below to save your details.
                  </div>
                </div>

                <Row gutter={16} className="w-full text-xs">
                  {/* First Name */}
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="First Name"
                      name="firstName"
                      rules={[
                        { required: true, message: "Please input your first name!" },
                      ]}
                    >
                      <Input
                        className={`px-4 py-2 border w-full rounded-md text-center ${
                          editMode ? "bg-slate-100 border-slate-200" : "bg-slate-200 border-grean"
                        }`}
                      />
                    </Form.Item>
                  </Col>

                  {/* Last Name */}
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Last Name"
                      name="lastName"
                      rules={[
                        { required: true, message: "Please input your last name!" },
                      ]}
                    >
                      <Input
                        className={`px-4 py-2 border w-full rounded-md text-center ${
                          editMode ? "bg-slate-100 border-slate-200" : "bg-slate-200 border-grean"
                        }`}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <div className={`rounded-md gap-4 flex flex-col bg-white text-xs ${formData.userRole === "Business" ? "bg-auto" : "bg-auto"}`}>
                {/* Business Info */}
                {formData.userRole === "Business" && (
                  <div className="w-full bg-white p-2 rounded-md drop-shadow-lg">
                    <div className="bg-light-grey flex flex-col justify-center items-start gap-2">
                      <div className="flex items-center gap-1">
                        <ion-icon
                          className="font-bold"
                          size="small"
                          name="business-outline"
                        ></ion-icon>
                        <div className="text-base font-bold">Business</div>
                      </div>
                      <div className="text-xs">Business details.</div>
                    </div>
                    <Row gutter={16} className="w-full flex-wrap rounded-lg bg-white">
                      {/* Business Name */}
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Business Name"
                          name="businessName"
                          rules={[
                            { required: true, message: "Please input your business name!" },
                          ]}
                        >
                          <Input
                            className={`px-4 py-2 w-full border rounded-md text-center ${
                              editMode ? "bg-slate-100 border-slate-200" : "bg-slate-200 border-grean"
                            }`}
                          />
                        </Form.Item>
                      </Col>

                      {/* Street */}
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Street"
                          name="street"
                          rules={[
                            { required: true, message: "Please input your street address!" },
                          ]}
                        >
                          <Input
                            className={`px-4 py-2 w-full border rounded-md text-center ${
                              editMode ? "bg-slate-100 border-slate-200" : "bg-slate-200 border-grean"
                            }`}
                          />
                        </Form.Item>
                      </Col>

                      {/* City */}
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="City"
                          name="city"
                          rules={[
                            { required: true, message: "Please input your city!" },
                          ]}
                        >
                          <Input
                            className={`px-4 py-2 w-full border rounded-md text-center ${
                              editMode ? "bg-slate-100 border-slate-200" : "bg-slate-200 border-grean"
                            }`}
                          />
                        </Form.Item>
                      </Col>

                      {/* State */}
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="State"
                          name="state"
                          initialValue="California"
                        >
                          <Input
                            readOnly
                            className={`px-4 py-2 w-full border rounded-md text-center read-only-styles ${
                              editMode ? "bg-slate-100 border-slate-200" : "bg-slate-200 border-grean"
                            }`}
                          />
                        </Form.Item>
                      </Col>

                      {/* Business Email */}
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Business Email"
                          name="businessEmail"
                          rules={[
                            { required: true, type: "email", message: "Please input your business email!" },
                          ]}
                        >
                          <Input
                            
                            className={`px-4 py-2 w-full border rounded-md text-center ${
                              editMode ? "bg-slate-100 border-slate-200" : "bg-slate-200 border-grean"
                            }`}
                          />
                        </Form.Item>
                      </Col>

                      {/* Business Website */}
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Business Website"
                          name="businessWebsite"
                          rules={[
                            { type: "url", message: "Please input a valid URL!" },
                          ]}
                        >
                          <Input
                            
                            className={`px-4 py-2 w-full border rounded-md text-center ${
                              editMode ? "bg-slate-100 border-slate-200" : "bg-slate-200 border-grean"
                            }`}
                          />
                        </Form.Item>
                      </Col>

                      {/* Business Description */}
                      <Col xs={24} md={24}>
                        <Form.Item
                          label="Business Description"
                          name="businessDescription"
                        >
                          <Input.TextArea
                            
                            className={`px-4 py-2 w-full border rounded-md text-center ${
                              editMode ? "bg-slate-100 border-slate-200" : "bg-slate-200 border-grean"
                            }`}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )}

                {formData.userRole === "Driver" && (
                  <Form.Item
                    label="Driver's Name"
                    name="driverName"
                    className="flex items-center flex-col w-full"
                    rules={[
                      { required: true, message: "Please input the driver's name!" },
                    ]}
                  >
                    <Input
                      
                      className={`px-4 py-2 border rounded-md text-center w-full ${
                        editMode ? "bg-slate-100 border-slate-200" : "bg-slate-200 border-grean"
                      }`}
                    />
                  </Form.Item>
                )}

                {formData.userRole === "Home" && (
                  <Row gutter={16} className="w-full overflow-auto rounded-lg p-2" >
                    {/* Street */}
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Street"
                        name="street"
                        rules={[
                          { required: true, message: "Please input your street address!" },
                        ]}
                      >
                        <Input
                          
                          className={`text-center ${
                            editMode ? "editable-styles" : "read-only-styles"
                          }`}
                        />
                      </Form.Item>
                    </Col>

                    {/* City */}
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="City"
                        name="city"
                        rules={[
                          { required: true, message: "Please input your city!" },
                        ]}
                      >
                        <Input
                          
                          className={`text-center ${
                            editMode ? "editable-styles" : "read-only-styles"
                          }`}
                        />
                      </Form.Item>
                    </Col>

                    {/* State */}
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="State"
                        name="state"
                        initialValue="California"
                      >
                        <Input
                          readOnly
                          className={`text-center read-only-styles ${
                            editMode ? "editable-styles" : "read-only-styles"
                          }`}
                        />
                      </Form.Item>
                    </Col>

                    {/* Email Address */}
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Email"
                        name="businessEmail"
                        rules={[
                          { required: true, type: "email", message: "Please input your email!" },
                        ]}
                      >
                        <Input
                          
                          className={`px-4 py-2 border rounded-md text-center ${
                            editMode ? "bg-slate-100 border-slate-200" : "bg-slate-200 border-grean"
                          }`}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="min-h-[20%] max-h-[20%] flex flex-col items-center justify-center w-full p-2 bg-slate-800">
          <section className="flex w-full items-center justify-center gap-2 p-2 h-[70%]">
            {roles.map((role) => (
              <div className="flex flex-col items-center justify-center" key={role.name}>
                <motion.div
                  className={`flex flex-col items-center justify-center border aspect-square w-20 h-20 text-center rounded-sm gap-2 cursor-pointer ${
                    formData.userRole === role.name
                      ? "bg-grean text-white font-bold border-white"
                      : "border-none text-white border-white"
                  }`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFormData((prev) => ({ ...prev, userRole: role.name }))}
                >
                  <ion-icon
                    className={`text-white ${formData.userRole === role.name ? "text-white" : "text-slate-800"}`}
                    size="small"
                    name={role.icon}
                  ></ion-icon>
                  <label className="text-xs">{role.name}</label>
                </motion.div>
              </div>
            ))}
          </section>

          <section className="flex w-full items-center justify-center h-[30%]" id="profileFormBtns">
            <div className="flex items-center gap-4 w-full">
              <Link
                to="/account"
                type="button"
                onClick={handleEdit}
                className="w-full h-full px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:bg-blue-600 text-center"
              >
                Back
              </Link>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-full px-4 py-2 bg-grean text-white rounded-md focus:outline-none focus:bg-green-600"
              >
                Save
              </Button>
            </div>
          </section>
        </div>
      </main>
    </Form>
  );
};

export default ProfileForm;
