import { useState } from "react";
import AddLocation from "./AddLocation";
import ProfileLocations from "./ProfileLocations";
import { useAuthProfile } from "../../../../context/AuthProfileContext";
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonImg,
  IonText,
  IonToolbar,
  IonModal,
  IonCol,
  IonRow,
  IonContent,
  IonGrid,
  IonFooter,
} from "@ionic/react";
import avatar from "../../../../assets/avatar.svg";
import userIcon from "../../../../assets/icons/user.png";
import driverIcon from "../../../../assets/icons/driver.png";
import {
  addCircleOutline,
  createOutline,
  locationOutline,
  settingsOutline,
} from "ionicons/icons";
import DriverPickups from "./DriverPickups";

function Profile() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [profileAddresses, setProfileAddresses] = useState([]);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const [addressToEdit, setAddressToEdit] = useState(null);

  const { profile } = useAuthProfile();
  const handleCloseAddModal = () => {
    setIsAddModalVisible(false);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const openAddLocationModal = () => {
    setIsAddModalVisible(true);
  };

  const handleEdit = () => {
    const address = profileAddresses[currentAddressIndex];
    setAddressToEdit(address);
    setIsEditModalVisible(true);
    console.log("Editing address:", address);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
  };

  const getUserRoleInfo = () => {
    switch (profile?.accountType) {
      case "Driver":
        return { icon: driverIcon, text: "Driver" };
      case "User":
        return { icon: userIcon, text: "User" };
      default:
        return { icon: "person-outline", text: "null" };
    }
  };

  const userRoleInfo = getUserRoleInfo();

  return (
    <IonGrid className="h-full flex flex-col ion-no-padding">
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

      <IonHeader color="secondary">
        <IonToolbar color="secondary">
          <IonRow className="ion-align-items-center ion-justify-content-between px-2 p-1">
            <IonCol size="auto">
              <div className="flex flex-col items-start justify-center">
                <IonText className="text-large font-bold text-white">
                  {profile.displayName}
                </IonText>
                <IonText className="text-xs bg-grean text-white font-bold rounded-lg p-1 mt-1">
                  ID: {profile.email}
                </IonText>
              </div>
            </IonCol>

            <IonCol
              size="auto"
              className="ion-align-items-center ion-text-center"
            >
              <div className="w-10 h-10 bg-white rounded-md overflow-hidden flex flex-col flex-wrap items-center justify-end">
                <IonImg
                  className="w-full h-full object-cover"
                  src={userRoleInfo.icon}
                  alt="User Icon"
                />
              </div>
              <IonText className="text-sm text-white">
                  {userRoleInfo.text}
                </IonText>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonHeader>

      <IonRow id="locationDetails" className="flex-grow container mx-auto flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth">
        {profile.accountType === "User" && <ProfileLocations />}
        {profile.accountType === "Driver" && <DriverPickups />}
      </IonRow>

      <IonFooter color="primary" className="rounded-t-md">
        <IonToolbar>

          {profile?.addresses.length === 0 && profile.accountType === "User" && (
              <IonRow className="ion-justify-content-between">
                <IonCol size="2">
                  <IonButton color="danger">
                    <IonIcon
                      color="light"
                      icon={settingsOutline}
                      slot="icon-only"
                    />
                  </IonButton>
                </IonCol>
                <IonCol size="8">
                  <IonButton
                    color="primary"
                    onClick={openAddLocationModal}
                    expand="block"
                    fill="solid"
                  >
                    <IonIcon
                      color="light"
                      slot="start"
                      icon={locationOutline}
                    ></IonIcon>
                    Add Location
                  </IonButton>
                </IonCol>
              </IonRow>
          )}

          {profile?.addresses.length > 0 && profile.accountType === "User" && (
            <IonRow className="ion-justify-content-between">
              <IonCol size="3" className="ion-text-start">
                <IonButton shape="round" color="danger">
                  <IonIcon slot="icon-only" icon={settingsOutline} />
                </IonButton>
              </IonCol>
              <IonCol
                size="6"
                color="primary"
                className="ion-text-center ion-align-items-center text-black"
              >
                <IonText className="p-0 m-0">
                  <h5 className="p-0 m-0">2624 3rd St.</h5>
                </IonText>

                <IonText>
                  <p className="p-0 m-0">San Francisco, Ca</p>
                </IonText>
              </IonCol>

              <IonCol size="3" className="ion-text-end">
                <IonButton
                  shape="round"
                  color="secondary"
                  onClick={openAddLocationModal}
                >
                  <IonIcon slot="icon-only" icon={addCircleOutline} />
                </IonButton>
              </IonCol>
            </IonRow>
          )}
          {profile?.addresses.length > 0 && profile.accountType === "Driver" && (
              <IonRow className="ion-justify-content-between ion-padding-horizontal">
                <IonCol size="auto" className="ion-align-self-center">
                  <IonButton shape="round" color="danger">
                    <IonIcon slot="icon-only" icon={settingsOutline} />
                  </IonButton>
                </IonCol>
                <IonCol
                  size="auto"
                  className="ion-text-center ion-align-self-center text-black"
                >
                  <IonText className="text-3xl">
                    {profile.displayName}
                  </IonText>
                </IonCol>

                {/* <IonCol size="3" className="ion-text-end">
                  <IonButton
                    shape="round"
                    color="secondary"
                    onClick={openAddLocationModal}
                  >
                    <IonIcon slot="icon-only" icon={addCircleOutline} />
                  </IonButton>
                </IonCol> */}
              </IonRow>
          )}

        </IonToolbar>
      </IonFooter>
    </IonGrid>
  );
}
export default Profile;
