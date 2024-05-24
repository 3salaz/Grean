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
      className="w-full h-[90%] bg-white flex justify-center items-center overflow-auto"
    >
      <form
        className="flex flex-col w-full h-full  border-white border-4 rounded-t-lg"
        onSubmit={handleSubmit}
      >
          <header className="h-[15%] min-h-[75px] flex flex-col gap-1 bg-grean">
            <div className="text-center text-xl font-bold text-white">
              Pickup Request
            </div>
            <div className="text-xs text-center text-grean font-bold bg-white container p-2 mx-auto">
              Schedule your next pickup!
            </div>
          </header>
          <main className="px-2 bg-grean h-[85%]">
            <section className="flex flex-col gap-2 overflow-auto">
              <label className="flex flex-col font-bold gap-1 text-sm">
                Business Address:
                <select
                  name="pickupAddress"
                  value={formData.address}
                  onChange={handleChange}
                  className="rounded-lg p-2 font-normal text-xs"
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
                <label className="flex flex-col text-sm font-bold basis-1/2 items-center justify-center">
                  Date:
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    min={getCurrentDate()}
                    onChange={handleChange}
                    className="text-xs font-normal"
                  />
                </label>

                <label className="flex flex-col text-sm font-bold basis-1/2 items-center justify-center">
                  Time:
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    className="text-xm font-normal"
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
          </main>

        <section className="flex items-center justify-center flex-row pt-2 bg-white w-full">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-grean text-white px-2 p-1 rounded-md w-40"
            type="submit"
          >
            Submit
          </motion.button>
        </section>
      </form>
    </div>
  );
}

export default Pickup;
