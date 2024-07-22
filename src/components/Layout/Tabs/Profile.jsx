import { useState } from "react";
import UserHeader from "../../Common/UserHeader";
import Button from "../Button";
import AddLocation from "../../Common/AddLocation";
import SpringModal from "../Modals/SpringModal";
import ProfileLocations from "../../Common/ProfileLocations";

function Profile() {
  const [isModalVisible, setIsModalVisible] = useState(false);

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

      <div className="w-full h-full flex flex-col justify-between container mx-auto bg-light-gray pb-6">
        <ProfileLocations />

        <div className="flex justify-between items-center px-4">
          <div className="flex justify-end gap-4 h-10 w-full rounded-full">
            <Button
              variant="primary"
              size="small"
              shape="circle"
              className="bg-grean text-white flex flex-col items-center justify-center p-2"
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
      </div>
    </main>
  );
}

export default Profile;
