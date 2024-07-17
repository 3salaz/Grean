import { useState } from "react";
import { useAuthProfile } from "../../context/AuthProfileContext";
import Button from "../Layout/Button";
import AddLocation from "./AddLocation";
import SpringModal from "../Layout/Modals/SpringModal";

function ProfileLocations() {
  const { profile } = useAuthProfile();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const profileLocations = profile.locations.addresses;

  const openAddLocationModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <main className="w-full h-full flex flex-col justify-between gap-2 container mx-auto">
      <div
        id="locationDetails"
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none no-scroll p-4 gap-4"
      >
        <SpringModal
          isOpen={isModalVisible}
          handleClose={handleCloseModal}
          showCloseButton={false}
        >
          <AddLocation handleClose={handleCloseModal} />
        </SpringModal>
        {profileLocations.map((address, index) => (
          <div
            key={index}
            className="section flex-none w-full h-full flex justify-center items-center snap-center bg-white p-4 rounded-md"
          >
            <div className="flex flex-col text-center w-full h-full p-4">
              <span>{address.street}</span>
              <span>{address.city}</span>
              <span>{address.state}</span>
            </div>
          </div>
        ))}
        {profileLocations > 0 && (
          <div className="section rounded-md flex-none w-full h-full flex justify-center items-center snap-center bg-white">
            <Button
              variant="primary"
              className="aspect-square flex flex-col gap-2"
              size="large"
              onClick={openAddLocationModal}
            >
              Add a Location!
              <ion-icon name="add-circle-outline"></ion-icon>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

export default ProfileLocations;
