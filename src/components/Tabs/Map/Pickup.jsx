import { useEffect, useState } from "react";
import { UserAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import mapScreen from "../../../assets/mapScreen.png";
import "react-toastify/dist/ReactToastify.css";
import { usePickups } from "../../../context/PickupsContext";
import { useProfile } from "../../../context/ProfileContext";

function Pickup({ handleClose }) {
  const { createPickup } = usePickups();
  const { profile } = useProfile();

  const [formData, setFormData] = useState({
    pickupDate: getCurrentDate(),
    pickupTime: "12:00",
    pickupNote: "",
    businessAddress: "",
  });

  useEffect(() => {
    // Check if profile data is available and has the address field
    console.log(profile);
    if (profile && profile.fullAddress) {
      setFormData((prevData) => ({
        ...prevData,
        businessAddress: profile.fullAddress, // Set the address from the profile context
      }));
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const { user } = UserAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    createPickup(formData);
    handleClose();
  };

  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let day = now.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    return `${year}-${month}-${day}`;
  }

  return (
    <div
      id="pickup"
      className="w-full absolute top-0 h-full bg-black bg-opacity-40 z-20 flex justify-center items-center px-4"
    >
      <div className="bg-white max-w-[600px] h-[90%] container rounded-md drop-shadow-2xl flex items-center justify-center">
        <form
          className="h-full w-full px-4 py-2 flex flex-col justify-between"
          onSubmit={handleSubmit}
        >
          <section className="flex flex-col gap-4">
            <header className="text-center text-3xl font-bold bg-grean py-4 rounded-md text-white">
              Pickup Request
            </header>
            <img
              className="object-cover h-52 w-full bg-green"
              src={mapScreen}
            ></img>
            <section className="flex flex-col gap-8 overflow-auto">
              <label className="flex flex-col font-bold">
                Business Address:
                <select
                  name="pickupAddress"
                  value={formData.address}
                  onChange={handleChange}
                  className="rounded-lg p-2 font-normal"
                >
                  {/* Ensure there's a default option or handling for when businessAddress is not yet fetched */}
                  {formData.businessAddress && (
                    <option value={formData.businessAddress}>
                      {formData.businessAddress}
                    </option>
                  )}
                </select>
              </label>
              <div className="flex">
                <label className="flex flex-col font-bold basis-1/2 items-center justify-center">
                  Date:
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    min={getCurrentDate()}
                    onChange={handleChange}
                    className="text-2xl font-normal"
                  />
                </label>

                <label className="flex flex-col font-bold basis-1/2 items-center justify-center">
                  Time:
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    className="text-2xl font-normal"
                  />
                </label>
              </div>

              <label
                htmlFor="pickupNote"
                className="block text-lg font-bold leading-6 text-center"
              >
                Pickup Notes:
              </label>

              <textarea
                id="pickupNote"
                name="pickupNote"
                rows={3}
                className="block rounded-md border-0 p-2 text-black shadow-sm ring-1 ring-inset ring-grean placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-grean sm:text-sm sm:leading-6"
                defaultValue={""}
                onChange={handleChange}
                
              />
            </section>
          </section>

          <section className="flex items-center justify-center flex-row gap-8 p-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-grean text-white px-2 p-1 rounded-md w-40"
              type="submit"
            >
              Submit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-red-500 text-white px-2 p-1 rounded-md w-40"
              onClick={handleClose}
            >
              Close
            </motion.button>
          </section>
        </form>
      </div>
    </div>
  );
}

export default Pickup;
