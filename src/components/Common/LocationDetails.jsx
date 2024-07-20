import { useState } from "react";
import Button from "../Layout/Button";
import SpringModal from "../Layout/Modals/SpringModal";
import AddLocation from "./AddLocation";

import { useAuthProfile } from "../../context/AuthProfileContext";

function LocationDetails() {
  const { profile } = useAuthProfile();
  const [isModalVisible, setIsModalVisible] = useState(false);
  console.log(profile.locations.addresses.length)

  const openAddLocationModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div
      id="locationDetails"
      className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none"
    >
      <SpringModal
        isOpen={isModalVisible}
        handleClose={handleCloseModal}
        showCloseButton={false}
      >
        <AddLocation
          handleClose={handleCloseModal}
        />
      </SpringModal>
      {/* {usersLocation.map((address, index) => (
        <div
          key={index}
          className="section flex-none w-full h-full flex justify-center items-center snap-center bg-blue-100"
        >
          {address.street}, {address.city}, {address.state}
        </div>
      ))} */}
      {true && (
        <div className="section rounded-md flex-none w-full h-full flex justify-center items-center snap-center">
          <Button variant="primary" className="aspect-square flex flex-col gap-2" size="large"  onClick={openAddLocationModal}>
            Add a Location!
            <ion-icon name="add-circle-outline"></ion-icon>
          </Button>
        </div>
      )}
    </div>
  );
}

export default LocationDetails;
