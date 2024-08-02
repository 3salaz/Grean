import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { usePickups } from "../../context/PickupsContext";
import { useAuthProfile } from "../../context/AuthProfileContext";
import { db } from "../../firebase";

function Schedule({ handleClose }) {
  const { userAcceptedPickups, completePickup } = usePickups();
  const { user } = useAuthProfile();
  const [formInputs, setFormInputs] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (userAcceptedPickups) {
      const initialFormStates = {};
      userAcceptedPickups.forEach((pickup) => {
        initialFormStates[pickup.id] = {
          aluminumWeight: "",
          plasticWeight: "",
          glassWeight: "",
          alcoholBottlesWeight: "",
          receipt: null,
        };
      });
      setFormInputs(initialFormStates);
    }
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

    // Extract form data for the specific pickup
    const { aluminumWeight, plasticWeight, glassWeight, alcoholBottlesWeight } =
      formInputs[pickupId] || {};

    // Validation: Ensure at least one weight is provided
    if (
      !aluminumWeight &&
      !plasticWeight &&
      !glassWeight &&
      !alcoholBottlesWeight
    ) {
      setError("Please enter weight for at least one type of material.");
      return;
    }

    setError("");

    try {
      // Debug: Log the user ID and pickup ID
      console.log("User ID:", user.uid);
      console.log("Pickup ID:", pickupId);

      // Reference to the specific pickup document in the pickups collection
      const pickupDocRef = doc(db, `pickups`, pickupId);

      // Debug: Log the document path
      console.log("Document Path:", pickupDocRef.path);

      // Fetch the document to check if it exists
      const pickupDoc = await getDoc(pickupDocRef);

      // Check if the document exists
      if (!pickupDoc.exists()) {
        setError("Pickup document does not exist.");
        console.error("Pickup document does not exist.");
        return;
      }

      // Update the document with new data
      await updateDoc(pickupDocRef, {
        aluminumWeight,
        plasticWeight,
        glassWeight,
        alcoholBottlesWeight,
        isCompleted: true,
      });

      // Reset the form inputs for the current pickup
      setFormInputs((prev) => ({
        ...prev,
        [pickupId]: {
          aluminumWeight: "",
          plasticWeight: "",
          glassWeight: "",
          alcoholBottlesWeight: "",
        },
      }));

      // Call handleClose to close the form or modal
      handleClose();
    } catch (error) {
      // Log and set error message if the operation fails
      console.error("Error completing pickup:", error);
      setError("Failed to complete the pickup. Please try again.");
    }
  };
  return (
    <div
      id="schedule"
      className="w-full h-[60svh] flex justify-center items-center overflow-auto rounded-lg"
    >
      <div className="max-w-[600px] h-full container rounded-lg text-slate-800">
        <section className="h-full w-full flex flex-col items-center justify-center gap-2">
          <header className="w-full h-[15%] flex gap-2 justify-start items-center p-2 px-4">
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

          <main className="w-full h-[85%] flex gap-2 overflow-x-scroll snap-proximity snap-x no-scroll">
            {userAcceptedPickups
              .filter((pickup) => !pickup.isCompleted)
              .map((pickup) => {
                const { dayOfWeek, monthName, day, year } = formatDateInfo(
                  pickup.pickupDate
                );

                return (
                  <section
                    key={pickup.id}
                    className="bg-grean border-4 border-grean rounded-lg snap-center min-w-[90%] w-full h-full"
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

                      <section className="flex-none bg-light-gray p-2 rounded-b-md">
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
                            <div className="flex gap-1 flex-col basis-1/2 px-2 text-center">
                              <label>Glass</label>
                              <input
                                name="glassWeight"
                                className="w-full"
                                type="number"
                                onChange={(e) =>
                                  handleInputChange(
                                    pickup.id,
                                    "glassWeight",
                                    e.target.value
                                  )
                                }
                                value={formInputs[pickup.id]?.glassWeight || ""}
                              />
                            </div>
                            <div className="flex gap-1 flex-col basis-1/2 px-2 text-center">
                              <label>Alcohol Bottles</label>
                              <input
                                name="alcoholBottlesWeight"
                                className="w-full"
                                type="number"
                                onChange={(e) =>
                                  handleInputChange(
                                    pickup.id,
                                    "alcoholBottlesWeight",
                                    e.target.value
                                  )
                                }
                                value={
                                  formInputs[pickup.id]?.alcoholBottlesWeight ||
                                  ""
                                }
                              />
                            </div>
                          </div>

                          {error && (
                            <p className="text-red-500 text-lg">{error}</p>
                          )}
                          <div className="flex items-center justify-center gap-2">
                            <a
                              href={`https://maps.google.com/?q=${pickup.businessAddress}`}
                              className="text-base bg-blue-400 text-white rounded-full px-3 py-1 text-center"
                            >
                              Directions
                            </a>
                            <button
                              type="submit"
                              className="bg-grean text-white py-1 px-3 rounded-full"
                            >
                              Complete
                            </button>
                          </div>
                        </form>
                      </section>
                    </div>
                  </section>
                );
              })}
          </main>
        </section>
      </div>
    </div>
  );
}

export default Schedule;
