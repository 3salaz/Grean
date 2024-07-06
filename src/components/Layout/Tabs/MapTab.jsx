import { useState } from "react";
import { motion } from "framer-motion";
import { usePickups } from "../../../context/PickupsContext";
import { useAuthProfile } from "../../../context/AuthProfileContext";
import RequestPickup from "../../Common/RequestPickup";
import Schedule from "../../Common/Schedule";
import Alerts from "../../Common/Alerts";
import Map from "../Map";
import SlideModal from "../Modals/SlideModal";
import Button from "../Button";

function MapTab() {
  const { profile } = useAuthProfile();
  const { visiblePickups, userAcceptedPickups, userCreatedPickups } = usePickups();
  const [pickupOpen, setRequestPickupOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const closePickup = () => setRequestPickupOpen(false);
  const openPickup = () =>  setRequestPickupOpen(true);
  const closeSchedule = () => setScheduleOpen(false);
  const openSchedule = () => setScheduleOpen(true);
  const closeAlerts = () => setAlertsOpen(false);
  const openAlerts = () => setAlertsOpen(true);

  return (
    <main id="mapTab" className="relative w-full h-full">
      <Map />
      <SlideModal isOpen={pickupOpen} handleClose={closePickup}>
        <RequestPickup handleClose={closePickup} />
      </SlideModal>

      <SlideModal isOpen={alertsOpen} handleClose={closeAlerts}>
        <Alerts handleClose={closeAlerts} />
      </SlideModal>

      <SlideModal isOpen={scheduleOpen} handleClose={closeSchedule}>
        <Schedule handleClose={closeSchedule} />
      </SlideModal>

      <div id="actionBtns" className="absolute w-full bottom-8 z-10 flex items-center justify-center">
        <div className="container mx-auto">
          <div className="max-w-[650px] flex justify-end m-auto rounded-md">
            <div className="flex justify-center items-end w-full gap-8 px-5">
              {(profile?.userRole === "Business" || profile?.userRole === "Home") && (
                <div className="flex flex-col w-full basis-3/5 justify-between gap-6">
                  <Button
                    variant="primary"
                    size="large"
                    onClick={pickupOpen ? closePickup : openPickup}
                    className="flex items-center justify-center rounded-lg bg-grean text-white border-2 border-white font-bold p-2 px-3"
                  >
                    Request Pickup
                  </Button>
                </div>
              )}
              {(profile?.userRole === "Business" || profile?.userRole === "Home") ? (
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                  <motion.button
                    className="rounded-md bg-white order-2 md:order-1 bg-green-300 text-grean aspect-square border-2 flex items-center justify-center w-14 h-14 focus:ring-grean focus:ring-offset-2 focus:outline-none focus:ring-2 relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={alertsOpen ? closeAlerts : openAlerts}
                  >
                    <ion-icon size="large" name="leaf-outline"></ion-icon>
                    <span className="sr-only">View Pickups</span>
                    <span className="text-white bg-grean rounded-full w-8 h-8 flex items-center justify-center absolute bottom-10 left-10">
                      {userCreatedPickups.length}
                    </span>
                  </motion.button>
                </div>
              ) : (
                <div className="flex flex-row gap-8 items-center justify-center">
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

export default MapTab;
