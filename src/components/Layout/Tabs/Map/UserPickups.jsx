import { motion } from "framer-motion";
import { usePickups } from "../../../../context/PickupsContext";

function UserPickups({ handleClose }) {
  const {
    // pickups,
    // visiblePickups,
    // acceptPickup,
    userCreatedPickups,
    // deletePickup,
  } = usePickups();

  const handleRefresh = () => {
    // This should refresh my current 'visiblePickups' to include all pickups from my profile collection that have not been accepted.
  };

  return (
    <div
      id="userPickups"
      className="w-full relative h-full bg-black bg-opacity-40 bg-blur-10 px-2 z-20 flex justify-center items-center"
    >
      <div className="max-w-[600px] h-[90%] flex flex-col container drop-shadow-2xl rounded-lg text-slate bg-white border-grean border-4">
        <header className="basis-1/6 flex flex-col gap-1 py-2">
          <div className="text-center text-xl font-bold text-white">
            Notifications
          </div>
          <div className="text-sm text-center text-grean bg-white container p-2 mx-auto">
            Approve, Decline or Be Reminded Later
          </div>
        </header>
        <main className="h-[90%] flex flex-col basis-5/6 items-center justify-center">
          <ul className="n-list w-full basis-5/6 max-h-[100%] gap-3 flex flex-col overflow-scroll p-2">
            {userCreatedPickups.length > 0 ? (
              userCreatedPickups.map((pickup) => (
                <li
                  key={pickup.id}
                  className="border border-grean shadow-xl rounded-xl p-2 flex"
                >
                  {/* Pickup Details */}
                  <div className="flex flex-col justify-center basis-3/5">
                    <div className="text-xl">{pickup.businessAddress}</div>
                    <div className="flex items-center text-lg">
                      <p className="font-bold">{pickup.pickupDate}</p>
                      <p className="">{pickup.pickupTime}</p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {/* Display Accepted Status */}
                    <div className="accepted-status">
                      {pickup.accepted ? (
                        <span className="accepted">
                          Accepted by : {pickup.acceptedBy}
                        </span>
                      ) : (
                        <span className="not-accepted">Not Accepted</span>
                      )}
                    </div>

                    {/* Display Completion Status */}
                    <div className="completion-status">
                      {pickup.isCompleted ? (
                        <div>
                          <span className="completed">
                            Completed by : {pickup.acceptedBy}
                          </span>
                          <ion-icon name="checkmark-circle-outline"></ion-icon>
                        </div>
                      ) : (
                        <span className="not-completed">Not Completed</span>
                      )}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <IonRow className="ion-text-center bg-slate-200 h-full">
                <IonCol
                  size="6"
                  className="h-full mx-auto flex items-center justify-center"
                >
                  <IonText>No pickups to display</IonText>
                </IonCol>
              </IonRow>
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

export default UserPickups;
