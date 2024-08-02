import { motion } from "framer-motion";
import { usePickups } from "../../../context/PickupsContext";

function Notifications({ handleClose }) {
  const {
    pickups,
    visiblePickups,
    acceptPickup,
  } = usePickups();

  const handleRefresh = () => {
    // This should refresh my current 'visiblePickups' to include all pickups from my profile collection that have not been accepted.
  };

  return (
    <div
      id="notifications"
      className="w-full absolute top-0 h-full bg-black bg-opacity-40 bg-blur-10 px-2 z-20 flex justify-center items-center"
    >
      <div className="max-w-[600px] h-[90%] flex flex-col container drop-shadow-2xl rounded-lg text-slate bg-white border-grean border-4">
        <header className="bg-[''] basis-1/6 flex flex-col gap-1 py-2">
          <div className="text-center text-xl font-bold text-white">
            Notifications
          </div>
          <div className="text-sm text-center text-grean bg-white container p-2 mx-auto">
            Approve, Decline or Be Reminded Later
          </div>
        </header>
        <main className="h-[90%] flex flex-col basis-5/6 items-center justify-center">
          <ul className="n-list w-full basis-5/6 max-h-[100%] gap-3 flex flex-col overflow-scroll p-2">
            {visiblePickups.length > 0 ? (
              visiblePickups.map((pickup) => (
                <li
                  key={pickup.id}
                  className="flex gap-4 flex-col bg-light py-2"
                >
                  <div className="flex justify-center items-center gap-3">
                    {/* Assuming ownerImg is a valid field in your pickup objects */}
                    <img
                      className="rounded-full basis-1/6"
                      src={pickup.ownerImg} // Ensure this field exists or adjust accordingly
                      alt="Owner"
                    ></img>
                    <div className="bg-white p-2 rounded-md basis-4/6">
                      {/* Using businessAddress from your database */}
                      <div className="font-bold">{pickup.businessAddress}</div>
                      {/* Assuming ownerEmail is a valid field in your pickup objects */}
                      <div className="text-sm text-gray">
                        {pickup.ownerEmail}
                      </div>
                    </div>
                  </div>
                  <div className="container mx-auto px-2 rounded-full">
                    {/* Using pickupNote from your database, fallback to "No notes" if not provided */}
                    <p className="text-center bg-white py-2">
                      {pickup.pickupNote || "No notes"}
                    </p>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      className="p-1 px-4 text-grean bg-white rounded-xl drop-shadow-md"
                      onClick={() => acceptPickup(pickup.id)}
                    >
                      Accept
                    </motion.button>
                    {/* <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      className="px-2 text-red-500"
                      onClick={() => declinePickup(pickup.id)}
                    >
                      Decline
                    </motion.button> */}
                  </div>
                </li>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No pickups to display
              </div>
            )}
          </ul>
          <section className="h-full w-full basis-1/6 flex flex-col items-center bg-grean shadow-xl justify-center z-[100]">
            <div className="flex justify-center items-center gap-4 py-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-yellow-400 text-white drop-shadow-lg rounded-md justify-center text-center items-center"
                onClick={handleRefresh}
              >
                <div className="flex items-center justify-center p-2 px-4 gap-1">
                  <ion-icon
                    size="large"
                    name="refresh-circle-outline"
                  ></ion-icon>
                  <div className="text-md font-bold">Refresh</div>
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
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
          </section>
        </main>
      </div>
    </div>
  );
}

export default Notifications;
