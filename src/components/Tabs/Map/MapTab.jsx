import { useState } from "react";
import { motion } from "framer-motion";
import { usePickups } from "../../../context/PickupsContext";
import { useProfile } from "../../../context/ProfileContext"; // Import the useProfile hook
import Pickup from "./Pickup";
import Calendar from "./Calendar";
import Notifications from "./Notifications";
import UserPickups from "./UserPickups";

function MapTab() {
  const { profile } = useProfile(); // Access the user's profile, including the userRole
  const {
    // pickups,
    visiblePickups,
    userAcceptedPickups,
    userCreatedPickups,
    // completedPickups,
  } = usePickups();

  // Modal state management
  const [pickupOpen, setRequestPickupOpen] = useState(false);
  const [userPickupsOpen, setUserPickupOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Modal handlers
  const closePickup = () => setRequestPickupOpen(false);
  const openPickup = () => setRequestPickupOpen(true);
  const closeCalendar = () => setCalendarOpen(false);
  const openCalendar = () => setCalendarOpen(true);
  const closeNotifications = () => setNotificationsOpen(false);
  const openNotifications = () => setNotificationsOpen(true);
  const closeUserPickups = () => setUserPickupOpen(false);
  const openUserPickups = () => setUserPickupOpen(true);

  return (
    <div id="mapTab" className="bg-white">
      {/* Conditionally render the Pickup Modal based on userRole */}
      {profile?.userRole === "Business" && pickupOpen && (
        <Pickup modalOpen={pickupOpen} handleClose={closePickup} />
      )}

      {/* Notifications and Calendar Modals */}
      {notificationsOpen && (
        <Notifications
          modalOpen={notificationsOpen}
          handleClose={closeNotifications}
        />
      )}

      {calendarOpen && (
        <Calendar modalOpen={calendarOpen} handleClose={closeCalendar} />
      )}

      {userPickupsOpen && (
        <UserPickups
          modalOpen={userPickupsOpen}
          handleClose={closeUserPickups}
        />
      )}

      {/* <div className="absolute flex flex-col top-0 right-5 rounded-b-md bg-white">
        <div className="text-2xl">
          Total Pickups:
          <span className="text-3xl font-bold">{pickups.length}</span>
        </div>
        <div className="text-2xl">
          Total Visible Pickups:
          <span className="text-3xl font-bold">{visiblePickups.length}</span>
        </div>
        <div className="text-2xl">
          Users Accepted Pickups:
          <span className="text-3xl font-bold">
            {userAcceptedPickups.length}
          </span>
        </div>
        <div className="text-2xl">
          Total Completed Pickups:
          <span className="text-3xl font-bold">{completedPickups.length}</span>
        </div>
      </div> */}

      {/* UI for modals' trigger buttons */}
      <div className="absolute w-full bottom-10 z-10 flex items-center justify-center">
        {/* Container */}
        <div className="container mx-auto">
          <div className="max-w-[650px] flex justify-end m-auto rounded-md drop-shadow-xl">
            <div className="flex justify-center items-end w-full gap-8 px-5">
              {/* Conditional rendering for Pickup request button based on userRole */}
              {profile?.userRole === "Business" && (
                <div className="flex flex-col w-full basis-3/5 justify-between gap-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={pickupOpen ? closePickup : openPickup}
                    className="flex items-center justify-center rounded-lg bg-grean text-yellow-200 border-2 border-yellow-200 p-2 px-3 basis-4/5"
                  >
                    Request Pickup
                  </motion.button>
                </div>
              )}

              {profile?.userRole === "Business" ? (
                // Business View
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                  <motion.button
                    className="rounded-md bg-white order-2 md:order-1 bg-green-300 text-grean  aspect-square border-2  flex items-center justify-center drop-shadow-xl w-14 h-14 focus:ring-grean focus:ring-offset-2 focus:outline-none focus:ring-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={calendarOpen ? closeUserPickups : openUserPickups}
                  >
                    <ion-icon size="large" name="leaf-outline"></ion-icon>
                    <span className="sr-only">View Pickups</span>
                    <span className="text-white bg-grean rounded-full w-8 h-8 flex items-center justify-center absolute bottom-10 left-10">
                      {userCreatedPickups.length}
                    </span>
                  </motion.button>
                </div>
              ) : (
                // Driver View
                <div className="flex flex-row gap-8 items-center justify-center">
                  <motion.button
                    className="rounded-md bg-white bg-green-300 text-blue-500  aspect-square border border-yellow-200 flex items-center justify-center drop-shadow-xl w-14 h-14"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={calendarOpen ? closeCalendar : openCalendar}
                  >
                    <ion-icon
                      size="large"
                      name="calendar-number-outline"
                    ></ion-icon>
                    <span className="sr-only">View notifications</span>
                    <span className="text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center absolute bottom-10 left-10">
                      {userAcceptedPickups.filter(pickup => !pickup.isCompleted).length}
                    </span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={
                      pickupOpen ? closeNotifications : openNotifications
                    }
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
    </div>
  );
}

export default MapTab;
