import { motion } from "framer-motion";
import { usePickups } from "../../../context/PickupsContext";
import { useEffect, useState } from "react";

function Calendar({ handleClose }) {
  const { userAcceptedPickups, completePickup } = usePickups();
  const [formInputs, setFormInputs] = useState({});

  useEffect(() => {
    const initialFormStates = {};
    userAcceptedPickups.forEach((pickup) => {
      initialFormStates[pickup.id] = { weight: "", receipt: null };
    });
    setFormInputs(initialFormStates);
  }, [userAcceptedPickups]); // Depend on userAcceptedPickups to re-run this effect

  // Handle changes in form inputs and update the state
  const handleInputChange = (pickupId, name, value) => {
    setFormInputs((prev) => ({
      ...prev,
      [pickupId]: {
        ...prev[pickupId],
        [name]: value,
      },
    }));
  };

  function formatDateInfo(dateString) {
    if (!dateString) return { dayOfWeek: "", monthName: "", day: "", year: "" };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { dayOfWeek: "Invalid Date", monthName: "", day: "", year: "" };
    }
    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "long", // "Monday", "Tuesday", etc.
      month: "long", // "January", "February", etc.
      day: "numeric", // 1, 2, 3, etc.
      year: "numeric", // 2021, 2022, etc.
    });

    const formattedDate = formatter.formatToParts(date).reduce((acc, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});

    return {
      dayOfWeek: formattedDate.weekday,
      monthName: formattedDate.month,
      day: formattedDate.day,
      year: formattedDate.year,
    };
  }

  // Corrected handleSubmit function
  const handleSubmit = async (pickupId, e) => {
    e.preventDefault();
    const { weight } = formInputs[pickupId] || {}; // Ensure we don't destructure undefined

    // Assuming receipt handling is done elsewhere and we only need to pass weight
    await completePickup(pickupId, weight);

    // Clear form inputs for this pickup after submission
    setFormInputs((prev) => ({
      ...prev,
      [pickupId]: { weight: "" },
    }));

    handleClose(); // Close the form/modal if needed
  };

  return (
    <div
      id="calendar"
      className="w-full absolute top-0 h-full bg-black bg-opacity-40 bg-blur-10 z-20 flex justify-center items-center px-2"
    >
      <div className="max-w-[600px] h-[90%] container drop-shadow-2xl rounded-lg text-slate bg-white border-grean border-4">
        <motion.section className="h-full w-full flex flex-col items-center  justify-center z-[100] py-4">
          <header className="w-full flex gap-2 justify-start items-center pl-12">
            <section className="text-8xl font-bold">
              {userAcceptedPickups === null
                ? "Loading..."
                : userAcceptedPickups.filter((pickup) => !pickup.isCompleted)
                    .length}
            </section>
            <section className="h-full flex flex-col justify-end items-start pb-4">
              <div className="text-2xl font-bold">My Schedule</div>
              <div className="text-md">Pickups Accepted</div>
            </section>
          </header>

          <main className="w-[90%] max-w-[90%] h-[48rem] flex gap-2 overflow-x-scroll snap-proximity snap-x no-scroll">
            {userAcceptedPickups
              .filter((pickup) => !pickup.isCompleted)
              .map((pickup) => {
                // Assuming formatDateInfo is correctly implemented to parse pickupDate
                const { dayOfWeek, monthName, day, year } = formatDateInfo(
                  pickup.pickupDate
                );

                return (
                  <section
                    key={pickup.id}
                    className="min-w-[90%] bg-slate-700 rounded-lg snap-center shadow-xl p-2"
                  >
                    <div className="w-full flex items-center justify-between px-4 gap-3 h-[25%] text-white">
                      <div className="flex flex-col text-left">
                        <div className="text-5xl text-orange">{dayOfWeek}</div>
                        <div className="text-2xl">
                          {monthName} {day}, {year}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-white text-slate-800 rounded-md h-[75%]">
                      <div className="text-center flex flex-col gap-4 p-4 justify-center h-full">
                        {/* Adjusted to display businessAddress and pickupNote */}
                        <div className="text-lg">{pickup.businessAddress}</div>
                        <div className="text-xl font-bold">
                          Pickup Note: {pickup.pickupNote}
                        </div>
                        <div>{pickup.id}</div>

                        {/* Displaying pickupTime */}
                        <div className="text-5xl font-bold">
                          {pickup.pickupTime}
                        </div>

                        {/* Assuming you have a way to generate directions based on businessAddress */}
                        <a
                          href={`https://maps.google.com/?q=${pickup.businessAddress}`}
                          className="text-xl text-orange underline"
                        >
                          Get Directions
                        </a>
                        <div className="bg-light-gray p-4 rounded-md">
                          <form
                            className="flex flex-col gap-4 container"
                            onSubmit={(e) => handleSubmit(pickup.id, e)}
                          >
                            <label>Weight of Pickup</label>
                            <div className="flex gap-2 items-center justify-center">
                              <input
                                name="weight"
                                type="number"
                                onChange={(e) =>
                                  handleInputChange(
                                    pickup.id,
                                    "weight",
                                    e.target.value
                                  )
                                }
                                value={formInputs[pickup.id]?.weight || ""}
                                required
                              />
                              <span>Lbs</span>
                            </div>
                            <div>
                              <button
                                type="submit"
                                className="bg-grean py-1 px-3 rounded-full"
                              >
                                Complete Pickup
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
          </main>

          <footer className="w-full px-8">
            <div className="flex justify-end items-center">
              <ion-icon
                size="large"
                name="arrow-forward-circle-outline"
              ></ion-icon>
            </div>
            <div className="flex justify-center items-center gap-2 py-2">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="bg-grean text-white rounded-md justify-center text-center items-center"
                onClick={handleClose}
              >
                <div className="flex items-center justify-center p-2 px-4 gap-1">
                  <ion-icon size="large" name="list-circle-outline"></ion-icon>
                  <div className="text-md font-bold">View List</div>
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="bg-red-500 flex text-white p-2 rounded-md justify-center text-center items-center"
                onClick={handleClose}
              >
                <ion-icon
                  className="stroke-slate-500 bg-red-500"
                  size="large"
                  name="close-circle-outline"
                ></ion-icon>
              </motion.button>
            </div>
          </footer>
        </motion.section>
      </div>
    </div>
  );
}

export default Calendar;
