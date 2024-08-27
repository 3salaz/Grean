import { useState } from "react";
import UserHeader from "../../../Common/UserHeader";
import AddLocation from "./AddLocation";
import ProfileLocations from "./ProfileLocations";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { addCircleOutline, settingsOutline } from "ionicons/icons";
import { IonIcon, IonButton, IonModal, IonContent } from "@ionic/react";
import { motion } from "framer-motion";

function Profile() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { profile } = useAuthProfile();

  const openAddLocationModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <IonContent id="profile"
      className="w-full h-full z-20 flex flex-col items-center justify-start relative"
    >
      <IonModal isOpen={isModalVisible} onDidDismiss={handleCloseModal}>
        <AddLocation handleClose={handleCloseModal} />
      </IonModal>

      <UserHeader />

      <main className="w-full h-[75%] flex flex-col justify-between container mx-auto relative">
        {profile.accountType === "User" && <ProfileLocations />}
        {profile.accountType === "Driver" && (
          <IonContent className="w-full h-full flex flex-col justify-between gap-2 container mx-auto">
            <IonModal isOpen={isModalVisible} onDidDismiss={handleCloseModal}>
              <AddLocation handleClose={handleCloseModal} />
            </IonModal>
            <div
              id="locationDetails"
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none no-scroll p-4 gap-4 bg-orange"
            >
              Driver Content Goes Here
            </div>
          </IonContent>
        )}
        {profile.accountType === "User" && profile?.addresses.length === 0 && (
          <div className="flex justify-between items-center px-4">
            <div className="flex justify-end gap-4 h-10 w-full rounded-full">
              <IonButton
                fill="solid"
                size="small"
                shape="round"
                color="primary"
                onClick={openAddLocationModal}
                className="flex items-center justify-center p-2"
              >
                <IonIcon icon={addCircleOutline} size="large" />
              </IonButton>
            </div>
          </div>
        )}
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center absolute bottom-0 left-0 ml-4 h-14 w-14 aspect-square rounded-full bg-red-500"
        >
          <IonButton
            fill="clear"
            color="danger"
            className="w-full h-full aspect-square"
            onClick=""
          >
            <IonIcon
              className="text-white"
              icon={settingsOutline}
              size="large"
            />
          </IonButton>
        </motion.div>
      </main>
    </IonContent>
  );
}

export default Profile;
