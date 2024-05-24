import { motion } from "framer-motion";
import { usePickups } from "../../../context/PickupsContext";
import { useEffect, useState } from "react";

function Schedule({ handleClose }) {
  const { userAcceptedPickups, completePickup } = usePickups();
  const [formInputs, setFormInputs] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const initialFormStates = {};
    userAcceptedPickups.forEach((pickup) => {
      initialFormStates[pickup.id] = {
        aluminumWeight: "",
        plasticWeight: "",
        receipt: null,
      };
    });
    setFormInputs(initialFormStates);
  }, [userAcceptedPickups]);

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
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
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

  const handleSubmit = async (pickupId, e) => {
    e.preventDefault();
    const { aluminumWeight, plasticWeight } = formInputs[pickupId] || {};

    if (!aluminumWeight && !plasticWeight) {
      setError("Please enter weight for either aluminum or plastic.");
      return;
    }

    setError("");
    await completePickup(pickupId, { aluminumWeight, plasticWeight });

    setFormInputs((prev) => ({
      ...prev,
      [pickupId]: { aluminumWeight: "", plasticWeight: "" },
    }));

    handleClose();
  };

  return (
    <div
      id="calendar"
      className="w-full h-[90%] flex justify-center items-center overflow-auto bg-white rounded-lg"
    >
      <div className="max-w-[600px] h-full container rounded-lg text-slate-800">
        <section className="h-full w-full flex flex-col items-center justify-center z-[100] gap-2">
          <header className="w-full flex gap-2 justify-start items-center p-2 px-4">
            <section className="text-5xl font-bold">
              {userAcceptedPickups === null
                ? "Loading..."
                : userAcceptedPickups.filter((pickup) => !pickup.isCompleted)
                    .length}
            </section>
            <section className="h-full flex flex-col justify-center items-end">
              <div className="text-lg font-bold">My Scheduled</div>
              <div className="text-sm">Pickups Accepted</div>
            </section>
          </header>

          <main className="w-full max-w-full px-2 h-[48rem] flex gap-2 overflow-x-scroll snap-proximity snap-x no-scroll">
            {userAcceptedPickups
              .filter((pickup) => !pickup.isCompleted)
              .map((pickup) => {
                const { dayOfWeek, monthName, day, year } = formatDateInfo(
                  pickup.pickupDate
                );

                return (
                  <section
                    key={pickup.id}
                    className="bg-grean rounded-lg snap-center shadow-xl p-2 min-w-[90%] w-full h-full"
                  >
                    <div className="w-full min-h-[20%] flex items-center justify-between px-4 text-white">
                      <div className="flex flex-col text-left">
                        <div className="text-xl text-white font-bold">
                          {dayOfWeek}
                        </div>
                        <div className="text-lg">
                          {monthName} {day}, {year}
                        </div>
                      </div>
                      <div className="flex items-end justify-end h-full text-4xl font-bold">
                        {pickup.pickupTime}
                      </div>
                    </div>
                    <div className="w-full min-h-[80%] bg-white text-slate-800 rounded-md flex flex-col justify-between">
                      <section className="text-center flex flex-grow flex-col gap-2 p-2 items-center justify-center h-full">
                        <div className="w-full h-full">
                          <div className="text-xs font-bold">
                            {pickup.businessAddress}
                          </div>
                          <div className="text-sm font-bold">
                            {pickup.pickupNote}
                          </div>
                        </div>
                      </section>

                      <section className="flex-nonw bg-light-gray p-2 rounded-b-md">
                        <form
                          className="flex flex-col w-full gap-4"
                          onSubmit={(e) => handleSubmit(pickup.id, e)}
                        >
                          <div className="flex w-full gap-2">
                            <div className="flex gap-1 flex-col basis-1/2 px-2 text-center">
                              <label>Aluminum</label>
                              <input
                                name="aluminumWeight"
                                className="w-full"
                                type="number"
                                onChange={(e) =>
                                  handleInputChange(
                                    pickup.id,
                                    "aluminumWeight",
                                    e.target.value
                                  )
                                }
                                value={
                                  formInputs[pickup.id]?.aluminumWeight || ""
                                }
                              />
                            </div>

                            <div className="flex gap-1 flex-col basis-1/2 px-2 text-center">
                              <label>Plastic</label>
                              <input
                                name="plasticWeight"
                                className="w-full"
                                type="number"
                                onChange={(e) =>
                                  handleInputChange(
                                    pickup.id,
                                    "plasticWeight",
                                    e.target.value
                                  )
                                }
                                value={
                                  formInputs[pickup.id]?.plasticWeight || ""
                                }
                              />
                            </div>
                          </div>

                          {error && (
                            <p className="text-red-500 text-lg">{error}</p>
                          )}
                          <a
                            href={`https://maps.google.com/?q=${pickup.businessAddress}`}
                            className="text-base bg-blue-400 text-white rounded-full px-3 py-1 text-center"
                          >
                            Get Directions
                          </a>
                          <button
                            type="submit"
                            className="bg-grean py-1 px-3 rounded-full"
                          >
                            Complete Pickup
                          </button>
                        </form>
                      </section>
                    </div>
                  </section>
                );
              })}
          </main>

          <motion.button
            className="flex justify-center items-center text-slate-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ion-icon
              size="large"
              name="arrow-forward-circle-outline"
            ></ion-icon>
          </motion.button>
        </section>
      </div>
    </div>
  );
}

export default Schedule;
