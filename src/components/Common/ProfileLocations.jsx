import { useEffect, useState } from "react";
import { useAuthProfile } from "../../context/AuthProfileContext";
import AddLocation from "./AddLocation";
import SpringModal from "../Layout/Modals/SpringModal";

function ProfileLocations() {
  const { profile } = useAuthProfile();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileAddresses, setProfileAddresses] = useState([])

  useEffect(() => {
    setProfileAddresses(profile.locations.addresses)
  },[profile])

  const openAddLocationModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <main className="w-full h-full flex flex-col justify-between gap-2 container mx-auto">
      <SpringModal
        isOpen={isModalVisible}
        handleClose={handleCloseModal}
        showCloseButton={false}
      >
        <AddLocation handleClose={handleCloseModal} />
      </SpringModal>
      <div
        id="locationDetails"
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none no-scroll p-4 gap-4"
      >
        {profileAddresses && profileAddresses.map((address, index) => (
          <div
            key={index}
            className="section flex-none w-full h-full flex justify-center items-center snap-center bg-white p-4 rounded-md"
          >
            <div className="flex flex-col text-center w-full h-full p-4">
              <span>{address.locationType}</span>
              <span>{address.street}</span>
              <span>{address.city}</span>
              <span>{address.state}</span>
            </div>
          </div>
        ))}

        {profileAddresses.length === 0 && (
          <div className="section rounded-md flex-none w-full h-full flex justify-center items-center snap-center bg-white">
            <div
              variant="primary"
              className="aspect-square flex flex-col items-center justify-center gap-2"
              size="large"
              onClick={openAddLocationModal}
            >
              Add a Location!
              <ion-icon name="arrow-down-outline"></ion-icon>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ProfileLocations;
