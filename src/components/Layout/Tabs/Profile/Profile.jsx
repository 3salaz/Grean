import { useEffect, useRef, useState } from "react";
import AddLocation from "./AddLocation";
import ProfileHeader from "./ProfileHeader";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import { IonCol, IonFooter, IonGrid, IonModal, IonRow } from "@ionic/react";

import userIcon from "../../../../assets/icons/user.png";
import driverIcon from "../../../../assets/icons/driver.png";
import MyForest from "./MyForest";
import MyLocations from "./MyLocations";
import Impact from "./Impact";
import LevelProgress from "./LevelProgress";

function Profile() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [profileAddresses, setProfileAddresses] = useState([]);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const { profile } = useAuthProfile(); // Ensures profile is available before usage
  const addressRefs = useRef([]);

  useEffect(() => {
    if (profile?.locations) {
      setProfileAddresses(profile.locations || []);
    }
  }, [profile]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = addressRefs.current.indexOf(entry.target);
            setCurrentAddressIndex(index);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    addressRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      addressRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const handleCloseAddModal = () => {
    setIsAddModalVisible(false);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <IonGrid className="h-full overflow-auto flex flex-col ion-no-padding bg-gradient-to-t from-grean to-blue-300 sm:px-8">
      <IonModal isOpen={isAddModalVisible} onDidDismiss={handleCloseAddModal}>
        <AddLocation handleClose={handleCloseAddModal} />
      </IonModal>

      <IonModal
        isOpen={isModalVisible}
        onDidDismiss={handleCloseModal}
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        <AddLocation handleClose={handleCloseModal} />
      </IonModal>

      <main className="container mx-auto max-w-4xl h-full">
        {profile.locations.length > 0 && profile.accountType === "User" && (
          <IonRow className="w-full">
            <LevelProgress/> 
            <MyForest />
            <IonCol className="mx-auto container px-2">
              <Impact />
            </IonCol>
          </IonRow>
        )}
      </main>

      <MyLocations />
      <IonFooter className="container max-w-4xl mx-auto bg-white rounded-t-md">
        <ProfileHeader />
      </IonFooter>

    </IonGrid>
  );
}

export default Profile;
