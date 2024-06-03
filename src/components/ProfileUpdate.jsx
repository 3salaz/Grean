import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useLocations } from "../context/LocationContext";
import { useProfile } from "../context/ProfileContext";
import { motion } from "framer-motion";

const ProfileUpdate = () => {
  const { user } = UserAuth();
  const { profile, updateProfile } = useProfile();
  const { updateLocation } = useLocations();
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
  console.log(error);

  useEffect(() => {
    setFormData(profile || {});
  }, [profile]);

  const handleGeocodeAddress = async () => {
    const fullAddress = `${formData.street}, ${formData.city}, California`;
    console.log(fullAddress);
    const apiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(
      fullAddress
    )}&api_key=660502575887c637237148utr0d3092`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates({ lat, lng: lon });
        setError("");
        return { lat, lng: lon };
      } else {
        setError("No results found. Please try a different address.");
        return null;
      }
    } catch (err) {
      setError("An error occurred while geocoding. Please try again.");
      console.error(err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let coords = { lat: null, lng: null };
    const fullAddress = `${formData.street}, ${formData.city}, California`;

    if (formData.userRole === "Business") {
      const geocodedCoords = await handleGeocodeAddress();
      if (!geocodedCoords) {
        toast.error(
          "Could not geocode address. Please check the address details."
        );
        return;
      }
      coords = geocodedCoords;
    }
    console.log(coordinates);
    const updatedFormData = {
      ...formData,
      fullAddress,
      ...(coords.lat && coords.lng ? { lat: coords.lat, lng: coords.lng } : {}),
    };

    try {
      await updateProfile(updatedFormData);
      if (formData.userRole === "Business" && coords.lat && coords.lng) {
        await updateLocation({ ...locationData, ...coords });
      }
      toast.success("Profile saved successfully!");
      navigate("/Account");
    } catch (error) {
      toast.error("Error saving profile: " + error.message);
      console.error("Error saving profile: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "email" && !isValidEmail(value)) {
      setError("Please enter a valid email address.");
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const handleEdit = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const roles = [
    { name: "Home", icon: "home-outline" },
    { name: "Driver", icon: "car-outline" },
    { name: "Business", icon: "business-outline" },
  ];

  return (
    <form className="container mx-auto h-full rounded-lg flex flex-col items-center">
      <main className="w-full h-full flex flex-col justify-between">
        <div className=" min-h-[80%] max-h-[80%] w-full overflow-auto bg-grean">
          <section className=" p-2 h-full" id="profileFormDetails">
            <div className="bg-white text-slate-800 flex flex-col h-full w-full gap-4 rounded-md">
              <div className="rounded-md drop-shadow-lg p-1 gap-4 flex flex-col w-full">
                {/* Profile */}
                <div className="bg-light-grey flex flex-col justify-start items-start gap-2">
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

                <div className="flex gap-2 w-full text-xs">
                  {/* First Name */}
                  <div
                    id="firstName"
                    className="flex items-center flex-col basis-1/2"
                  >
                    <label className="block text-gray-700" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      className={`px-4 py-2 border w-full  md:basis-4/6 rounded-md focus:outline-none focus:border-blue-500 text-center
                ${
                  editMode
                    ? "bg-slate-100 border-slate-200"
                    : "bg-slate-200 border-grean"
                }
              `}
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      readOnly={!editMode}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div
                    id="lastName"
                    className="flex items-center flex-col basis-1/2"
                  >
                    <label className="block text-gray-700" htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      readOnly={!editMode}
                      onChange={handleChange}
                      required
                      className={`py-2 border rounded-md focus:outline-none focus:border-blue-500 text-center w-full ${
                        editMode // Toggle className based on editMode
                          ? "bg-slate-100 border-slate-200"
                          : "bg-slate-200 border-grean"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`rounded-md drop-shadow-lg p-2 gap-4 flex flex-col text-xs ${
                  formData.userRole === "Business" ? "bg-auto" : "bg-auto"
                }`}
              >
                {/* Business Info */}
                {formData.userRole === "Business" && (
                  <div className="">
                    {/* Profile */}
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
                    <div className="flex w-full flex-wrap rounded-lg bg-white">
                      {/* Business */}
                      <div className="flex items-center flex-col basis-1/2 px-1">
                        <label
                          htmlFor="businessName"
                          className="block text-gray-700 basis-2/6"
                        >
                          Business Name:
                        </label>
                        <input
                          id="businessName"
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          readOnly={!editMode}
                          onChange={handleChange}
                          required
                          className={`px-4 py-2 w-full border md:basis-4/6 rounded-md focus:outline-none focus:border-blue-500 text-center 
                      ${
                        editMode
                          ? "bg-slate-100 border-slate-200"
                          : "bg-slate-200 border-grean font-bold"
                      }`}
                        />
                      </div>
                      {/* Street */}
                      <div className="flex items-center flex-col basis-1/2 px-1">
                        <label htmlFor="street" className="block text-gray-700">
                          Street:
                        </label>
                        <input
                          id="street"
                          type="text"
                          name="street"
                          value={formData.street}
                          readOnly={!editMode}
                          onChange={handleChange}
                          required
                          className={`px-4 py-2 w-full border  md:basis-4/6 rounded-md focus:outline-none focus:border-blue-500 text-center                       ${
                            editMode
                              ? "bg-slate-100 border-slate-200"
                              : "bg-slate-200 border-grean font-bold"
                          }`}
                        />
                      </div>

                      {/* City */}
                      <div className="flex items-center flex-col basis-1/2 px-1">
                        <label htmlFor="city" className="block text-gray-700">
                          City:
                        </label>
                        <input
                          id="city"
                          type="text"
                          name="city"
                          value={formData.city}
                          readOnly={!editMode}
                          onChange={handleChange}
                          required
                          className={`px-4 py-2 w-full border  md:basis-4/6 rounded-md focus:outline-none focus:border-blue-500 text-center                       
                        ${
                          editMode
                            ? "bg-slate-100 border-slate-200"
                            : "bg-slate-200 border-grean font-bold"
                        }`}
                        />
                      </div>

                      {/* State - Preset to California and Read-only */}
                      <div className="flex items-center flex-col basis-1/2 px-1">
                        <label htmlFor="state" className="block text-gray-700">
                          State:
                        </label>
                        <input
                          id="state"
                          type="text"
                          name="state"
                          value="California"
                          readOnly
                          className={`px-4 py-2 w-full border  md:basis-4/6 rounded-md focus:outline-none focus:border-blue-500 text-center read-only-styles
                        ${
                          editMode
                            ? "bg-slate-100 border-slate-200"
                            : "bg-slate-200 border-grean font-bold"
                        }`}
                        />
                      </div>

                      {/* Email Address */}
                      <div className="flex items-center flex-col basis-1/2 px-1">
                        <label
                          htmlFor="lastName"
                          className="block text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          id="businessEmail"
                          type="email"
                          name="businessEmail"
                          placeholder="email@something.com"
                          readOnly={!editMode}
                          value={formData.businessEmail}
                          onChange={handleChange}
                          required
                          className={`px-4 py-2 w-full  border   rounded-md focus:outline-none focus:border-blue-500 text-center ${
                            editMode
                              ? "bg-slate-100 border-slate-200"
                              : "bg-slate-200 border-grean font-bold"
                          }`}
                        />
                      </div>
                      {/* Website */}
                      <div className="flex items-center flex-col basis-1/2 px-1">
                        <label
                          htmlFor="BusinessWebsite"
                          className="block text-gray-700"
                        >
                          Business Website
                        </label>
                        <input
                          id="businessWebsite"
                          type="url"
                          name="businessWebsite"
                          value={formData.businessWebsite}
                          readOnly={!editMode}
                          onChange={handleChange}
                          className={`px-4 py-2 w-full  border   rounded-md focus:outline-none focus:border-blue-500 text-center ${
                            editMode
                              ? "bg-slate-100 border-slate-200"
                              : "bg-slate-200 border-grean font-bold"
                          }`}
                        />
                      </div>
                      {/* Description */}
                      <div className="flex items-center flex-col basis-full px-1">
                        <label
                          htmlFor="businessDescription"
                          className="block text-gray-700"
                        >
                          Business Description
                        </label>
                        <textarea
                          id="businessDescription"
                          name="businessDescription"
                          value={formData.businessDescription}
                          readOnly={!editMode}
                          onChange={handleChange}
                          className={`px-4 py-2 w-full  border   rounded-md focus:outline-none focus:border-blue-500 text-center ${
                            editMode
                              ? "bg-slate-100 border-slate-200"
                              : "bg-slate-200 border-grean font-bold"
                          }`}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {formData.userRole === "Driver" && (
                  <div className="flex w-full">
                    <div className="flex items-center flex-col w-full">
                      <label
                        htmlFor="businessName"
                        className="block text-gray-700"
                      >
                        Drivers Name
                      </label>
                      <input
                        id="driverName"
                        type="text"
                        name="driverName"
                        value={formData.driverName}
                        readOnly={!editMode}
                        onChange={handleChange}
                        required
                        className={`px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 text-center w-full 
                ${
                  editMode
                    ? "bg-slate-100 border-slate-200"
                    : "bg-slate-200 border-grean font-bold"
                }`}
                      />
                    </div>
                  </div>
                )}

                {formData.userRole === "Home" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-lg">
                    {/* Street */}
                    <div className="flex items-center flex-col col-span-2">
                      <label htmlFor="street" className="block text-gray-700">
                        Street:
                      </label>
                      <input
                        id="street"
                        type="text"
                        name="street"
                        value={formData.street}
                        readOnly={!editMode}
                        onChange={handleChange}
                        required
                        className={`text-center ${
                          editMode ? "editable-styles" : "read-only-styles"
                        }`}
                      />
                    </div>

                    {/* City */}
                    <div className="flex items-center flex-col col-span-2">
                      <label htmlFor="city" className="block text-gray-700">
                        City:
                      </label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        value={formData.city}
                        readOnly={!editMode}
                        onChange={handleChange}
                        required
                        className={`text-center ${
                          editMode ? "editable-styles" : "read-only-styles"
                        }`}
                      />
                    </div>

                    {/* State - Preset to California and Read-only */}
                    <div className="flex items-center flex-col col-span-2">
                      <label htmlFor="state" className="block text-gray-700">
                        State:
                      </label>
                      <input
                        id="state"
                        type="text"
                        name="state"
                        value="California"
                        readOnly
                        className="text-center read-only-styles"
                      />
                    </div>

                    {/* Email Address */}
                    <div className="flex items-center flex-col col-span-2">
                      <label htmlFor="lastName" className="block text-gray-700">
                        Email
                      </label>
                      <input
                        id="businessEmail"
                        type="email"
                        name="businessEmail"
                        placeholder="email@something.com"
                        readOnly={!editMode}
                        value={formData.businessEmail}
                        onChange={handleChange}
                        required
                        className={`px-4 py-2  border   rounded-md focus:outline-none focus:border-blue-500 text-center ${
                          editMode
                            ? "bg-slate-100 border-slate-200"
                            : "bg-slate-200 border-grean font-bold"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="min-h-[20%] max-h-[20%] flex flex-col items-center justify-center w-full p-2 bg-slate-800">
          <section className="flex w-full items-center justify-center gap-2 p-2 h-[70%]">
            {roles.map((role) => (
              <div className="flex flex-col items-center justify-center">
                <motion.div
                  key={role.name}
                  className={`flex flex-col items-center justify-center border aspect-square w-16 h-16 text-center rounded-md gap-1 cursor-pointer ${
                    formData.userRole === role.name
                      ? "border-slate-800 bg-grean text-white font-bold "
                      : "border-none"
                  }`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, userRole: role.name }))
                  }
                >
                  <ion-icon
                    className={`text-white ${
                      formData.userRole === role.name
                        ? "text-white"
                        : "text-slate-800"
                    }`}
                    size="small"
                    name={role.icon}
                  ></ion-icon>
                  <label className="text-xs">{role.name}</label>
                </motion.div>
              </div>
            ))}
          </section>
          <section
            className="flex w-full items-center justify-center h-[30%]"
            id="profileFormBtns"
          >
            <div className="flex items-center gap-4 w-full">
              <Link
                to="/account"
                type="button"
                onClick={handleEdit}
                className="w-full h-full px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:bg-blue-600 text-center"
              >
                Back
              </Link>
              {editMode ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full h-full px-4 py-2 bg-grean text-white rounded-md focus:outline-none focus:bg-green-600"
                >
                  Save
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="w-full h-full px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:bg-blue-600"
                >
                  Unlock
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
    </form>
  );
};

export default ProfileUpdate;
