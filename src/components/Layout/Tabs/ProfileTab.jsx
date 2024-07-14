import { useEffect, useState } from "react";
import UserHeader from "../../Common/UserHeader";
import { useAuthProfile } from "../../../context/AuthProfileContext";
import { useLocations } from "../../../context/LocationsContext";
import Button from "../Button";
import AddLocation from "../../Common/AddLocation";
import SpringModal from "../Modals/SpringModal";

function ProfileTab() {
  const { profile } = useAuthProfile();
  const { createLocation } = useLocations();
  const [addresses, setAddresses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (profile?.locations?.addresses) {
      setAddresses(profile.locations.addresses);
    }
  }, [profile]);

  const handleAddLocation = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSaveLocation = async (newAddress) => {
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    // Assuming you have a method to update the user's profile
    await createLocation(profile.uid, { addresses: updatedAddresses });
    handleCloseModal();
  };

  return (
    <main
      id="profileTab"
      className="w-full h-full bg-light-gray z-20 flex flex-col items-center relative p-6"
    >
      <SpringModal isOpen={isModalVisible} handleClose={handleCloseModal}>
        <AddLocation onSave={handleSaveLocation} />
      </SpringModal>
      <div className="w-full h-full flex flex-col justify-start gap-4 container mx-auto">
        <UserHeader />
        <div
          id="locationInfo"
          className="w-full h-[70%] flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overscroll-none"
        >
          {addresses.map((address, index) => (
            <div
              key={index}
              className="section flex-none w-full h-full flex justify-center items-center snap-center bg-blue-100"
            >
              {address.street}, {address.city}, {address.state}
            </div>
          ))}
          <div
            className="section rounded-md flex-none w-full h-full flex justify-center items-center snap-center bg-blue-400"
            onClick={handleAddLocation}
          >
            Add a Location!
          </div>
        </div>

        <div className="flex justify-between items-center gap-2">
          <div className="rounded-md flex items-center justify-center">
            <div variant="primary" className="text-sm px-2">
              {addresses.length > 0 ? `${addresses[0].street}, ${addresses[0].city}, ${addresses[0].state}` : "No address available"}
            </div>
          </div>
          <div className="flex justify-center gap-4 h-16">
            <Button
              size="medium"
              className="rounded-md bg-green text-white flex flex-col items-center justify-center aspect-square"
              onClick={handleAddLocation}
            >
              <ion-icon size="large" name="add-circle-outline"></ion-icon>
            </Button>
            <Button className="aspect-square bg-white rounded-md">Edit</Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProfileTab;
