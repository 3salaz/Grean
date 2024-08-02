import { useEffect, useState } from "react";
import { UserAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLocations } from "../../../context/LocationContext";
import { useProfile } from "../../../context/ProfileContext";

const ProfileForm = () => {
  const { user } = UserAuth();
  const { profile, updateProfile } = useProfile();
  const { updateLocation } = useLocations(); // Use updateLocation from LocationsContext
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
    // any other location-related data you want to include
  };

  const [editMode, setEditMode] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  console.log(error);

  useEffect(() => {
    setFormData(profile || {}); // Update formData whenever the profile data changes
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
        const { lat, lon } = data[0]; // Assuming the first result is the most relevant
        setCoordinates({ lat, lng: lon });
        setError("");
        return { lat, lng: lon }; // Return the coordinates for further processing
      } else {
        setError("No results found. Please try a different address.");
        return null; // Return null to indicate no coordinates were found
      }
    } catch (err) {
      setError("An error occurred while geocoding. Please try again.");
      console.error(err);
      return null; // Return null in case of an error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Initialize coords with a default value
    let coords = { lat: null, lng: null };
    const fullAddress = `${formData.street}, ${formData.city}, California`;

    // Only geocode the address if the user role is "Business"
    if (formData.userRole === "Business") {
      const geocodedCoords = await handleGeocodeAddress();
      if (!geocodedCoords) {
        toast.error(
          "Could not geocode address. Please check the address details."
        );
        return; // Exit if geocoding fails
      }
      // Update coords with geocoded values
      coords = geocodedCoords;
    }
    // Prepare updated form data. Include coordinates only if they are not null.
    console.log(coordinates);
    const updatedFormData = {
      ...formData,
      fullAddress,
      ...(coords.lat && coords.lng ? { lat: coords.lat, lng: coords.lng } : {}),
    };

    try {
      await updateProfile(updatedFormData);
      // Update location only if user role is "Business" and geocoded coordinates are valid
      if (formData.userRole === "Business" && coords.lat && coords.lng) {
        await updateLocation({ ...locationData, ...coords });
      }
      toast.success("Profile saved successfully!");
      // navigate("/account");
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
    // Update form data if validation passes
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear the error message if validation passes
    setError(null);
  };

  const handleEdit = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  const isValidEmail = (email) => {
    // Regular expression for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  return (
    <form className="container mx-auto h-[85%]  rounded-lg flex flex-col items-center gap-4">
      <main className="w-full h-full flex flex-col relative">
        <section
          className="flex flex-col h-[80%] overflow-auto gap-8 px-2 text-gray-dark"
          id="profileFormDetails"
        >
          <div className="bg-red-300 rounded-md drop-shadow-lg p-4 gap-4 flex flex-col w-full">
            {/* Profile */}
            <div className="bg-light-grey flex flex-col justify-start items-start gap-2">
              <div className="flex items-center gap-1">
                <ion-icon
                  size="large"
                  className="font-bold"
                  name="person-circle-outline"
                ></ion-icon>
                <div className="text-lg font-bold">Profile</div>
              </div>
              <div className="text-sm">
                Please fill out the details below to save your details.
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 w-full">
              {/* First Name */}
              <div
                id="firstName"
                className="flex items-center flex-col col-span-2"
              >
                <label className="block text-gray-700" htmlFor="firstName">
                  First Name
                </label>
                <input
                  className={`px-4 py-2 border  md:basis-4/6 rounded-md focus:outline-none focus:border-blue-500 text-center
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
                className="flex items-center flex-col col-span-2"
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
                  className={`py-2 border rounded-md focus:outline-none focus:border-blue-500 text-center ${
                    editMode // Toggle className based on editMode
                      ? "bg-slate-100 border-slate-200"
                      : "bg-slate-200 border-grean"
                  }`}
                />
              </div>
            </div>
          </div>

          <div
            className={`rounded-md drop-shadow-lg p-4 gap-4 flex flex-col ${
              formData.userRole === "Business" ? "bg-blue-200" : "bg-red-300"
            }`}
          >
            {/* Business Info */}
            {formData.userRole === "Business" && (
              <div className="">
                {/* Profile */}
                <div className="bg-light-grey flex flex-col justify-start items-start gap-2">
                  <div className="flex items-center gap-1">
                  <ion-icon className="font-bold" size="large" name="business-outline"></ion-icon>
                    <div className="text-lg font-bold">Business</div>
                  </div>
                  <div className="text-sm">Business details.</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-lg">
                  {/* Business */}
                  <div className="flex items-center flex-col col-span-2">
                    <label
                      htmlFor="businessName"
                      className="block text-gray-700 basis-2/6"
                    >
                      Business Name:
                    </label>
                    <input id="businessName"
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      readOnly={!editMode}
                      onChange={handleChange}
                      required
                      className={`px-4 py-2 border  md:basis-4/6 rounded-md focus:outline-none focus:border-blue-500 text-center 
                      ${
                        editMode
                          ? "bg-slate-100 border-slate-200"
                          : "bg-slate-200 border-grean font-bold"
                      }`} // Toggle class name based on editMode
                    />
                  </div>
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
                      className={`px-4 py-2 border  md:basis-4/6 rounded-md focus:outline-none focus:border-blue-500 text-center ${
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
                      className={`px-4 py-2 border  md:basis-4/6 rounded-md focus:outline-none focus:border-blue-500 text-center ${
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
                      value="California" // Preset value
                      readOnly // Always read-only
                      className="px-4 py-2 border  md:basis-4/6 rounded-md focus:outline-none focus:border-blue-500 text-center read-only-styles"
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
                      readOnly={!editMode} // Set readOnly based on editMode
                      value={formData.businessEmail}
                      onChange={handleChange}
                      required
                      className={`px-4 py-2  border   rounded-md focus:outline-none focus:border-blue-500 text-center ${
                        editMode
                          ? "bg-slate-100 border-slate-200"
                          : "bg-slate-200 border-grean font-bold"
                      }`} // Toggle class name based on editMode
                    />
                  </div>
                  {/* Website */}
                  <div className="flex items-center flex-col col-span-2">
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
                      className={`px-4 py-2  border   rounded-md focus:outline-none focus:border-blue-500 text-center ${
                        editMode
                          ? "bg-slate-100 border-slate-200"
                          : "bg-slate-200 border-grean font-bold"
                      }`} // Toggle class name based on editMode
                    />
                  </div>
                  {/* Description */}
                  <div className="flex items-center flex-col col-span-2">
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
                      className={`px-4 py-2  border   rounded-md focus:outline-none focus:border-blue-500 text-center ${
                        editMode
                          ? "bg-slate-100 border-slate-200"
                          : "bg-slate-200 border-grean font-bold"
                      }`} // Toggle class name based on editMode
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {formData.userRole === "Driver" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center flex-col col-span-4">
                  <label
                    htmlFor="businessName"
                    className="block text-gray-700 basis-2/6"
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
                    className={`px-4 py-2 border  md:basis-4/6 rounded-md focus:outline-none focus:border-blue-500 text-center 
                ${
                  editMode
                    ? "bg-slate-100 border-slate-200"
                    : "bg-slate-200 border-grean font-bold"
                }`} // Toggle class name based on editMode
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
                    value="California" // Preset value
                    readOnly // Always read-only
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
                    readOnly={!editMode} // Set readOnly based on editMode
                    value={formData.businessEmail}
                    onChange={handleChange}
                    required
                    className={`px-4 py-2  border   rounded-md focus:outline-none focus:border-blue-500 text-center ${
                      editMode
                        ? "bg-slate-100 border-slate-200"
                        : "bg-slate-200 border-grean font-bold"
                    }`} // Toggle class name based on editMode
                  />
                </div>
              </div>
            )}
          </div>
        </section>
        
        <div className="h-[20%] flex flex-col gap-2 items-center justify-center w-full pb-2">
          <section className="flex flex-row  w-full items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center border w-20 aspect-square bg-white rounded-md">
              <input
                id="home"
                type="radio"
                name="userRole"
                value="Home"
                checked={formData.userRole === "Home"}
                disabled={!editMode}
                onChange={handleChange}
                className="w-full"
              />
              <label htmlFor="home" className="ml-2">
                Home
              </label>
            </div>
            <div className="flex flex-col items-center justify-center border w-20 aspect-square bg-white rounded-md">
              <input
                id="driver"
                type="radio"
                name="userRole"
                value="Driver"
                checked={formData.userRole === "Driver"}
                disabled={!editMode}
                onChange={handleChange}
                className="w-full"
              />
              <label htmlFor="driver" className="ml-2">
                Driver
              </label>
            </div>
            <div className="flex flex-col items-center justify-center border w-20 aspect-square bg-white rounded-md">
            <ion-icon name="business-outline"></ion-icon>
              <input
                id="business"
                type="radio"
                name="userRole"
                value="Business"
                checked={formData.userRole === "Business"}
                disabled={!editMode}
                onChange={handleChange}
                className="w-full"
              />
              <label htmlFor="business" className="ml-2">
                Business
              </label>
            </div>
          </section>
          <section
            className="flex w-full md:w-1/3 items-start justify-center"
            id="profileFormBtns"
          >
            <div className="w-2/3 flex items-center gap-4">
              {editMode ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full order-last px-4 py-2 bg-grean text-white rounded-md focus:outline-none focus:bg-grean"
                >
                  Save
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="w-full order-last px-4 py-2 bg-blue-500  text-white rounded-md  focus:outline-none focus:bg-blue-500"
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

export default ProfileForm;
