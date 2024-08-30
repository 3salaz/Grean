import { useState } from "react";
import { usePickups } from "../../../../context/PickupsContext";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import RequestPickup from "./RequestPickup";
import Schedule from "./Schedule";
import Alerts from "./Alerts";
import MapBox from "./MapBox";
import { motion } from "framer-motion";
import {
  IonIcon,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonContent
} from "@ionic/react";
import {
  leafOutline,
  calendarNumberOutline,
  notificationsOutline,
} from "ionicons/icons";
import AddLocation from "../Profile/AddLocation";

function Map() {
  const { profile } = useAuthProfile();
  const { userAcceptedPickups, userCreatedPickups, visiblePickups } = usePickups();
  const [requestPickupOpen, setRequestPickupOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [addLocationOpen, setAddLocationOpen] = useState(false);

  const closeRequestPickup = () => setRequestPickupOpen(false);
  const openRequestPickup = () => setRequestPickupOpen(true);

  const closeSchedule = () => setScheduleOpen(false);
  const openSchedule = () => setScheduleOpen(true);

  const closeAlerts = () => setAlertsOpen(false);
  const openAlerts = () => setAlertsOpen(true);

  const closeAddLocation = () => setAddLocationOpen(false);
  const openAddLocation = () => setAddLocationOpen(true);
  
  return (
    <IonContent id="mapTab" className="relative w-full h-full">
      <MapBox />

      <IonModal isOpen={alertsOpen} onDidDismiss={closeAlerts}>
        <Alerts handleClose={closeAlerts} />
      </IonModal>

      <IonModal isOpen={requestPickupOpen} onDidDismiss={closeRequestPickup}>
        <RequestPickup handleClose={closeRequestPickup} />
      </IonModal>

      <IonModal isOpen={scheduleOpen} onDidDismiss={closeSchedule}>
        <Schedule handleClose={closeSchedule} />
      </IonModal>

      <IonModal isOpen={addLocationOpen} onDidDismiss={closeAddLocation}>
        <AddLocation handleClose={closeAddLocation} />
      </IonModal>
      
      <div id="actionBtns" className="absolute w-full bottom-0 z-10 flex items-center justify-center pb-4">
        <IonGrid>
          <IonRow className="justify-center">
            {profile?.accountType === "User" && profile?.addresses.length > 0 && (
              <IonCol size="auto" className="flex justify-between items-center gap-2">
                <IonButton
                  expand="block"
                  color="primary"
                  onClick={requestPickupOpen ? closeRequestPickup : openRequestPickup}
                  className="rounded-lg text-white font-bold drop-shadow-xl"
                >
                  Request Pickup
                </IonButton>

                <IonButton
                  expand="block"
                  color="secondary"
                  onClick={alertsOpen ? closeAlerts : openAlerts}
                  className="rounded-md bg-green-300 text-grean drop-shadow-xl"
                >
                  <IonIcon
                    className="text-white"
                    size="large"
                    icon={leafOutline}
                  />
                  <span className="sr-only">View Pickups</span>
                  <span className="text-grean bg-white rounded-full w-8 h-8 flex items-center justify-center absolute bottom-10 right-0">{userCreatedPickups.length}</span>
                </IonButton>
              </IonCol>
            )}

            {profile?.accountType === "User" && profile?.addresses.length === 0 && (
              <IonCol size="auto" className="flex items-center justify-center">
                  <IonButton
                  expand="block"
                  color="primary"
                  size="large"
                  onClick={addLocationOpen ? closeAddLocation : openAddLocation}
                  className="rounded-lg text-white font-bold drop-shadow-xl"
                >
                  Add Location
                </IonButton>
              </IonCol>
            )}

            {profile?.accountType === "Driver" && (
              <IonCol size="auto" className="flex gap-4 items-center justify-center">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IonButton
                    expand="block"
                    color="tertiary"
                    onClick={scheduleOpen ? closeSchedule : openSchedule}
                    className="rounded-md bg-green-300 text-blue-500 drop-shadow-xl"
                  >
                    <IonIcon
                      size="large"
                      icon={calendarNumberOutline}
                    />
                    <span className="sr-only">View Schedule</span>
                    <span className="text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center absolute bottom-10 left-10">
                      {userAcceptedPickups.filter(pickup => !pickup.isCompleted).length}
                    </span>
                  </IonButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IonButton
                    expand="block"
                    color="danger"
                    onClick={alertsOpen ? closeAlerts : openAlerts}
                    className="relative rounded-md p-1 w-14 h-14 bg-white text-red-500"
                  >
                    <IonIcon
                      size="large"
                      icon={notificationsOutline}
                    />
                    <span className="sr-only">View notifications</span>
                    <span className="text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center absolute bottom-10 left-10">
                      {visiblePickups.length}
                    </span>
                  </IonButton>
                </motion.div>
              </IonCol>
            )}
          </IonRow>
        </IonGrid>
      </div>
    </IonContent>
  );
}

export default Map;
