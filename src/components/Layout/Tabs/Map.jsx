import { useState } from "react";
import { usePickups } from "../../../context/PickupsContext";
import { useAuthProfile } from "../../../context/AuthProfileContext";
import RequestPickup from "../../Common/RequestPickup";
import Schedule from "../../Common/Schedule";
import Alerts from "../../Common/Alerts";
import MapBox from "../MapBox";
import Button from "../Button";
import SpringModal from "../Modals/SpringModal";
import { motion } from "framer-motion";
import UserPickups from "../../Common/UserPickups";

function Map() {
  const { profile } = useAuthProfile();
  const {userAcceptedPickups, userCreatedPickups, visiblePickups} = usePickups();
  const [requestPickupOpen, setRequestPickupOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  const closeRequestPickup = () => setRequestPickupOpen(false);
  const openRequestPickup = () => setRequestPickupOpen(true);

  const closeSchedule = () => setScheduleOpen(false);
  const openSchedule = () => setScheduleOpen(true);

  const closeAlerts = () => setAlertsOpen(false);
  const openAlerts = () => setAlertsOpen(true);

  return (
    <main id="mapTab" className="relative w-full h-full">
      <MapBox /> 

      <SpringModal
        isOpen={alertsOpen}
        handleClose={closeAlerts}
        showCloseButton={true}
      >
        <Alerts handleClose={closeAlerts} />
      </SpringModal>

      <SpringModal
        isOpen={requestPickupOpen}
        handleClose={closeRequestPickup}
        showCloseButton={true}
      >
        <RequestPickup handleClose={closeRequestPickup} />
      </SpringModal>

      <SpringModal
        isOpen={scheduleOpen}
        handleClose={closeSchedule}
        showCloseButton={true}
      >
        <Schedule handleClose={closeSchedule} />
      </SpringModal>

      <div
        id="actionBtns"
        className="absolute w-full bottom-8 z-10 flex items-center justify-center"
      >
        <div className="container mx-auto">
          <div className="max-w-[650px] flex justify-end m-auto rounded-md">
            <div className="flex justify-center items-end w-full gap-8 px-5">
              {profile?.accountType === "User" && (
                <div className="flex flex-row w-full basis-3/5 justify-between items-center gap-2">
                  <Button
                    variant="primary"
                    size="large"
                    onClick={requestPickupOpen ? closeRequestPickup : openRequestPickup}
                    className="rounded-lg text-white border-2 border-white font-bold"
                  >
                    Request Pickup
                  </Button>

                  <Button
                    variant="primary"
                    size="small"
                    shape="square"
                    onClick={alertsOpen ? closeAlerts : openAlerts}
                    className="border-white font-bold rounded-md border-2 md:order-1 bg-green-300 text-grean aspect-square flex items-center justify-center w-14 h-14 focus:ring-grean focus:ring-offset-2 focus:outline-none focus:ring-2 relative"
                  >
                    <ion-icon
                      className="text-grean"
                      size="large"
                      name="leaf-outline"
                    ></ion-icon>
                    <span className="sr-only">View Pickups</span>

                    <span className="text-grean bg-white rounded-full w-8 h-8 flex items-center justify-center absolute bottom-10 left-10">{userCreatedPickups.length}</span>
                  </Button>
                </div>
              )}
              {profile?.accountType === "Driver" && (
                <div className="flex md:flex-row gap-4 items-center justify-center">
                  <motion.button
                    className="rounded-md bg-white bg-green-300 text-blue-500 aspect-square border border-yellow-200 flex items-center justify-center drop-shadow-xl w-14 h-14 relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scheduleOpen ? closeSchedule : openSchedule}
                  >
                    <ion-icon
                      size="large"
                      name="calendar-number-outline"
                    ></ion-icon>
                    <span className="sr-only">View Schedule</span>
                    <span className="text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center absolute bottom-10 left-10">
                      {
                        userAcceptedPickups.filter(
                          (pickup) => !pickup.isCompleted
                        ).length
                      }
                    </span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={alertsOpen ? closeAlerts : openAlerts}
                    className="relative rounded-md p-1 w-14 h-14 bg-white text-red-500 focus:outline-none focus:ring-2 border border-yellow-200 focus:ring-blue-300 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <ion-icon
                      size="large"
                      name="notifications-outline"
                    ></ion-icon>
                    <span className="sr-only">View notifications</span>

                    <span className="text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center absolute bottom-10 left-10">
                      {visiblePickups.length}
                    </span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Map;
