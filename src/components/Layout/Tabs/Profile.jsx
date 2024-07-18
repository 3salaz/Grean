import { useEffect, useState } from "react";
import UserHeader from "../../Common/UserHeader";
import { useAuthProfile } from "../../../context/AuthProfileContext";
import { useLocations } from "../../../context/LocationsContext";
import Button from "../Button";
import AddLocation from "../../Common/AddLocation";
import SpringModal from "../Modals/SpringModal";
import ProfileLocations from "../../Common/ProfileLocations";


function Profile() {
  const { usersLocation } = useLocations();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { profile } = useAuthProfile();
  console.log(profile.locations.addresses.length)

  useEffect(() => {
    console.log("usersLocation updated:", usersLocation);
  }, [usersLocation]);

  const openAddLocationModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <main
      id="profile"
      className="w-full h-full z-20 flex flex-col items-center justify-between relative"
    >
      <SpringModal
        isOpen={isModalVisible}
        handleClose={handleCloseModal}
        showCloseButton={false}
      >
        <AddLocation handleClose={handleCloseModal} />
      </SpringModal>

      <UserHeader />

      <div className="w-full h-full flex flex-col justify-between gap-2 container mx-auto bg-light-gray pb-6">
        <ProfileLocations />
        
        {profile.locations.addresses.length > 0 && (
          <div className="flex justify-between items-center gap-2">
            <div className="flex justify-center gap-4 h-10 w-full">
              <Button
                size="small"
                className="rounded-md bg-green text-white flex flex-col items-center justify-center"
                onClick={openAddLocationModal}
              >
                <ion-icon size="large" name="add-circle-outline"></ion-icon>
              </Button>

              <Button
                size="small"
                className="rounded-md bg-white flex flex-col items-center justify-center"
              >
                <ion-icon size="large" name="create-outline"></ion-icon>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Profile;
