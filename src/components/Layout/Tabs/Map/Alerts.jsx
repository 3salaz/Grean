import { motion } from "framer-motion";
import { usePickups } from "../../../../context/PickupsContext";
import { useProfile } from "../../../../context/ProfileContext";
import noPickupIcon from "../../../../assets/no-pickups.svg";

function Alerts() {
  const { visiblePickups, acceptPickup, userCreatedPickups, removePickup } = usePickups();
  const { profile } = useProfile(); // Access the user's profile, including the userRole

  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert hour 0 to 12
    return `${hours}:${minutes} ${ampm}`;
  };

  const sortedPickups = userCreatedPickups.sort((a, b) => {
    if (!a.accepted && b.accepted) return -1;
    if (a.accepted && !b.accepted) return 1;
    if (a.accepted && !a.isCompleted && b.accepted && b.isCompleted) return -1;
    if (a.accepted && a.isCompleted && b.accepted && !b.isCompleted) return 1;
    return 0;
  });

  return (
    <div
      id="alerts"
      className="w-full h-[95%] bg-grean flex justify-center items-center overflow-auto"
    >
      <div className="max-h-full min-h-full h-full w-full">
        {profile?.userRole === "Business" ? (
          <section className="h-full bg-grean flex flex-col border-white border-4 rounded-t-lg">
            <header className="h-[15%] flex flex-col gap-1 py-2">
              <div className="text-center text-xl font-bold text-white">
                My Pickup Request
              </div>
              <div className="text-xs text-center text-grean font-bold bg-white container p-2 mx-auto">
                Your pickups will be displayed below
              </div>
            </header>

            <main className="h-[85%] flex flex-col items-center justify-start">
              <ul className="w-full gap-3 flex flex-col overflow-scroll p-2">
                {sortedPickups.length > 0 ? (
                  sortedPickups.map((pickup) => {
                    const addressParts = pickup.businessAddress.split(",");
                    const street = addressParts[0] || "";
                    const city = addressParts[1] || "";

                    const dateParts = pickup.pickupDate.split("-");
                    const formattedDate = `${dateParts[1]}/${dateParts[2]}`;

                    const formattedTime = convertTo12HourFormat(pickup.pickupTime);

                    return (
                      <li
                        key={pickup.id}
                        className="border border-grean shadow-xl rounded-md max-h-24 p-1 flex flex-col bg-white text-slate-800 relative"
                      >
                        <div className="text-sm">{`${street}, ${city}`}</div>
                        <p className="text-sm">{formattedDate}</p>
                        <p className="text-sm">{formattedTime}</p>
                        <div className="flex flex-col text-xs">
                          <div className="accepted-status">
                            {pickup.isAccepted ? (
                              <span className="accepted">
                                Accepted by: {pickup.acceptedBy.substring(0, 8)}
                              </span>
                            ) : (
                              <span className="not-accepted">Not Accepted</span>
                            )}
                          </div>
                          <div className="completion-status">
                            {pickup.isCompleted ? (
                              <div className="w-full absolute top-0 left-0 h-full rounded-md drop-shadow-xl">
                                <div className="bg-grean p-2 w-8 h-8 aspect-square flex items-center justify-center text-white absolute top-1 right-1 rounded-md">
                                  <ion-icon
                                    size="large"
                                    name="checkmark-circle"
                                  ></ion-icon>
                                </div>
                                <motion.button
                                  className="bg-orange text-white px-1 py-2 absolute bottom-1 right-1 rounded-md"
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.8 }}
                                  onClick={() => removePickup(pickup.id)}
                                >
                                  Remove
                                </motion.button>
                              </div>
                            ) : (
                              <span className="not-completed"></span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-white px-2 rounded-full w-20 aspect-square flex items-center justify-center bounce">
                      <img
                        src={noPickupIcon}
                        alt="recycling can with a stop sign, icon "
                      />
                    </div>
                    <div className="text-center bg-slate-800 text-white font-bold p-2 rounded-md">
                      No pickups to display
                    </div>
                  </div>
                )}
              </ul>
            </main>
          </section>
        ) : (
          <div
            id="pickupsAvailable"
            className="h-full bg-red-500 flex flex-col border-white border-4 rounded-t-lg"
          >
            <header className="h-[15%] flex flex-col items-center justify-center gap-1">
              <div className="text-center text-lg font-bold text-white">
                Pickups Available
              </div>
              <div className="text-xs text-center text-grean font-bold bg-white container p-2 mx-auto">
                Approve, Decline or Be Reminded Later
              </div>
            </header>

            <main className="h-[85%] flex flex-col items-center justify-start">
              <ul className="w-full gap-3 flex flex-col overflow-scroll p-2">
                {visiblePickups.length > 0 ? (
                  visiblePickups.map((pickup) => (
                    <li
                      key={pickup.id}
                      className="flex gap-4 flex-col bg-light py-2"
                    >
                      <div className="flex justify-center items-center gap-3">
                        <img
                          className="rounded-full basis-1/6"
                          src={pickup.ownerImg}
                          alt="Owner"
                        ></img>
                        <div className="bg-white p-2 rounded-md basis-4/6">
                          <div className="font-bold text-xs">
                            {pickup.businessAddress}
                          </div>
                          <div className="text-sm text-gray">
                            {pickup.ownerEmail}
                          </div>
                        </div>
                      </div>

                      <div className="container mx-auto px-2 rounded-full">
                        <p className="text-center bg-white py-2">
                          {pickup.pickupNote || "No notes"}
                        </p>
                      </div>

                      <div className="flex justify-center items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          className="p-1 px-4 bg-grean text-white rounded-xl drop-shadow-md"
                          onClick={() => acceptPickup(pickup.id)}
                        >
                          Accept
                        </motion.button>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="bg-white px-2 rounded-full w-20 aspect-square flex items-center justify-center bounce">
                      <img
                        src={noPickupIcon}
                        alt="recycling can with a stop sign, icon "
                      />
                    </div>
                    <div className="text-center bg-slate-800 text-white font-bold p-2 rounded-md">
                      No pickups to display
                    </div>
                  </div>
                )}
              </ul>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

export default Alerts;
